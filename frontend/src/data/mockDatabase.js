// A local mock database fallback to make the frontend 100% interactive on static hosts like Netlify
// when the Express server is offline or not deployed.

const INITIAL_PRODUCTS = [
  {
    "_id": "gv9jb1bigmqfe1695",
    "title": "ShopEZ UltraBook Pro 15",
    "description": "High performance laptop with 16GB LPDDR5 RAM, 512GB NVMe PCIe Gen4 SSD, Intel Core i7 13th Gen processor, and a brilliant 15.6-inch borderless IPS display. Features a sleek aluminum chassis, backlit keyboard, and an ultra-thin design. Perfect for productivity, software development, creative design, and lightweight gaming.",
    "price": 999,
    "discount": 10,
    "stock": 12,
    "category": "Electronics",
    "image": "https://images.unsplash.com/photo-1496181130204-755241524eab?w=600&auto=format&fit=crop&q=80",
    "sellerId": "biqtufkhzmqfe168o",
    "reviews": [
      {
        "username": "AlexD",
        "rating": 5,
        "comment": "Amazing performance, compiles code in seconds! Battery life is solid at 8+ hours.",
        "createdAt": "2026-06-15T15:48:32.873Z"
      },
      {
        "username": "SarahK",
        "rating": 4,
        "comment": "Great screen and snappy keyboard. Slightly heavy but the premium build makes up for it.",
        "createdAt": "2026-06-15T16:10:00.000Z"
      }
    ],
    "createdAt": "2026-06-15T15:48:32.873Z",
    "updatedAt": "2026-06-15T15:48:32.873Z"
  },
  {
    "_id": "aroccz9ypmqfe169l",
    "title": "AeroSound Wireless ANC Headphones",
    "description": "Premium active noise-cancelling headphones featuring hybrid ANC technology, custom-engineered 40mm dynamic drivers, and hi-res audio compatibility. Offers up to 40 hours of playtime with ANC enabled, fast USB-C charging, cushiony memory foam earcups, and seamless Bluetooth 5.2 multipoint connectivity.",
    "price": 199,
    "discount": 15,
    "stock": 25,
    "category": "Electronics",
    "image": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80",
    "sellerId": "biqtufkhzmqfe168o",
    "reviews": [
      {
        "username": "MusicLover",
        "rating": 5,
        "comment": "Active noise cancellation is outstanding, completely blocks out subway noise. Bass is tight and punchy.",
        "createdAt": "2026-06-15T15:48:32.889Z"
      }
    ],
    "createdAt": "2026-06-15T15:48:32.889Z",
    "updatedAt": "2026-06-15T15:48:32.889Z"
  },
  {
    "_id": "pixelstream4k27in",
    "title": "PixelStream 27\" 4K UHD IPS Monitor",
    "description": "Stunning 27-inch 4K UHD (3840 x 2160) monitor featuring an IPS panel with 99% sRGB color gamut coverage. Supports VESA DisplayHDR 400, AMD FreeSync, and includes a fully adjustable ergonomic stand (height, tilt, pivot, swivel). Connects via HDMI, DisplayPort, or USB-C with 65W power delivery.",
    "price": 349,
    "discount": 10,
    "stock": 8,
    "category": "Electronics",
    "image": "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600&auto=format&fit=crop&q=80",
    "sellerId": "biqtufkhzmqfe168o",
    "reviews": [
      {
        "username": "DesignPro",
        "rating": 5,
        "comment": "Color accuracy out of the box is brilliant. USB-C single cable setup with my laptop is super clean.",
        "createdAt": "2026-06-15T17:30:00.000Z"
      }
    ],
    "createdAt": "2026-06-15T15:48:32.890Z",
    "updatedAt": "2026-06-15T15:48:32.890Z"
  },
  {
    "_id": "keyvibemechanicalkb",
    "title": "KeyVibe Wireless Mechanical Keyboard",
    "description": "Compact 75% layout wireless mechanical keyboard featuring hot-swappable tactile brown switches. Comes with premium dye-subbed PBT keycaps, sound-dampening foam, custom per-key RGB backlighting, and Bluetooth 5.1/2.4Ghz/Wired tri-mode connectivity. Compatible with Windows, Mac, and iOS.",
    "price": 89,
    "discount": 15,
    "stock": 15,
    "category": "Electronics",
    "image": "https://images.unsplash.com/photo-1618384887929-16ec33faf9c1?w=600&auto=format&fit=crop&q=80",
    "sellerId": "biqtufkhzmqfe168o",
    "reviews": [],
    "createdAt": "2026-06-15T15:48:32.891Z",
    "updatedAt": "2026-06-15T15:48:32.891Z"
  },
  {
    "_id": "hyperglidewirelessmouse",
    "title": "HyperGlide Ultra-Lightweight Gaming Mouse",
    "description": "Ergonomic wireless gaming mouse weighing only 58 grams. Equipped with a custom 26,000 DPI optical sensor, durable optical switches rated for 90 million clicks, and zero-latency wireless connection. Includes up to 80 hours of battery life and smooth-gliding PTFE feet.",
    "price": 59,
    "discount": 20,
    "stock": 30,
    "category": "Electronics",
    "image": "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=600&auto=format&fit=crop&q=80",
    "sellerId": "biqtufkhzmqfe168o",
    "reviews": [
      {
        "username": "FragMaster",
        "rating": 5,
        "comment": "Insanely light and the sensor accuracy is flawless. Highly recommend for competitive FPS gaming.",
        "createdAt": "2026-06-15T19:40:00.000Z"
      }
    ],
    "createdAt": "2026-06-15T15:48:32.892Z",
    "updatedAt": "2026-06-15T15:48:32.892Z"
  },
  {
    "_id": "5p7xe3qupmqfe169y",
    "title": "Chronos Fit Smartwatch Active",
    "description": "An elegant smartwatch with comprehensive fitness tracking. Monitor your heart rate, blood oxygen levels (SpO2), stress, sleep patterns, and daily steps. Features 14 professional sports modes, built-in GPS for workouts, a vivid 1.4-inch AMOLED customizable touchscreen, and 5 ATM water resistance.",
    "price": 149,
    "discount": 20,
    "stock": 3,
    "category": "Wearables",
    "image": "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80",
    "sellerId": "biqtufkhzmqfe168o",
    "reviews": [
      {
        "username": "Runner99",
        "rating": 4,
        "comment": "GPS locks on fast and is very accurate on outdoor runs. AMOLED screen is bright and easy to read under direct sunlight.",
        "createdAt": "2026-06-15T15:48:32.902Z"
      }
    ],
    "createdAt": "2026-06-15T15:48:32.902Z",
    "updatedAt": "2026-06-15T15:48:32.902Z"
  },
  {
    "_id": "auraringtracker",
    "title": "AuraRing Smart Health Tracker",
    "description": "Discreet, ultra-lightweight smart ring crafted from aerospace-grade titanium. Offers continuous heart rate monitoring, body temperature tracking, sleep analysis, and activity logging. Syncs with Apple Health and Google Fit with a battery life of up to 7 days on a single charge.",
    "price": 299,
    "discount": 5,
    "stock": 6,
    "category": "Wearables",
    "image": "https://images.unsplash.com/photo-1613946069412-38f7f1ff0b65?w=600&auto=format&fit=crop&q=80",
    "sellerId": "biqtufkhzmqfe168o",
    "reviews": [],
    "createdAt": "2026-06-15T15:48:32.903Z",
    "updatedAt": "2026-06-15T15:48:32.903Z"
  },
  {
    "_id": "pulsebandtracker",
    "title": "PulseBand Slim Fitness Band",
    "description": "Slim, waterproof fitness tracker featuring a 1.1-inch color display. Automatically tracks heart rate, active minutes, calories burned, and sleep duration. Get smartphone alerts on your wrist with up to 10 days of battery life.",
    "price": 49,
    "discount": 10,
    "stock": 20,
    "category": "Wearables",
    "image": "https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=600&auto=format&fit=crop&q=80",
    "sellerId": "biqtufkhzmqfe168o",
    "reviews": [
      {
        "username": "ActiveMom",
        "rating": 4,
        "comment": "Perfect size, not bulky like watches. Tracks sleep surprisingly well.",
        "createdAt": "2026-06-15T21:15:00.000Z"
      }
    ],
    "createdAt": "2026-06-15T15:48:32.904Z",
    "updatedAt": "2026-06-15T15:48:32.904Z"
  },
  {
    "_id": "1z85e9u41mqfe16a3",
    "title": "Voyager Anti-Theft Backpack",
    "description": "Water-resistant, high-durability travel backpack designed with a hidden zipper layout and anti-slash materials. Features integrated USB charging port, multiple organizing slots, a secret back pocket, and a padded sleeve that fits up to 15.6-inch laptops securely.",
    "price": 79,
    "discount": 25,
    "stock": 45,
    "category": "Accessories",
    "image": "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&auto=format&fit=crop&q=80",
    "sellerId": "biqtufkhzmqfe168o",
    "reviews": [],
    "createdAt": "2026-06-15T15:48:32.907Z",
    "updatedAt": "2026-06-15T15:48:32.907Z"
  },
  {
    "_id": "nomadleatherwallet",
    "title": "Nomad Slim Leather RFID Wallet",
    "description": "Handcrafted from full-grain vegetable-tanned Italian leather. This ultra-slim cardholder features built-in RFID blocking technology to protect your cards from skimming, 6 card slots, a cash pull-tab, and a magnetic money clip. Patinas beautifully over time.",
    "price": 39,
    "discount": 0,
    "stock": 25,
    "category": "Accessories",
    "image": "https://images.unsplash.com/photo-1627124765138-b71564757c3a?w=600&auto=format&fit=crop&q=80",
    "sellerId": "biqtufkhzmqfe168o",
    "reviews": [
      {
        "username": "LeatherFan",
        "rating": 5,
        "comment": "Exceptional craftsmanship. Holds 8 cards comfortably and smells like premium leather.",
        "createdAt": "2026-06-15T22:30:00.000Z"
      }
    ],
    "createdAt": "2026-06-15T15:48:32.908Z",
    "updatedAt": "2026-06-15T15:48:32.908Z"
  },
  {
    "_id": "voltchargestation",
    "title": "VoltCharge 3-in-1 MagSafe Charging Stand",
    "description": "Magnetic 3-in-1 wireless charging dock that charges your iPhone, Apple Watch, and AirPods at the same time. Supports 15W fast charging, features premium weighted base to keep it stable, and charges devices in both portrait and landscape orientation.",
    "price": 69,
    "discount": 15,
    "stock": 18,
    "category": "Accessories",
    "image": "https://images.unsplash.com/photo-1622445262465-2481c4574875?w=600&auto=format&fit=crop&q=80",
    "sellerId": "biqtufkhzmqfe168o",
    "reviews": [],
    "createdAt": "2026-06-15T15:48:32.909Z",
    "updatedAt": "2026-06-15T15:48:32.909Z"
  },
  {
    "_id": "r0vu9txhomqfe16a8",
    "title": "HydroMax Vacuum Insulated Flask",
    "description": "Double-walled vacuum insulated stainless steel water bottle. Keeps beverages ice-cold for up to 24 hours or piping hot for 12 hours. Features a durable powder coat finish, sweat-proof exterior, and an interchangeable leak-proof sports straw lid.",
    "price": 29,
    "discount": 0,
    "stock": 50,
    "category": "Home & Kitchen",
    "image": "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600&auto=format&fit=crop&q=80",
    "sellerId": "biqtufkhzmqfe168o",
    "reviews": [
      {
        "username": "HealthyLife",
        "rating": 5,
        "comment": "Keeps my water ice cold even after a whole day at the hot beach. Totally leak-proof!",
        "createdAt": "2026-06-15T15:48:32.912Z"
      }
    ],
    "createdAt": "2026-06-15T15:48:32.912Z",
    "updatedAt": "2026-06-15T15:48:32.912Z"
  },
  {
    "_id": "baristacafeespresso",
    "title": "Barista Cafe 15-Bar Espresso Machine",
    "description": "Commercial-grade 15-bar Italian pump espresso machine for brewing rich espresso, lattes, and cappuccinos. Features a built-in steam wand for creating silky microfoam, a double-wall portafilter, a pre-infusion feature for optimal extraction, and a 1.5L removable water tank.",
    "price": 189,
    "discount": 20,
    "stock": 10,
    "category": "Home & Kitchen",
    "image": "https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=600&auto=format&fit=crop&q=80",
    "sellerId": "biqtufkhzmqfe168o",
    "reviews": [
      {
        "username": "CoffeeSnob",
        "rating": 5,
        "comment": "Makes perfect crema and froths milk to latte art quality. Saves me tons of money at Starbucks.",
        "createdAt": "2026-06-15T23:45:00.000Z"
      }
    ],
    "createdAt": "2026-06-15T15:48:32.913Z",
    "updatedAt": "2026-06-15T15:48:32.913Z"
  },
  {
    "_id": "crispairfryer",
    "title": "CrispAir 5.8-Quart Digital Air Fryer",
    "description": "Large capacity digital air fryer utilizing 360° rapid air circulation. Offers 8 pre-programmed touch presets (fries, steak, chicken, baking, etc.), a non-stick dishwasher-safe fry basket, and customizable time/temperature controls. Reduces fat by up to 85% compared to traditional deep frying.",
    "price": 119,
    "discount": 10,
    "stock": 14,
    "category": "Home & Kitchen",
    "image": "https://images.unsplash.com/photo-1621972750749-0fbb1abb7736?w=600&auto=format&fit=crop&q=80",
    "sellerId": "biqtufkhzmqfe168o",
    "reviews": [],
    "createdAt": "2026-06-15T15:48:32.914Z",
    "updatedAt": "2026-06-15T15:48:32.914Z"
  },
  {
    "_id": "luminadesklamp",
    "title": "Lumina LED Smart Desk Lamp",
    "description": "Ergonomic eye-friendly LED desk lamp with 5 color temperature modes and 7 brightness levels. Includes an adjustable multi-angle head/arm, a built-in 10W wireless charging pad for smartphones, a USB charging port, and an auto-off timer.",
    "price": 45,
    "discount": 0,
    "stock": 22,
    "category": "Home & Kitchen",
    "image": "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600&auto=format&fit=crop&q=80",
    "sellerId": "biqtufkhzmqfe168o",
    "reviews": [],
    "createdAt": "2026-06-15T15:48:32.915Z",
    "updatedAt": "2026-06-15T15:48:32.915Z"
  },
  {
    "_id": "m9tw4crxxmqfe16ab",
    "title": "FlexGrip Executive Ergonomic Chair",
    "description": "Ergonomic high-back office chair with adaptive lumbar support, a 3D adjustable headrest, adjustable armrests, and a breathable mesh back. Features a pneumatic lift for seat height adjustment and a 135° tilt tension lock. Designed for 8+ hours of comfortable sitting during intense gaming or work sessions.",
    "price": 249,
    "discount": 5,
    "stock": 4,
    "category": "Furniture",
    "image": "https://images.unsplash.com/photo-1580481072645-022f9a6dbf27?w=600&auto=format&fit=crop&q=80",
    "sellerId": "biqtufkhzmqfe168o",
    "reviews": [],
    "createdAt": "2026-06-15T15:48:32.915Z",
    "updatedAt": "2026-06-15T15:48:32.915Z"
  },
  {
    "_id": "ecorisestandingdesk",
    "title": "EcoRise Electric Standing Desk",
    "description": "Premium electric height-adjustable desk featuring dual motors for smooth, silent lifting. Ranges from 28\" to 48\" in height with 4 programmable memory presets. Includes a durable 55\" x 28\" bamboo tabletop, robust steel frame holding up to 220 lbs, and integrated cable management.",
    "price": 399,
    "discount": 10,
    "stock": 5,
    "category": "Furniture",
    "image": "https://images.unsplash.com/photo-1595515106969-1ce29566ff1c?w=600&auto=format&fit=crop&q=80",
    "sellerId": "biqtufkhzmqfe168o",
    "reviews": [],
    "createdAt": "2026-06-15T15:48:32.916Z",
    "updatedAt": "2026-06-15T15:48:32.916Z"
  }
];

// Helper to initialize database in localStorage
const initMockDB = () => {
  if (!localStorage.getItem('shopez_mock_products')) {
    localStorage.setItem('shopez_mock_products', JSON.stringify(INITIAL_PRODUCTS));
  }
  if (!localStorage.getItem('shopez_mock_orders')) {
    localStorage.setItem('shopez_mock_orders', JSON.stringify([]));
  }
  if (!localStorage.getItem('shopez_mock_users')) {
    // Standard mock user accounts: customer & seller
    const mockUsers = [
      {
        _id: "customer_user_id",
        username: "JohnDoe",
        email: "customer@shopez.com",
        password: "password123", // in mock DB we just check simple string
        role: "customer"
      },
      {
        _id: "biqtufkhzmqfe168o",
        username: "TechGadgetsStore",
        email: "seller@shopez.com",
        password: "password123",
        role: "seller"
      }
    ];
    localStorage.setItem('shopez_mock_users', JSON.stringify(mockUsers));
  }
};

// Execute init
initMockDB();

export const mockDatabase = {
  // 1. PRODUCTS
  getProducts: (search = '', category = '') => {
    let list = JSON.parse(localStorage.getItem('shopez_mock_products') || '[]');
    if (category && category !== 'All') {
      list = list.filter(p => p.category.toLowerCase() === category.toLowerCase());
    }
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(p => 
        p.title.toLowerCase().includes(q) || 
        p.description.toLowerCase().includes(q) || 
        p.category.toLowerCase().includes(q)
      );
    }
    return list;
  },

  getProductById: (id) => {
    const list = JSON.parse(localStorage.getItem('shopez_mock_products') || '[]');
    return list.find(p => p._id === id) || null;
  },

  addReview: (productId, rating, comment, username) => {
    const list = JSON.parse(localStorage.getItem('shopez_mock_products') || '[]');
    const index = list.findIndex(p => p._id === productId);
    if (index !== -1) {
      const newReview = {
        username,
        rating: Number(rating),
        comment,
        createdAt: new Date().toISOString()
      };
      list[index].reviews = [newReview, ...(list[index].reviews || [])];
      localStorage.setItem('shopez_mock_products', JSON.stringify(list));
      return list[index];
    }
    return null;
  },

  // 2. AUTH
  login: (email, password) => {
    const users = JSON.parse(localStorage.getItem('shopez_mock_users') || '[]');
    const user = users.find(u => u.email === email && u.password === password);
    if (!user) throw new Error('Invalid email or password');
    
    // Return token and user info (excluding password)
    return {
      token: "mock_jwt_token_" + user._id,
      _id: user._id,
      username: user.username,
      email: user.email,
      role: user.role
    };
  },

  register: (username, email, password, role) => {
    const users = JSON.parse(localStorage.getItem('shopez_mock_users') || '[]');
    if (users.some(u => u.email === email)) {
      throw new Error('Email is already registered');
    }
    const newUser = {
      _id: "mock_user_" + Math.random().toString(36).substr(2, 9),
      username,
      email,
      password,
      role
    };
    users.push(newUser);
    localStorage.setItem('shopez_mock_users', JSON.stringify(users));

    return {
      token: "mock_jwt_token_" + newUser._id,
      _id: newUser._id,
      username: newUser.username,
      email: newUser.email,
      role: newUser.role
    };
  },

  verifyToken: (token) => {
    if (!token || !token.startsWith("mock_jwt_token_")) return null;
    const userId = token.replace("mock_jwt_token_", "");
    const users = JSON.parse(localStorage.getItem('shopez_mock_users') || '[]');
    const user = users.find(u => u._id === userId);
    if (!user) return null;
    return {
      _id: user._id,
      username: user.username,
      email: user.email,
      role: user.role
    };
  },

  // 3. ORDERS
  placeOrder: (items, shippingDetails, userId, username) => {
    const orders = JSON.parse(localStorage.getItem('shopez_mock_orders') || '[]');
    const products = JSON.parse(localStorage.getItem('shopez_mock_products') || '[]');

    const totalAmount = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const newOrder = {
      _id: "mock_order_" + Math.random().toString(36).substr(2, 9),
      customerId: userId,
      customerName: username,
      items,
      shippingDetails,
      totalAmount,
      status: "Processing",
      createdAt: new Date().toISOString()
    };

    // Decrement stocks
    items.forEach(orderedItem => {
      const pIdx = products.findIndex(p => p._id === orderedItem.productId);
      if (pIdx !== -1) {
        products[pIdx].stock = Math.max(0, products[pIdx].stock - orderedItem.quantity);
      }
    });

    orders.unshift(newOrder);
    localStorage.setItem('shopez_mock_orders', JSON.stringify(orders));
    localStorage.setItem('shopez_mock_products', JSON.stringify(products));
    return newOrder;
  },

  getOrders: (userId, role) => {
    const orders = JSON.parse(localStorage.getItem('shopez_mock_orders') || '[]');
    if (role === 'seller') {
      // Sellers see orders containing their products
      const products = JSON.parse(localStorage.getItem('shopez_mock_products') || '[]');
      const sellerProducts = new Set(products.filter(p => p.sellerId === userId).map(p => p._id));
      
      return orders.map(order => {
        const filteredItems = order.items.filter(item => sellerProducts.has(item.productId));
        if (filteredItems.length === 0) return null;
        return {
          ...order,
          items: filteredItems,
          totalAmount: filteredItems.reduce((acc, i) => acc + (i.price * i.quantity), 0)
        };
      }).filter(o => o !== null);
    } else {
      // Customers see their own orders
      return orders.filter(o => o.customerId === userId);
    }
  },

  // 4. SELLER ANALYTICS
  getSellerAnalytics: (sellerId) => {
    const products = JSON.parse(localStorage.getItem('shopez_mock_products') || '[]');
    const orders = JSON.parse(localStorage.getItem('shopez_mock_orders') || '[]');
    
    const sellerProducts = products.filter(p => p.sellerId === sellerId);
    const sellerProductIds = new Set(sellerProducts.map(p => p._id));

    let totalEarnings = 0;
    let totalItemsSold = 0;
    const categorySales = {};
    const stockStatus = [];

    // Process orders
    orders.forEach(order => {
      order.items.forEach(item => {
        if (sellerProductIds.has(item.productId)) {
          const product = sellerProducts.find(p => p._id === item.productId);
          const amount = item.price * item.quantity;
          totalEarnings += amount;
          totalItemsSold += item.quantity;

          if (product) {
            categorySales[product.category] = (categorySales[product.category] || 0) + amount;
          }
        }
      });
    });

    // Populate stock status
    sellerProducts.forEach(p => {
      stockStatus.push({
        name: p.title,
        stock: p.stock
      });
    });

    // Generate monthly sales mockup
    const monthlySales = [
      { name: 'Jan', sales: Math.round(totalEarnings * 0.1) },
      { name: 'Feb', sales: Math.round(totalEarnings * 0.15) },
      { name: 'Mar', sales: Math.round(totalEarnings * 0.12) },
      { name: 'Apr', sales: Math.round(totalEarnings * 0.2) },
      { name: 'May', sales: Math.round(totalEarnings * 0.18) },
      { name: 'Jun', sales: Math.round(totalEarnings * 0.25) }
    ];

    const categoryData = Object.keys(categorySales).map(key => ({
      name: key,
      value: categorySales[key]
    }));

    return {
      stats: {
        totalEarnings,
        totalItemsSold,
        activeProductsCount: sellerProducts.length,
        totalOrdersCount: orders.length
      },
      monthlySales,
      categorySales: categoryData.length ? categoryData : [{ name: 'None', value: 0 }],
      stockStatus
    };
  }
};
