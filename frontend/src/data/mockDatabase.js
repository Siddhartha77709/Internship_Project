// A local mock database fallback to make the frontend 100% interactive on static hosts like Netlify
// when the Express server is offline or not deployed.
// Currency configured: Indian Rupees (₹)

const INITIAL_PRODUCTS = [
  {
    "_id": "samsung_s24_ultra",
    "title": "Samsung Galaxy S24 Ultra (256GB, Titanium Gray)",
    "description": "The ultimate flagship smartphone from Samsung featuring a 6.8-inch Dynamic AMOLED 2X display, 200MP Quad Camera with AI features, Snapdragon 8 Gen 3 for Galaxy, and an integrated S Pen. Experience the next era of mobile AI with live call translation, note assist, and circle to search.",
    "price": 124999,
    "discount": 5,
    "stock": 8,
    "category": "Electronics",
    "image": "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=600&auto=format&fit=crop&q=80",
    "sellerId": "biqtufkhzmqfe168o",
    "reviews": [
      {
        "username": "RohanS",
        "rating": 5,
        "comment": "Mindblowing camera zoom and screen brightness! S Pen is extremely handy for note-taking.",
        "createdAt": "2026-06-15T15:48:32.873Z"
      }
    ],
    "createdAt": "2026-06-15T15:48:32.873Z",
    "updatedAt": "2026-06-15T15:48:32.873Z"
  },
  {
    "_id": "samsung_crystal_tv",
    "title": "Samsung 55-inch Crystal 4K Smart TV",
    "description": "Bring your entertainment to life with 4K UHD resolution, Crystal Processor 4K, HDR support, and a sleek AirSlim design. Includes built-in voice assistants, Smart TV Hub powered by Tizen, and multiple HDMI/USB ports.",
    "price": 42999,
    "discount": 10,
    "stock": 5,
    "category": "Electronics",
    "image": "https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=600&auto=format&fit=crop&q=80",
    "sellerId": "biqtufkhzmqfe168o",
    "reviews": [],
    "createdAt": "2026-06-15T15:48:32.874Z",
    "updatedAt": "2026-06-15T15:48:32.874Z"
  },
  {
    "_id": "samsung_microwave",
    "title": "Samsung Solo 23L Microwave Oven",
    "description": "Reliable 23-litre solo microwave oven featuring Ceramic Inside cavity for easy cleaning and scratch protection. Equiped with Eco Mode to reduce standby power, local Indian recipes auto-cook menus, and auto defrost.",
    "price": 11499,
    "discount": 15,
    "stock": 10,
    "category": "Home & Kitchen",
    "image": "https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=600&auto=format&fit=crop&q=80",
    "sellerId": "biqtufkhzmqfe168o",
    "reviews": [],
    "createdAt": "2026-06-15T15:48:32.875Z",
    "updatedAt": "2026-06-15T15:48:32.875Z"
  },
  {
    "_id": "apple_iphone15_pro",
    "title": "Apple iPhone 15 Pro (128GB, Natural Titanium)",
    "description": "Forged in titanium, featuring the groundbreaking A17 Pro chip, a customizable Action button, and a powerful 3x Telephoto camera. Includes a 6.1-inch Super Retina XDR display with ProMotion and USB-C port.",
    "price": 129999,
    "discount": 8,
    "stock": 6,
    "category": "Electronics",
    "image": "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=600&auto=format&fit=crop&q=80",
    "sellerId": "biqtufkhzmqfe168o",
    "reviews": [
      {
        "username": "AnanyaM",
        "rating": 5,
        "comment": "Incredibly premium design. Titanium feels lighter than previous generations. A17 Pro chip makes gaming buttery smooth.",
        "createdAt": "2026-06-15T16:00:00.000Z"
      }
    ],
    "createdAt": "2026-06-15T15:48:32.876Z",
    "updatedAt": "2026-06-15T15:48:32.876Z"
  },
  {
    "_id": "apple_macbook_air_m3",
    "title": "Apple MacBook Air M3 (13.6-inch, 8GB RAM, 256GB SSD)",
    "description": "Supercharged by the M3 chip, this fanless ultra-portable laptop features up to 18 hours of battery life, a liquid Retina display, 1080p FaceTime HD camera, and spatial audio support. Fits easily in your bag for school or work.",
    "price": 114999,
    "discount": 10,
    "stock": 4,
    "category": "Electronics",
    "image": "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&auto=format&fit=crop&q=80",
    "sellerId": "biqtufkhzmqfe168o",
    "reviews": [],
    "createdAt": "2026-06-15T15:48:32.877Z",
    "updatedAt": "2026-06-15T15:48:32.877Z"
  },
  {
    "_id": "sony_wh1000xm5",
    "title": "Sony WH-1000XM5 Wireless Noise Cancelling Headphones",
    "description": "Industry-leading noise cancellation headphones featuring 8 microphones, Auto NC Optimizer, custom 30mm driver unit, crystal clear hands-free calling, up to 30 hours of battery life, and comfortable lightweight leather design.",
    "price": 29999,
    "discount": 12,
    "stock": 14,
    "category": "Electronics",
    "image": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80",
    "sellerId": "biqtufkhzmqfe168o",
    "reviews": [
      {
        "username": "KarthikV",
        "rating": 5,
        "comment": "The best ANC headphones in the market. Bass is exceptionally clear and multipoint bluetooth works perfectly.",
        "createdAt": "2026-06-15T18:10:00.000Z"
      }
    ],
    "createdAt": "2026-06-15T15:48:32.878Z",
    "updatedAt": "2026-06-15T15:48:32.878Z"
  },
  {
    "_id": "sony_ps5_slim",
    "title": "Sony PlayStation 5 (PS5) Slim Console",
    "description": "Experience lightning-fast loading with an ultra-high-speed SSD, deeper immersion with haptic feedback, adaptive triggers, and 3D Audio. Includes a pre-installed copy of Astro's Playroom.",
    "price": 44999,
    "discount": 5,
    "stock": 3,
    "category": "Electronics",
    "image": "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=600&auto=format&fit=crop&q=80",
    "sellerId": "biqtufkhzmqfe168o",
    "reviews": [],
    "createdAt": "2026-06-15T15:48:32.879Z",
    "updatedAt": "2026-06-15T15:48:32.879Z"
  },
  {
    "_id": "oneplus_nord_ce4",
    "title": "OnePlus Nord CE4 5G (8GB RAM, 128GB Storage)",
    "description": "Fast and smooth smartphone featuring Snapdragon 7 Gen 3, a 6.7-inch 120Hz AMOLED display, 100W SUPERVOOC fast charging, a massive 5500mAh battery, and a 50MP Sony LYT-600 main camera with OIS.",
    "price": 24999,
    "discount": 8,
    "stock": 18,
    "category": "Electronics",
    "image": "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=600&auto=format&fit=crop&q=80",
    "sellerId": "biqtufkhzmqfe168o",
    "reviews": [
      {
        "username": "TechGeek",
        "rating": 4,
        "comment": "Charges fully in under 30 minutes! Display is stunning and oxygenOS is clean.",
        "createdAt": "2026-06-15T20:20:00.000Z"
      }
    ],
    "createdAt": "2026-06-15T15:48:32.880Z",
    "updatedAt": "2026-06-15T15:48:32.880Z"
  },
  {
    "_id": "oneplus_buds_pro_2",
    "title": "OnePlus Buds Pro 2 Bluetooth Earbuds",
    "description": "Audiophile-grade wireless earbuds with Smart Adaptive Noise Cancelling, Dynaudio-tuned dual drivers, spatial audio support, ultra-low latency, and up to 39 hours of battery life with case.",
    "price": 11999,
    "discount": 15,
    "stock": 22,
    "category": "Electronics",
    "image": "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&auto=format&fit=crop&q=80",
    "sellerId": "biqtufkhzmqfe168o",
    "reviews": [],
    "createdAt": "2026-06-15T15:48:32.881Z",
    "updatedAt": "2026-06-15T15:48:32.881Z"
  },
  {
    "_id": "philips_airfryer_xl",
    "title": "Philips Air Fryer XL (6.2L Touchscreen)",
    "description": "Healthy cooking with up to 90% less fat thanks to Rapid Air technology. Features an intuitive digital touchscreen with 7 presets, Keep Warm function, and XL capacity suitable for family meals.",
    "price": 9999,
    "discount": 12,
    "stock": 7,
    "category": "Home & Kitchen",
    "image": "https://images.unsplash.com/photo-1621972750749-0fbb1abb7736?w=600&auto=format&fit=crop&q=80",
    "sellerId": "biqtufkhzmqfe168o",
    "reviews": [
      {
        "username": "ChefAmit",
        "rating": 5,
        "comment": "Perfect for oil-free samosas and chicken wings. Easy to clean basket.",
        "createdAt": "2026-06-15T19:15:00.000Z"
      }
    ],
    "createdAt": "2026-06-15T15:48:32.882Z",
    "updatedAt": "2026-06-15T15:48:32.882Z"
  },
  {
    "_id": "philips_toothbrush",
    "title": "Philips Sonicare ProtectiveClean Electric Toothbrush",
    "description": "Improve your gum health up to 100% more than a manual toothbrush. Features a smart pressure sensor, 3 cleaning modes, BrushSync replacement reminder, and a handy travel case.",
    "price": 3499,
    "discount": 10,
    "stock": 16,
    "category": "Home & Kitchen",
    "image": "https://images.unsplash.com/photo-1549921296-bc643ded1ee6?w=600&auto=format&fit=crop&q=80",
    "sellerId": "biqtufkhzmqfe168o",
    "reviews": [],
    "createdAt": "2026-06-15T15:48:32.883Z",
    "updatedAt": "2026-06-15T15:48:32.883Z"
  },
  {
    "_id": "nike_air_max",
    "title": "Nike Air Max Alpha Training Shoes",
    "description": "Premium athletic training sneakers featuring a visible Max Air unit in the heel for cushioning. Includes breathable engineered mesh upper, robust rubber tread for multi-surface traction, and a durable lace-up closure.",
    "price": 8999,
    "discount": 15,
    "stock": 25,
    "category": "Wearables",
    "image": "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80",
    "sellerId": "biqtufkhzmqfe168o",
    "reviews": [
      {
        "username": "FitnessFreak",
        "rating": 5,
        "comment": "Very comfortable during heavy deadlifts and squats. Great heel support.",
        "createdAt": "2026-06-15T22:10:00.000Z"
      }
    ],
    "createdAt": "2026-06-15T15:48:32.884Z",
    "updatedAt": "2026-06-15T15:48:32.884Z"
  },
  {
    "_id": "gv9jb1bigmqfe1695",
    "title": "ShopEZ UltraBook Pro 15",
    "description": "High performance laptop with 16GB LPDDR5 RAM, 512GB NVMe PCIe Gen4 SSD, Intel Core i7 13th Gen processor, and a brilliant 15.6-inch borderless IPS display. Perfect for productivity, coding, and lightweight gaming.",
    "price": 79999,
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
      }
    ],
    "createdAt": "2026-06-15T15:48:32.873Z",
    "updatedAt": "2026-06-15T15:48:32.873Z"
  },
  {
    "_id": "pixelstream4k27in",
    "title": "PixelStream 27\" 4K UHD IPS Monitor",
    "description": "Stunning 27-inch 4K UHD (3840 x 2160) monitor featuring an IPS panel with 99% sRGB color gamut coverage. Supports VESA DisplayHDR 400 and AMD FreeSync.",
    "price": 29999,
    "discount": 10,
    "stock": 8,
    "category": "Electronics",
    "image": "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600&auto=format&fit=crop&q=80",
    "sellerId": "biqtufkhzmqfe168o",
    "reviews": [],
    "createdAt": "2026-06-15T15:48:32.890Z",
    "updatedAt": "2026-06-15T15:48:32.890Z"
  },
  {
    "_id": "keyvibemechanicalkb",
    "title": "KeyVibe Wireless Mechanical Keyboard",
    "description": "Compact 75% layout wireless mechanical keyboard featuring hot-swappable tactile brown switches. Comes with premium dye-subbed PBT keycaps and per-key RGB backlighting.",
    "price": 4999,
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
    "description": "Ergonomic wireless gaming mouse weighing only 58 grams. Equipped with a custom 26,000 DPI optical sensor, durable optical switches, and zero-latency wireless connection.",
    "price": 2499,
    "discount": 20,
    "stock": 30,
    "category": "Electronics",
    "image": "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=600&auto=format&fit=crop&q=80",
    "sellerId": "biqtufkhzmqfe168o",
    "reviews": [],
    "createdAt": "2026-06-15T15:48:32.892Z",
    "updatedAt": "2026-06-15T15:48:32.892Z"
  },
  {
    "_id": "5p7xe3qupmqfe169y",
    "title": "Chronos Fit Smartwatch Active",
    "description": "An elegant smartwatch with comprehensive fitness tracking. Monitor your heart rate, SpO2, stress, sleep patterns, and daily steps. Features 14 professional sports modes.",
    "price": 4999,
    "discount": 20,
    "stock": 3,
    "category": "Wearables",
    "image": "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80",
    "sellerId": "biqtufkhzmqfe168o",
    "reviews": [
      {
        "username": "Runner99",
        "rating": 4,
        "comment": "GPS locks on fast and is very accurate on outdoor runs.",
        "createdAt": "2026-06-15T15:48:32.902Z"
      }
    ],
    "createdAt": "2026-06-15T15:48:32.902Z",
    "updatedAt": "2026-06-15T15:48:32.902Z"
  },
  {
    "_id": "auraringtracker",
    "title": "AuraRing Smart Health Tracker",
    "description": "Discreet, ultra-lightweight smart ring crafted from aerospace-grade titanium. Offers continuous heart rate monitoring, body temperature tracking, sleep analysis, and activity logging.",
    "price": 19999,
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
    "description": "Slim, waterproof fitness tracker featuring a 1.1-inch color display. Automatically tracks heart rate, active minutes, calories burned, and sleep duration.",
    "price": 1999,
    "discount": 10,
    "stock": 20,
    "category": "Wearables",
    "image": "https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=600&auto=format&fit=crop&q=80",
    "sellerId": "biqtufkhzmqfe168o",
    "reviews": [],
    "createdAt": "2026-06-15T15:48:32.904Z",
    "updatedAt": "2026-06-15T15:48:32.904Z"
  },
  {
    "_id": "1z85e9u41mqfe16a3",
    "title": "Voyager Anti-Theft Backpack",
    "description": "Water-resistant, durable travel backpack with hidden security pockets, a built-in USB charging port, and a padded sleeve that fits up to 15.6-inch laptops securely.",
    "price": 2999,
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
    "description": "Handcrafted from full-grain vegetable-tanned Italian leather. This ultra-slim cardholder features built-in RFID blocking technology to protect your cards from skimming.",
    "price": 1499,
    "discount": 0,
    "stock": 25,
    "category": "Accessories",
    "image": "https://images.unsplash.com/photo-1627124765138-b71564757c3a?w=600&auto=format&fit=crop&q=80",
    "sellerId": "biqtufkhzmqfe168o",
    "reviews": [],
    "createdAt": "2026-06-15T15:48:32.908Z",
    "updatedAt": "2026-06-15T15:48:32.908Z"
  },
  {
    "_id": "voltchargestation",
    "title": "VoltCharge 3-in-1 MagSafe Charging Stand",
    "description": "Magnetic 3-in-1 wireless charging dock that charges your iPhone, Apple Watch, and AirPods at the same time. Supports 15W fast charging.",
    "price": 3999,
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
    "description": "Double-walled vacuum insulated stainless steel water bottle. Keeps beverages ice-cold for 24 hours or piping hot for 12 hours. Features a leak-proof straw lid.",
    "price": 999,
    "discount": 0,
    "stock": 50,
    "category": "Home & Kitchen",
    "image": "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600&auto=format&fit=crop&q=80",
    "sellerId": "biqtufkhzmqfe168o",
    "reviews": [
      {
        "username": "HealthyLife",
        "rating": 5,
        "comment": "Best water bottle I have ever owned! Keeps water freezing cold.",
        "createdAt": "2026-06-15T15:48:32.912Z"
      }
    ],
    "createdAt": "2026-06-15T15:48:32.912Z",
    "updatedAt": "2026-06-15T15:48:32.912Z"
  },
  {
    "_id": "baristacafeespresso",
    "title": "Barista Cafe 15-Bar Espresso Machine",
    "description": "Commercial-grade 15-bar Italian pump espresso machine for brewing rich espresso, lattes, and cappuccinos. Features a built-in steam wand for creating silky microfoam.",
    "price": 14999,
    "discount": 20,
    "stock": 10,
    "category": "Home & Kitchen",
    "image": "https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=600&auto=format&fit=crop&q=80",
    "sellerId": "biqtufkhzmqfe168o",
    "reviews": [],
    "createdAt": "2026-06-15T15:48:32.913Z",
    "updatedAt": "2026-06-15T15:48:32.913Z"
  },
  {
    "_id": "crispairfryer",
    "title": "CrispAir 5.8-Quart Digital Air Fryer",
    "description": "Large capacity digital air fryer utilizing 360° rapid air circulation. Offers 8 presets and non-stick dishwasher-safe fry basket.",
    "price": 6999,
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
    "description": "Ergonomic eye-friendly LED desk lamp with 5 color temperature modes and 7 brightness levels. Includes a built-in 10W wireless charging pad.",
    "price": 1999,
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
    "description": "Ergonomic office chair with adaptive lumbar support, a 3D adjustable headrest, adjustable armrests, and a breathable mesh back.",
    "price": 12999,
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
    "description": "Premium electric height-adjustable desk featuring dual motors for smooth, silent lifting. Ranges from 28\" to 48\" in height with 4 memory presets.",
    "price": 24999,
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
  if (!localStorage.getItem('shopez_mock_products_v2')) {
    localStorage.setItem('shopez_mock_products_v2', JSON.stringify(INITIAL_PRODUCTS));
  }
  if (!localStorage.getItem('shopez_mock_orders_v2')) {
    localStorage.setItem('shopez_mock_orders_v2', JSON.stringify([]));
  }
  if (!localStorage.getItem('shopez_mock_users_v2')) {
    const mockUsers = [
      {
        _id: "customer_user_id",
        username: "JohnDoe",
        email: "customer@shopez.com",
        password: "password123",
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
    localStorage.setItem('shopez_mock_users_v2', JSON.stringify(mockUsers));
  }
};

initMockDB();

export const mockDatabase = {
  getProducts: (search = '', category = '') => {
    let list = JSON.parse(localStorage.getItem('shopez_mock_products_v2') || '[]');
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
    const list = JSON.parse(localStorage.getItem('shopez_mock_products_v2') || '[]');
    return list.find(p => p._id === id) || null;
  },

  addReview: (productId, rating, comment, username) => {
    const list = JSON.parse(localStorage.getItem('shopez_mock_products_v2') || '[]');
    const index = list.findIndex(p => p._id === productId);
    if (index !== -1) {
      const newReview = {
        username,
        rating: Number(rating),
        comment,
        createdAt: new Date().toISOString()
      };
      list[index].reviews = [newReview, ...(list[index].reviews || [])];
      localStorage.setItem('shopez_mock_products_v2', JSON.stringify(list));
      return list[index];
    }
    return null;
  },

  login: (email, password) => {
    const users = JSON.parse(localStorage.getItem('shopez_mock_users_v2') || '[]');
    const user = users.find(u => u.email === email && u.password === password);
    if (!user) throw new Error('Invalid email or password');
    
    return {
      token: "mock_jwt_token_" + user._id,
      _id: user._id,
      username: user.username,
      email: user.email,
      role: user.role
    };
  },

  register: (username, email, password, role) => {
    const users = JSON.parse(localStorage.getItem('shopez_mock_users_v2') || '[]');
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
    localStorage.setItem('shopez_mock_users_v2', JSON.stringify(users));

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
    const users = JSON.parse(localStorage.getItem('shopez_mock_users_v2') || '[]');
    const user = users.find(u => u._id === userId);
    if (!user) return null;
    return {
      _id: user._id,
      username: user.username,
      email: user.email,
      role: user.role
    };
  },

  placeOrder: (items, shippingDetails, userId, username) => {
    const orders = JSON.parse(localStorage.getItem('shopez_mock_orders_v2') || '[]');
    const products = JSON.parse(localStorage.getItem('shopez_mock_products_v2') || '[]');

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

    items.forEach(orderedItem => {
      const pIdx = products.findIndex(p => p._id === orderedItem.productId);
      if (pIdx !== -1) {
        products[pIdx].stock = Math.max(0, products[pIdx].stock - orderedItem.quantity);
      }
    });

    orders.unshift(newOrder);
    localStorage.setItem('shopez_mock_orders_v2', JSON.stringify(orders));
    localStorage.setItem('shopez_mock_products_v2', JSON.stringify(products));
    return newOrder;
  },

  getOrders: (userId, role) => {
    const orders = JSON.parse(localStorage.getItem('shopez_mock_orders_v2') || '[]');
    if (role === 'seller') {
      const products = JSON.parse(localStorage.getItem('shopez_mock_products_v2') || '[]');
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
      return orders.filter(o => o.customerId === userId);
    }
  },

  getSellerAnalytics: (sellerId) => {
    const products = JSON.parse(localStorage.getItem('shopez_mock_products_v2') || '[]');
    const orders = JSON.parse(localStorage.getItem('shopez_mock_orders_v2') || '[]');
    
    const sellerProducts = products.filter(p => p.sellerId === sellerId);
    const sellerProductIds = new Set(sellerProducts.map(p => p._id));

    let totalEarnings = 0;
    let totalItemsSold = 0;
    const categorySales = {};
    const stockStatus = [];

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

    sellerProducts.forEach(p => {
      stockStatus.push({
        name: p.title,
        stock: p.stock
      });
    });

    const monthlySales = [
      { name: 'Jan', sales: Math.round(totalEarnings * 0.1) },
      { name: 'Feb', sales: Math.round(totalEarnings * 0.15) },
      { name: 'Mar', sales: Math.round(totalEarnings * 0.12) },
      { name: 'Apr', sales: Math.round(totalEarnings * 0.2) },
      { name: 'May', strokeColor: 'var(--primary)', sales: Math.round(totalEarnings * 0.18) },
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
