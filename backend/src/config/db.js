import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, '../../data');

export let isUsingLocalDB = false;

// Ensure local data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

export const connectDB = async () => {
  const mongoURI = process.env.MONGO_URI;
  if (!mongoURI) {
    console.log('⚠️  No MONGO_URI provided. Falling back to local JSON file database...');
    isUsingLocalDB = true;
    return;
  }

  try {
    // Set a short timeout (3 seconds) for quick fallback
    mongoose.set('strictQuery', false);
    await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 3000
    });
    console.log('✅ Connected to MongoDB successfully.');
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    console.log('⚠️  Falling back to local JSON file database...');
    isUsingLocalDB = true;
  }
};

// Document wrapper to support Mongoose-like .save() instance method
class MockDocument {
  constructor(data, saveCallback) {
    Object.assign(this, data);
    if (this._id && !this.id) this.id = this._id;
    if (this.id && !this._id) this._id = this.id;
    
    // Hidden save method
    Object.defineProperty(this, 'save', {
      value: async function() {
        return await saveCallback(this);
      },
      writable: true,
      enumerable: false
    });
  }
}

// MockModel class that mimics Mongoose queries
export class MockModel {
  constructor(modelName) {
    this.modelName = modelName;
    this.filePath = path.join(DATA_DIR, `${modelName.toLowerCase()}s.json`);
    if (!fs.existsSync(this.filePath)) {
      fs.writeFileSync(this.filePath, JSON.stringify([], null, 2));
    }
  }

  async _readData() {
    try {
      const data = await fs.promises.readFile(this.filePath, 'utf-8');
      return JSON.parse(data);
    } catch (err) {
      return [];
    }
  }

  async _writeData(data) {
    await fs.promises.writeFile(this.filePath, JSON.stringify(data, null, 2));
  }

  _wrap(doc) {
    if (!doc) return null;
    return new MockDocument(doc, async (updatedDoc) => {
      const data = await this._readData();
      const index = data.findIndex(item => item._id === updatedDoc._id);
      if (index !== -1) {
        // Exclude methods and helper properties during save
        const cleanDoc = { ...updatedDoc };
        delete cleanDoc.id; // redundant, we use _id
        data[index] = cleanDoc;
        await this._writeData(data);
        return this._wrap(cleanDoc);
      }
      return updatedDoc;
    });
  }

  async find(filter = {}) {
    const data = await this._readData();
    let results = data;

    // Basic filter matching
    if (filter && Object.keys(filter).length > 0) {
      results = data.filter(item => {
        return Object.entries(filter).every(([key, val]) => {
          if (val && typeof val === 'object' && ('$in' in val || '$regex' in val || '$options' in val)) {
            // Support MongoDB operators
            if ('$in' in val) {
              return val.$in.includes(item[key]);
            }
            if ('$regex' in val) {
              const flags = val.$options || '';
              const regex = new RegExp(val.$regex, flags);
              return regex.test(item[key] || '');
            }
          }
          return item[key] === val;
        });
      });
    }

    // Return wrapped documents
    const wrappedResults = results.map(item => this._wrap(item));
    
    // Add simple mock chain methods
    wrappedResults.sort = function(sortFn) {
      // Basic mock sort if needed
      return this;
    };
    wrappedResults.select = function() {
      return this;
    };
    wrappedResults.limit = function(num) {
      return this.slice(0, num);
    };

    return wrappedResults;
  }

  async findOne(filter = {}) {
    const results = await this.find(filter);
    return results.length > 0 ? results[0] : null;
  }

  async findById(id) {
    const stringId = id?.toString() || id;
    return await this.findOne({ _id: stringId });
  }

  async create(docData) {
    const data = await this._readData();
    const newDoc = {
      _id: Math.random().toString(36).substring(2, 11) + Date.now().toString(36),
      ...docData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    data.push(newDoc);
    await this._writeData(data);
    return this._wrap(newDoc);
  }

  async findByIdAndUpdate(id, updateData, options = {}) {
    const stringId = id?.toString() || id;
    const data = await this._readData();
    const index = data.findIndex(item => item._id === stringId);
    
    if (index === -1) return null;

    // Handle Mongoose $set or direct update
    const changes = updateData.$set || updateData;
    const updated = {
      ...data[index],
      ...changes,
      updatedAt: new Date().toISOString()
    };

    data[index] = updated;
    await this._writeData(data);
    return this._wrap(updated);
  }

  async findByIdAndDelete(id) {
    const stringId = id?.toString() || id;
    const data = await this._readData();
    const index = data.findIndex(item => item._id === stringId);
    
    if (index === -1) return null;

    const deleted = data.splice(index, 1)[0];
    await this._writeData(data);
    return this._wrap(deleted);
  }

  async countDocuments(filter = {}) {
    const results = await this.find(filter);
    return results.length;
  }
}

// Utility to export model based on mode
export const createModel = (modelName, mongooseSchema) => {
  const MongooseModel = mongoose.model(modelName, mongooseSchema);
  const localModel = new MockModel(modelName);

  // Return a proxy that directs calls to either MongoDB or the Local Mock JSON Database
  return new Proxy({}, {
    get: (target, prop) => {
      if (!isUsingLocalDB) {
        return MongooseModel[prop];
      } else {
        return localModel[prop];
      }
    },
    construct: (target, args) => {
      if (!isUsingLocalDB) {
        return new MongooseModel(...args);
      } else {
        // Return a mock instance that can be saved
        const data = args[0] || {};
        return new MockDocument(data, async (doc) => {
          return await localModel.create(doc);
        });
      }
    }
  });
};
