import { Product } from '../models/Product.js';

export const getProducts = async (req, res) => {
  const { category, search, sellerId } = req.query;
  const filter = {};

  if (category) {
    filter.category = category;
  }

  if (sellerId) {
    filter.sellerId = sellerId;
  }

  if (search) {
    filter.title = { $regex: search, $options: 'i' };
  }

  try {
    const products = await Product.find(filter);
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products', error: error.message });
  }
};

export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching product details', error: error.message });
  }
};

export const createProduct = async (req, res) => {
  const { title, description, price, discount, stock, category, image } = req.body;

  try {
    if (!title || !description || price === undefined || stock === undefined || !category || !image) {
      return res.status(400).json({ message: 'All required fields must be provided' });
    }

    const product = await Product.create({
      title,
      description,
      price: Number(price),
      discount: discount ? Number(discount) : 0,
      stock: Number(stock),
      category,
      image,
      sellerId: req.user.id,
      reviews: []
    });

    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: 'Error creating product', error: error.message });
  }
};

export const updateProduct = async (req, res) => {
  const { title, description, price, discount, stock, category, image } = req.body;

  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Verify ownership
    if (product.sellerId !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to edit this product' });
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      {
        title: title || product.title,
        description: description || product.description,
        price: price !== undefined ? Number(price) : product.price,
        discount: discount !== undefined ? Number(discount) : product.discount,
        stock: stock !== undefined ? Number(stock) : product.stock,
        category: category || product.category,
        image: image || product.image
      },
      { new: true }
    );

    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: 'Error updating product', error: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Verify ownership
    if (product.sellerId !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this product' });
    }

    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Product successfully deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting product', error: error.message });
  }
};

export const createProductReview = async (req, res) => {
  const { rating, comment, username } = req.body;

  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (!rating || !comment || !username) {
      return res.status(400).json({ message: 'Rating, comment, and username are required' });
    }

    const review = {
      username,
      rating: Number(rating),
      comment,
      createdAt: new Date()
    };

    product.reviews.push(review);
    await product.save();

    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: 'Error adding review', error: error.message });
  }
};
