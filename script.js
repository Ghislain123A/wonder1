// Main JavaScript for WONDER ELECTRONICS website

// Authentication system
let currentUser = null;
let users = [];
let otpCodes = {}; // Store OTP codes for password recovery
let adminSupporters = []; // Store admin supporters/workers
let affiliateLinks = []; // Store affiliate links and tracking
let chatMessages = []; // Store chat messages
let profitData = {}; // Store profit analytics data

// Currency system
let currentCurrency = 'USD';
let currencyRates = {
    USD: 1.0,
    RWF: 1300.0,  // 1 USD = 1300 RWF (approximate)
    EUR: 0.85,    // 1 USD = 0.85 EUR (approximate)
    GBP: 0.73     // 1 USD = 0.73 GBP (approximate)
};

let currencySymbols = {
    USD: '$',
    RWF: 'RWF',
    EUR: '€',
    GBP: '£'
};

// Sample products data
let products = [
    // SMARTPHONES - iPhone
    {
        id: 1,
        name: "iPhone 15 Pro",
        price: 999.99,
        category: "smartphones",
        subcategory: "iPhone",
        brand: "Apple",
        description: "Latest iPhone with advanced camera system and A17 Pro chip",
        shortDescription: "Latest iPhone with advanced camera system",
        specifications: "6.1-inch display, A17 Pro chip, 48MP camera, 5G connectivity",
        image: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400",
        images: ["https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400"],
        stock: 10,
        condition: "N",
        colors: ["Space Black", "Natural Titanium", "White Titanium", "Blue Titanium"],
        discount: 0
    },
    {
        id: 2,
        name: "iPhone 15",
        price: 799.99,
        category: "smartphones",
        subcategory: "iPhone",
        brand: "Apple",
        description: "iPhone 15 with Dynamic Island and A16 Bionic chip",
        shortDescription: "iPhone 15 with Dynamic Island",
        specifications: "6.1-inch display, A16 Bionic chip, 48MP camera, USB-C",
        image: "https://images.unsplash.com/photo-1511707171631-9ed0a79bea82?w=400",
        images: ["https://images.unsplash.com/photo-1511707171631-9ed0a79bea82?w=400"],
        stock: 15,
        condition: "N",
        colors: ["Pink", "Yellow", "Green", "Blue", "Black"],
        discount: 0
    },
    {
        id: 3,
        name: "iPhone 14 Pro Max",
        price: 1099.99,
        category: "smartphones",
        subcategory: "iPhone",
        brand: "Apple",
        description: "Large iPhone with Pro camera system and A16 Bionic chip",
        shortDescription: "Large iPhone with Pro camera system",
        specifications: "6.7-inch display, A16 Bionic chip, 48MP camera, ProRAW",
        image: "https://images.unsplash.com/photo-1511707171631-9ed0a79bea82?w=400",
        images: ["https://images.unsplash.com/photo-1511707171631-9ed0a79bea82?w=400"],
        stock: 8,
        condition: "N",
        colors: ["Deep Purple", "Gold", "Silver", "Space Black"],
        discount: 0
    },
    {
        id: 4,
        name: "iPhone 13",
        price: 599.99,
        category: "smartphones",
        subcategory: "iPhone",
        brand: "Apple",
        description: "iPhone 13 with A15 Bionic chip and dual camera system",
        shortDescription: "iPhone 13 with A15 Bionic chip",
        specifications: "6.1-inch display, A15 Bionic chip, 12MP dual camera, 5G",
        image: "https://images.unsplash.com/photo-1511707171631-9ed0a79bea82?w=400",
        images: ["https://images.unsplash.com/photo-1511707171631-9ed0a79bea82?w=400"],
        stock: 12,
        condition: "N",
        colors: ["Pink", "Blue", "Midnight", "Starlight", "Red"],
        discount: 100
    },

    // SMARTPHONES - Samsung
    {
        id: 5,
        name: "Samsung Galaxy S24 Ultra",
        price: 1199.99,
        category: "smartphones",
        subcategory: "Samsung",
        brand: "Samsung",
        description: "Premium Android smartphone with S Pen and 200MP camera",
        shortDescription: "Premium Android smartphone with S Pen",
        specifications: "6.8-inch display, Snapdragon 8 Gen 3, 200MP camera, S Pen included",
        image: "https://images.unsplash.com/photo-1511707171631-9ed0a79bea82?w=400",
        images: ["https://images.unsplash.com/photo-1511707171631-9ed0a79bea82?w=400"],
        stock: 8,
        condition: "N",
        colors: ["Titanium Black", "Titanium Gray", "Titanium Violet", "Titanium Yellow"],
        discount: 0
    },
    {
        id: 6,
        name: "Samsung Galaxy S24+",
        price: 999.99,
        category: "smartphones",
        subcategory: "Samsung",
        brand: "Samsung",
        description: "Large Samsung Galaxy with advanced AI features",
        shortDescription: "Large Samsung Galaxy with AI features",
        specifications: "6.7-inch display, Snapdragon 8 Gen 3, 50MP camera, AI features",
        image: "https://images.unsplash.com/photo-1511707171631-9ed0a79bea82?w=400",
        images: ["https://images.unsplash.com/photo-1511707171631-9ed0a79bea82?w=400"],
        stock: 10,
        condition: "N",
        colors: ["Titanium Black", "Titanium Gray", "Titanium Violet", "Titanium Yellow"],
        discount: 0
    },
    {
        id: 7,
        name: "Samsung Galaxy S23",
        price: 799.99,
        category: "smartphones",
        subcategory: "Samsung",
        brand: "Samsung",
        description: "Samsung Galaxy S23 with Snapdragon 8 Gen 2",
        shortDescription: "Samsung Galaxy S23 with Snapdragon 8 Gen 2",
        specifications: "6.1-inch display, Snapdragon 8 Gen 2, 50MP camera, 5G",
        image: "https://images.unsplash.com/photo-1511707171631-9ed0a79bea82?w=400",
        images: ["https://images.unsplash.com/photo-1511707171631-9ed0a79bea82?w=400"],
        stock: 15,
        condition: "N",
        colors: ["Phantom Black", "Cream", "Green", "Lavender"],
        discount: 100
    },

    // SMARTPHONES - Google
    {
        id: 8,
        name: "Google Pixel 8 Pro",
        price: 999.99,
        category: "smartphones",
        subcategory: "Google",
        brand: "Google",
        description: "Google Pixel 8 Pro with advanced AI and camera features",
        shortDescription: "Google Pixel 8 Pro with advanced AI",
        specifications: "6.7-inch display, Google Tensor G3, 50MP camera, AI features",
        image: "https://images.unsplash.com/photo-1511707171631-9ed0a79bea82?w=400",
        images: ["https://images.unsplash.com/photo-1511707171631-9ed0a79bea82?w=400"],
        stock: 12,
        condition: "N",
        colors: ["Obsidian", "Porcelain", "Bay"],
        discount: 0
    },
    {
        id: 9,
        name: "Google Pixel 8",
        price: 699.99,
        category: "smartphones",
        subcategory: "Google",
        brand: "Google",
        description: "Google Pixel 8 with Google Tensor G3 chip",
        shortDescription: "Google Pixel 8 with Tensor G3 chip",
        specifications: "6.2-inch display, Google Tensor G3, 50MP camera, 5G",
        image: "https://images.unsplash.com/photo-1511707171631-9ed0a79bea82?w=400",
        images: ["https://images.unsplash.com/photo-1511707171631-9ed0a79bea82?w=400"],
        stock: 18,
        condition: "N",
        colors: ["Obsidian", "Hazel", "Rose"],
        discount: 0
    },

    // SMARTPHONES - OnePlus
    {
        id: 10,
        name: "OnePlus 12",
        price: 799.99,
        category: "smartphones",
        subcategory: "OnePlus",
        brand: "OnePlus",
        description: "OnePlus 12 with Snapdragon 8 Gen 3 and fast charging",
        shortDescription: "OnePlus 12 with fast charging",
        specifications: "6.82-inch display, Snapdragon 8 Gen 3, 50MP camera, 100W charging",
        image: "https://images.unsplash.com/photo-1511707171631-9ed0a79bea82?w=400",
        images: ["https://images.unsplash.com/photo-1511707171631-9ed0a79bea82?w=400"],
        stock: 14,
        condition: "N",
        colors: ["Silky Black", "Flowy Emerald"],
        discount: 0
    },

    // LAPTOPS - MacBook
    {
        id: 11,
        name: "MacBook Pro 16-inch",
        price: 2499.99,
        category: "laptops",
        subcategory: "MacBook",
        brand: "Apple",
        description: "Professional laptop with M3 Pro chip and Liquid Retina XDR display",
        shortDescription: "Professional laptop with M3 Pro chip",
        specifications: "16.2-inch display, M3 Pro chip, 18GB RAM, 512GB SSD",
        image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400",
        images: ["https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400"],
        stock: 5,
        condition: "N",
        colors: ["Space Gray", "Silver"],
        discount: 0
    },
    {
        id: 12,
        name: "MacBook Pro 14-inch",
        price: 1999.99,
        category: "laptops",
        subcategory: "MacBook",
        brand: "Apple",
        description: "Compact MacBook Pro with M3 chip",
        shortDescription: "Compact MacBook Pro with M3 chip",
        specifications: "14.2-inch display, M3 chip, 8GB RAM, 512GB SSD",
        image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400",
        images: ["https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400"],
        stock: 8,
        condition: "N",
        colors: ["Space Gray", "Silver"],
        discount: 0
    },
    {
        id: 13,
        name: "MacBook Air 15-inch",
        price: 1299.99,
        category: "laptops",
        subcategory: "MacBook",
        brand: "Apple",
        description: "Large MacBook Air with M2 chip",
        shortDescription: "Large MacBook Air with M2 chip",
        specifications: "15.3-inch display, M2 chip, 8GB RAM, 256GB SSD",
        image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400",
        images: ["https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400"],
        stock: 12,
        condition: "N",
        colors: ["Midnight", "Starlight", "Space Gray", "Silver"],
        discount: 0
    },
    {
        id: 14,
        name: "MacBook Air 13-inch",
        price: 1099.99,
        category: "laptops",
        subcategory: "MacBook",
        brand: "Apple",
        description: "Compact MacBook Air with M2 chip",
        shortDescription: "Compact MacBook Air with M2 chip",
        specifications: "13.6-inch display, M2 chip, 8GB RAM, 256GB SSD",
        image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400",
        images: ["https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400"],
        stock: 15,
        condition: "N",
        colors: ["Midnight", "Starlight", "Space Gray", "Silver"],
        discount: 0
    },

    // LAPTOPS - Dell
    {
        id: 15,
        name: "Dell XPS 15",
        price: 1899.99,
        category: "laptops",
        subcategory: "Dell",
        brand: "Dell",
        description: "High-performance laptop with 4K display and Intel i7 processor",
        shortDescription: "High-performance laptop with 4K display",
        specifications: "15.6-inch 4K display, Intel i7-13700H, 16GB RAM, 1TB SSD",
        image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400",
        images: ["https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400"],
        stock: 7,
        condition: "N",
        colors: ["Platinum Silver", "Frost White"],
        discount: 0
    },
    {
        id: 16,
        name: "Dell XPS 13",
        price: 1299.99,
        category: "laptops",
        subcategory: "Dell",
        brand: "Dell",
        description: "Compact Dell XPS with 13.4-inch display",
        shortDescription: "Compact Dell XPS with 13.4-inch display",
        specifications: "13.4-inch display, Intel i7-1360P, 16GB RAM, 512GB SSD",
        image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400",
        images: ["https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400"],
        stock: 10,
        condition: "N",
        colors: ["Platinum Silver", "Frost White"],
        discount: 0
    },
    {
        id: 17,
        name: "Dell Inspiron 15 3000",
        price: 599.99,
        category: "laptops",
        subcategory: "Dell",
        brand: "Dell",
        description: "Budget-friendly Dell laptop for everyday use",
        shortDescription: "Budget-friendly Dell laptop",
        specifications: "15.6-inch display, Intel i5-1235U, 8GB RAM, 256GB SSD",
        image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400",
        images: ["https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400"],
        stock: 20,
        condition: "N",
        colors: ["Black"],
        discount: 100
    },

    // LAPTOPS - HP
    {
        id: 18,
        name: "HP Spectre x360 16",
        price: 1599.99,
        category: "laptops",
        subcategory: "HP",
        brand: "HP",
        description: "2-in-1 HP laptop with 16-inch 4K display",
        shortDescription: "2-in-1 HP laptop with 16-inch display",
        specifications: "16-inch 4K display, Intel i7-1360P, 16GB RAM, 1TB SSD",
        image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400",
        images: ["https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400"],
        stock: 6,
        condition: "N",
        colors: ["Nightfall Black", "Poseidon Blue"],
        discount: 0
    },
    {
        id: 19,
        name: "HP Pavilion 15",
        price: 799.99,
        category: "laptops",
        subcategory: "HP",
        brand: "HP",
        description: "HP Pavilion 15 with AMD Ryzen processor",
        shortDescription: "HP Pavilion 15 with AMD Ryzen",
        specifications: "15.6-inch display, AMD Ryzen 7 7730U, 16GB RAM, 512GB SSD",
        image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400",
        images: ["https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400"],
        stock: 12,
        condition: "N",
        colors: ["Natural Silver", "Fog Blue"],
        discount: 0
    },

    // LAPTOPS - Lenovo
    {
        id: 20,
        name: "Lenovo ThinkPad X1 Carbon",
        price: 1799.99,
        category: "laptops",
        subcategory: "Lenovo",
        brand: "Lenovo",
        description: "Premium business laptop with carbon fiber construction",
        shortDescription: "Premium business laptop with carbon fiber",
        specifications: "14-inch display, Intel i7-1365U, 16GB RAM, 512GB SSD",
        image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400",
        images: ["https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400"],
        stock: 5,
        condition: "N",
        colors: ["Black"],
        discount: 0
    },
    {
        id: 21,
        name: "Lenovo Yoga 9i",
        price: 1399.99,
        category: "laptops",
        subcategory: "Lenovo",
        brand: "Lenovo",
        description: "2-in-1 Lenovo laptop with 360-degree hinge",
        shortDescription: "2-in-1 Lenovo laptop with 360-degree hinge",
        specifications: "14-inch display, Intel i7-1360P, 16GB RAM, 512GB SSD",
        image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400",
        images: ["https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400"],
        stock: 9,
        condition: "N",
        colors: ["Storm Grey", "Oatmeal"],
        discount: 0
    },

    // AUDIO - AirPods
    {
        id: 22,
        name: "AirPods Pro 2nd Gen",
        price: 249.99,
        category: "audio",
        subcategory: "AirPods",
        brand: "Apple",
        description: "Wireless earbuds with active noise cancellation and spatial audio",
        shortDescription: "Wireless earbuds with noise cancellation",
        specifications: "H2 chip, Adaptive Transparency, Spatial Audio, 6-hour battery",
        image: "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400",
        images: ["https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400"],
        stock: 20,
        condition: "N",
        colors: ["White"],
        discount: 0
    },
    {
        id: 23,
        name: "AirPods 3rd Gen",
        price: 179.99,
        category: "audio",
        subcategory: "AirPods",
        brand: "Apple",
        description: "Wireless earbuds with spatial audio and water resistance",
        shortDescription: "Wireless earbuds with spatial audio",
        specifications: "H1 chip, Spatial Audio, Water resistant, 6-hour battery",
        image: "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400",
        images: ["https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400"],
        stock: 25,
        condition: "N",
        colors: ["White"],
        discount: 0
    },
    {
        id: 24,
        name: "AirPods Max",
        price: 549.99,
        category: "audio",
        subcategory: "AirPods",
        brand: "Apple",
        description: "Over-ear headphones with active noise cancellation",
        shortDescription: "Over-ear headphones with noise cancellation",
        specifications: "H1 chip, Active Noise Cancellation, Spatial Audio, 20-hour battery",
        image: "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400",
        images: ["https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400"],
        stock: 8,
        condition: "N",
        colors: ["Space Gray", "Silver", "Sky Blue", "Green", "Pink"],
        discount: 0
    },

    // AUDIO - Sony
    {
        id: 25,
        name: "Sony WH-1000XM5",
        price: 399.99,
        category: "audio",
        subcategory: "Sony",
        brand: "Sony",
        description: "Premium noise-canceling headphones with 30-hour battery life",
        shortDescription: "Premium noise-canceling headphones",
        specifications: "30-hour battery, Quick Charge, Speak-to-Chat, Multipoint connection",
        image: "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400",
        images: ["https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400"],
        stock: 12,
        condition: "N",
        colors: ["Black", "Silver"],
        discount: 0
    },
    {
        id: 26,
        name: "Sony WF-1000XM5",
        price: 299.99,
        category: "audio",
        subcategory: "Sony",
        brand: "Sony",
        description: "True wireless earbuds with industry-leading noise cancellation",
        shortDescription: "True wireless earbuds with noise cancellation",
        specifications: "Industry-leading noise cancellation, 8-hour battery, Quick Charge",
        image: "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400",
        images: ["https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400"],
        stock: 15,
        condition: "N",
        colors: ["Black", "Silver"],
        discount: 0
    },

    // AUDIO - Bose
    {
        id: 27,
        name: "Bose QuietComfort 45",
        price: 329.99,
        category: "audio",
        subcategory: "Bose",
        brand: "Bose",
        description: "Premium noise-canceling headphones with superior comfort",
        shortDescription: "Premium noise-canceling headphones",
        specifications: "24-hour battery, Quick Charge, Aware Mode, Multipoint connection",
        image: "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400",
        images: ["https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400"],
        stock: 10,
        condition: "N",
        colors: ["Black", "White Smoke"],
        discount: 0
    },
    {
        id: 28,
        name: "Bose QuietComfort Earbuds II",
        price: 279.99,
        category: "audio",
        subcategory: "Bose",
        brand: "Bose",
        description: "True wireless earbuds with Bose noise cancellation",
        shortDescription: "True wireless earbuds with Bose noise cancellation",
        specifications: "6-hour battery, Quick Charge, CustomTune, Multipoint connection",
        image: "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400",
        images: ["https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400"],
        stock: 14,
        condition: "N",
        colors: ["Black", "White"],
        discount: 0
    },

    // AUDIO - JBL
    {
        id: 29,
        name: "JBL Charge 5",
        price: 179.99,
        category: "audio",
        subcategory: "JBL",
        brand: "JBL",
        description: "Portable Bluetooth speaker with powerful bass",
        shortDescription: "Portable Bluetooth speaker with powerful bass",
        specifications: "20-hour battery, Waterproof, PartyBoost, USB-C charging",
        image: "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400",
        images: ["https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400"],
        stock: 20,
        condition: "N",
        colors: ["Black", "Blue", "Red", "Teal", "Pink"],
        discount: 0
    },
    {
        id: 30,
        name: "JBL Live Pro 2",
        price: 149.99,
        category: "audio",
        subcategory: "JBL",
        brand: "JBL",
        description: "True wireless earbuds with JBL signature sound",
        shortDescription: "True wireless earbuds with JBL signature sound",
        specifications: "10-hour battery, Active Noise Cancellation, VoiceAware, Waterproof",
        image: "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400",
        images: ["https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400"],
        stock: 18,
        condition: "N",
        colors: ["Black", "White", "Blue", "Pink"],
        discount: 0
    },

    // GAMING - PlayStation
    {
        id: 31,
        name: "PlayStation 5",
        price: 499.99,
        category: "gaming",
        subcategory: "PlayStation",
        brand: "Sony",
        description: "Next-generation gaming console with 4K gaming and ray tracing",
        shortDescription: "Next-generation gaming console",
        specifications: "AMD Zen 2 CPU, RDNA 2 GPU, 825GB SSD, 4K/120fps gaming",
        image: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=400",
        images: ["https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=400"],
        stock: 3,
        condition: "N",
        colors: ["White"],
        discount: 0
    },
    {
        id: 32,
        name: "PlayStation 5 Digital Edition",
        price: 399.99,
        category: "gaming",
        subcategory: "PlayStation",
        brand: "Sony",
        description: "PlayStation 5 without disc drive for digital games only",
        shortDescription: "PlayStation 5 without disc drive",
        specifications: "AMD Zen 2 CPU, RDNA 2 GPU, 825GB SSD, 4K/120fps gaming",
        image: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=400",
        images: ["https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=400"],
        stock: 5,
        condition: "N",
        colors: ["White"],
        discount: 0
    },

    // GAMING - Xbox
    {
        id: 33,
        name: "Xbox Series X",
        price: 499.99,
        category: "gaming",
        subcategory: "Xbox",
        brand: "Microsoft",
        description: "Most powerful Xbox console with 4K gaming and quick resume",
        shortDescription: "Most powerful Xbox console",
        specifications: "AMD Zen 2 CPU, RDNA 2 GPU, 1TB SSD, 4K/120fps gaming",
        image: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=400",
        images: ["https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=400"],
        stock: 4,
        condition: "N",
        colors: ["Black"],
        discount: 0
    },
    {
        id: 34,
        name: "Xbox Series S",
        price: 299.99,
        category: "gaming",
        subcategory: "Xbox",
        brand: "Microsoft",
        description: "Compact Xbox console with 1440p gaming",
        shortDescription: "Compact Xbox console with 1440p gaming",
        specifications: "AMD Zen 2 CPU, RDNA 2 GPU, 512GB SSD, 1440p/120fps gaming",
        image: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=400",
        images: ["https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=400"],
        stock: 8,
        condition: "N",
        colors: ["White"],
        discount: 0
    },

    // GAMING - Nintendo
    {
        id: 35,
        name: "Nintendo Switch OLED",
        price: 349.99,
        category: "gaming",
        subcategory: "Nintendo",
        brand: "Nintendo",
        description: "Nintendo Switch with 7-inch OLED display",
        shortDescription: "Nintendo Switch with 7-inch OLED display",
        specifications: "7-inch OLED display, 64GB storage, 4.5-9 hour battery",
        image: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=400",
        images: ["https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=400"],
        stock: 6,
        condition: "N",
        colors: ["Neon Blue/Red", "White"],
        discount: 0
    },
    {
        id: 36,
        name: "Nintendo Switch Lite",
        price: 199.99,
        category: "gaming",
        subcategory: "Nintendo",
        brand: "Nintendo",
        description: "Handheld-only Nintendo Switch",
        shortDescription: "Handheld-only Nintendo Switch",
        specifications: "5.5-inch display, 32GB storage, 3-7 hour battery",
        image: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=400",
        images: ["https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=400"],
        stock: 10,
        condition: "N",
        colors: ["Turquoise", "Gray", "Yellow", "Coral"],
        discount: 0
    },

    // GAMING - Gaming PC
    {
        id: 37,
        name: "Alienware Aurora R15",
        price: 1999.99,
        category: "gaming",
        subcategory: "Gaming PC",
        brand: "Dell",
        description: "High-performance gaming desktop with RTX 4070",
        shortDescription: "High-performance gaming desktop with RTX 4070",
        specifications: "Intel i7-13700F, RTX 4070, 16GB RAM, 1TB SSD",
        image: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=400",
        images: ["https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=400"],
        stock: 3,
        condition: "N",
        colors: ["Lunar Light"],
        discount: 0
    },
    {
        id: 38,
        name: "ASUS ROG Strix G15",
        price: 1299.99,
        category: "gaming",
        subcategory: "Gaming PC",
        brand: "ASUS",
        description: "Gaming laptop with RTX 4060 and AMD Ryzen 7",
        shortDescription: "Gaming laptop with RTX 4060",
        specifications: "15.6-inch display, AMD Ryzen 7 7735HS, RTX 4060, 16GB RAM",
        image: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=400",
        images: ["https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=400"],
        stock: 5,
        condition: "N",
        colors: ["Eclipse Gray"],
        discount: 0
    },

    // ACCESSORIES - Phone Cases
    {
        id: 39,
        name: "iPhone 15 Pro Case",
        price: 49.99,
        category: "accessories",
        subcategory: "Phone Cases",
        brand: "Apple",
        description: "Protective case for iPhone 15 Pro with MagSafe compatibility",
        shortDescription: "Protective case for iPhone 15 Pro",
        specifications: "MagSafe compatible, Drop protection, Wireless charging",
        image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400",
        images: ["https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400"],
        stock: 50,
        condition: "N",
        colors: ["Clear", "Black", "Blue", "Pink"],
        discount: 0
    },
    {
        id: 40,
        name: "Samsung Galaxy S24 Ultra Case",
        price: 39.99,
        category: "accessories",
        subcategory: "Phone Cases",
        brand: "Samsung",
        description: "Protective case for Samsung Galaxy S24 Ultra",
        shortDescription: "Protective case for Samsung Galaxy S24 Ultra",
        specifications: "Drop protection, S Pen compatible, Wireless charging",
        image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400",
        images: ["https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400"],
        stock: 45,
        condition: "N",
        colors: ["Black", "Blue", "Green", "Pink"],
        discount: 0
    },

    // ACCESSORIES - Chargers
    {
        id: 41,
        name: "Apple 20W USB-C Power Adapter",
        price: 19.99,
        category: "accessories",
        subcategory: "Chargers",
        brand: "Apple",
        description: "Fast charging adapter for iPhone and iPad",
        shortDescription: "Fast charging adapter for iPhone and iPad",
        specifications: "20W power delivery, USB-C port, Compact design",
        image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400",
        images: ["https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400"],
        stock: 100,
        condition: "N",
        colors: ["White"],
        discount: 0
    },
    {
        id: 42,
        name: "Samsung 25W Super Fast Charger",
        price: 25.99,
        category: "accessories",
        subcategory: "Chargers",
        brand: "Samsung",
        description: "Super fast charging adapter for Samsung devices",
        shortDescription: "Super fast charging adapter for Samsung devices",
        specifications: "25W power delivery, USB-C port, PPS technology",
        image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400",
        images: ["https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400"],
        stock: 80,
        condition: "N",
        colors: ["Black", "White"],
        discount: 0
    },

    // ACCESSORIES - Cables
    {
        id: 43,
        name: "USB-C to USB-C Cable",
        price: 19.99,
        category: "accessories",
        subcategory: "Cables",
        brand: "Anker",
        description: "High-speed USB-C to USB-C cable with 100W power delivery",
        shortDescription: "High-speed USB-C cable",
        specifications: "100W power delivery, 480Mbps data transfer, 6ft length",
        image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400",
        images: ["https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400"],
        stock: 100,
        condition: "N",
        colors: ["Black", "White"],
        discount: 0
    },
    {
        id: 44,
        name: "Lightning to USB-C Cable",
        price: 29.99,
        category: "accessories",
        subcategory: "Cables",
        brand: "Apple",
        description: "Lightning to USB-C cable for iPhone and iPad",
        shortDescription: "Lightning to USB-C cable for iPhone and iPad",
        specifications: "1m length, Fast charging, Data transfer",
        image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400",
        images: ["https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400"],
        stock: 90,
        condition: "N",
        colors: ["White"],
        discount: 0
    },

    // ACCESSORIES - Power Banks
    {
        id: 45,
        name: "Anker PowerCore 10000",
        price: 29.99,
        category: "accessories",
        subcategory: "Power Banks",
        brand: "Anker",
        description: "Portable power bank with 10000mAh capacity",
        shortDescription: "Portable power bank with 10000mAh capacity",
        specifications: "10000mAh capacity, USB-C and USB-A ports, 18W fast charging",
        image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400",
        images: ["https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400"],
        stock: 60,
        condition: "N",
        colors: ["Black", "White", "Blue"],
        discount: 0
    },
    {
        id: 46,
        name: "Anker PowerCore 20000",
        price: 49.99,
        category: "accessories",
        subcategory: "Power Banks",
        brand: "Anker",
        description: "High-capacity power bank with 20000mAh capacity",
        shortDescription: "High-capacity power bank with 20000mAh capacity",
        specifications: "20000mAh capacity, USB-C and USB-A ports, 20W fast charging",
        image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400",
        images: ["https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400"],
        stock: 40,
        condition: "N",
        colors: ["Black", "White"],
        discount: 0
    }
];

// Force update products with comprehensive list
function updateProductsWithComprehensiveList() {
    console.log('Updating products with comprehensive list of', products.length, 'products');
    localStorage.setItem('wonderElectronicsProducts', JSON.stringify(products));
    console.log('Products updated successfully!');
}

// Load products from localStorage on page load
document.addEventListener('DOMContentLoaded', function () {
    // Only update with comprehensive list if no products exist in localStorage
    const existingProducts = localStorage.getItem('wonderElectronicsProducts');
    if (!existingProducts) {
        console.log('No existing products found, initializing with comprehensive list');
        updateProductsWithComprehensiveList();
    } else {
        console.log('Existing products found in localStorage, loading them');
    }

    loadProductsFromStorage();
    loadUsersFromStorage();
    loadCurrentUser();
    loadCurrencySettings();
    loadCategoriesFromStorage();
    loadSocialMediaLinks(); // New: Load social media links

    // Force display products immediately
    displayProducts();

    // Also force refresh from storage to ensure we have latest products
    setTimeout(() => {
        refreshProductsFromStorage();
    }, 500);

    // Also force refresh from storage to ensure we have latest products
    setTimeout(() => {
        refreshProductsFromStorage();
    }, 1000);

    // Force display products after a longer delay to ensure they show
    setTimeout(() => {
        displayProducts();
    }, 2000);

    // Force display products one more time after an even longer delay
    setTimeout(() => {
        displayProducts();
    }, 5000);

    // Force display products one more time after an even longer delay
    setTimeout(() => {
        displayProducts();
    }, 10000);
    loadWebsiteSettings(); // New: Load website settings
    // Create example trending products if none exist
    createExampleTrendingProducts();

    loadHeroImage(); // Load hero image section
    displayProducts();
    updateCartDisplay();
    updateCategoryFilters();
    setupEventListeners();

    setupProductFilters(); // New: Setup product filters

    // Test: Make all dropdowns visible for testing
    setTimeout(() => {
        const dropdowns = document.querySelectorAll('.subcategory-dropdown');
        console.log('Found dropdowns:', dropdowns.length);
        dropdowns.forEach((dropdown, index) => {
            console.log(`Dropdown ${index}:`, dropdown);
            dropdown.style.display = 'block';
            dropdown.style.position = 'relative';
            dropdown.style.top = '0';
            dropdown.style.left = '0';
            dropdown.style.width = '200px';
            dropdown.style.margin = '10px';
            dropdown.style.border = '2px solid blue';
        });
    }, 1000);

    updateNavigation();

    // Check for product updates every 500ms for faster sync
    setInterval(() => {
        const storedProducts = localStorage.getItem('wonderElectronicsProducts');
        if (storedProducts) {
            const newProducts = JSON.parse(storedProducts);
            if (newProducts.length !== products.length) {
                refreshProductsFromStorage();
            } else {
                // Even if count is same, check if products are different
                const currentProductIds = products.map(p => p.id).sort();
                const newProductIds = newProducts.map(p => p.id).sort();
                if (JSON.stringify(currentProductIds) !== JSON.stringify(newProductIds)) {
                    refreshProductsFromStorage();
                }
            }
        }
    }, 500);

    // Listen for storage changes from admin
    window.addEventListener('storage', function (e) {
        if (e.key === 'wonderElectronicsProducts') {
            refreshProductsFromStorage();
        }
    });

    // Also listen for custom events
    window.addEventListener('productAdded', function (e) {
        refreshProductsFromStorage();
    });

    // Listen for visibility change events
    window.addEventListener('visibilitychange', function () {
        refreshProductsFromStorage();
    });

    // Listen for focus events
    window.addEventListener('focus', function () {
        refreshProductsFromStorage();
    });

    // Add manual refresh function to window for debugging
    window.refreshProducts = function () {
        refreshProductsFromStorage();

        // Force display after refresh
        setTimeout(() => {
            displayProducts();
        }, 100);
    };

    // Add force display function
    window.forceDisplayProducts = function () {
        displayProducts();
    };




});

// Load products from localStorage
function loadProductsFromStorage() {
    const storedProducts = localStorage.getItem('wonderElectronicsProducts');
    if (storedProducts) {
        products = JSON.parse(storedProducts);
    } else {
        // Save initial products to localStorage
        saveProductsToStorage();
    }
}

// Save products to localStorage
function saveProductsToStorage() {
    localStorage.setItem('wonderElectronicsProducts', JSON.stringify(products));
}

// Refresh products from localStorage (for admin updates)
function refreshProductsFromStorage() {
    const storedProducts = localStorage.getItem('wonderElectronicsProducts');
    if (storedProducts) {
        const newProducts = JSON.parse(storedProducts);
        products = newProducts;

        // Check for products with local storage images
        const productsWithLocalImages = products.filter(p => p.image && p.image.startsWith('data:'));

        // Force display if we have products with local images
        if (productsWithLocalImages.length > 0) {
            displayProducts();
        }

        // Force display update
        displayProducts();

        // Also force display after a short delay to ensure it works
        setTimeout(() => {
            displayProducts();
        }, 200);

        // Force display one more time after a longer delay
        setTimeout(() => {
            displayProducts();
        }, 1000);

        // Force display one more time after an even longer delay
        setTimeout(() => {
            displayProducts();
        }, 3000);

        // Force display one more time after an even longer delay
        setTimeout(() => {
            displayProducts();
        }, 5000);

        return true;
    }
    return false;
}

// Load users from localStorage
function loadUsersFromStorage() {
    const storedUsers = localStorage.getItem('wonderElectronicsUsers');
    if (storedUsers) {
        users = JSON.parse(storedUsers);
    } else {
        // Create default admin user
        users = [
            {
                id: 1,
                name: 'Admin User',
                email: 'admin@wonderelectronics.com',
                password: 'admin123',
                phone: '+1-555-0123',
                role: 'admin',
                joinDate: new Date().toISOString()
            }
        ];
        saveUsersToStorage();
    }
}

// Save users to localStorage
function saveUsersToStorage() {
    localStorage.setItem('wonderElectronicsUsers', JSON.stringify(users));
}

// Load current user from localStorage
function loadCurrentUser() {
    const storedUser = localStorage.getItem('wonderElectronicsCurrentUser');
    if (storedUser) {
        currentUser = JSON.parse(storedUser);
    }
}

// Save current user to localStorage
function saveCurrentUser() {
    if (currentUser) {
        localStorage.setItem('wonderElectronicsCurrentUser', JSON.stringify(currentUser));
    } else {
        localStorage.removeItem('wonderElectronicsCurrentUser');
    }
}

// Load currency settings from admin settings
function loadCurrencySettings() {
    const storedSettings = localStorage.getItem('wonderElectronicsSettings');
    if (storedSettings) {
        const settings = JSON.parse(storedSettings);
        if (settings.usdToRwf) currencyRates.RWF = settings.usdToRwf;
        if (settings.usdToEur) currencyRates.EUR = settings.usdToEur;
        if (settings.usdToGbp) currencyRates.GBP = settings.usdToGbp;
        if (settings.currency) currentCurrency = settings.currency;
    }

    // Update currency selector
    const currencySelect = document.getElementById('currencySelect');
    if (currencySelect) {
        currencySelect.value = currentCurrency;
    }

    // Update currency toggle
    updateCurrencyToggle();

    // Update all prices on the website with the loaded currency
    updateAllPricesOnWebsite();
}

// Load categories from localStorage
function loadCategoriesFromStorage() {
    const storedCategories = localStorage.getItem('wonderElectronicsCategories');
    if (storedCategories) {
        window.categories = JSON.parse(storedCategories);
    } else {
        // Default categories if none exist
        window.categories = [
            { name: 'smartphones', displayName: 'Smartphones', icon: 'fas fa-mobile-alt' },
            { name: 'laptops', displayName: 'Laptops', icon: 'fas fa-laptop' },
            { name: 'audio', displayName: 'Audio', icon: 'fas fa-headphones' },
            { name: 'gaming', displayName: 'Gaming', icon: 'fas fa-gamepad' }
        ];
    }
}

// Update category filter buttons
function updateCategoryFilters() {
    const filterContainer = document.querySelector('.product-filters');
    if (!filterContainer || !window.categories) return;

    // Keep the "All Products" button
    const allButton = filterContainer.querySelector('[data-category="all"]');
    filterContainer.innerHTML = '';
    filterContainer.appendChild(allButton);

    // Add category buttons
    window.categories.forEach(category => {
        const button = document.createElement('button');
        button.className = 'filter-btn';
        button.setAttribute('data-category', category.name);
        button.innerHTML = `<i class="${category.icon}"></i> ${category.displayName}`;
        filterContainer.appendChild(button);
    });

    // Re-attach event listeners
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            button.classList.add('active');

            // Filter products
            const category = button.getAttribute('data-category');
            displayProducts(category);
        });
    });
}

// Update navigation based on login status
function updateNavigation() {
    const loginNavItem = document.getElementById('loginNavItem');
    const userNavItem = document.getElementById('userNavItem');
    const userNameLink = document.getElementById('userNameLink');

    if (currentUser) {
        loginNavItem.style.display = 'none';
        userNavItem.style.display = 'block';
        userNameLink.textContent = `Welcome, ${currentUser.name}`;
    } else {
        loginNavItem.style.display = 'block';
        userNavItem.style.display = 'none';
    }
}

// Open login modal
function openLoginModal() {
    const modal = document.getElementById('loginModal');
    if (modal) {
        modal.style.display = 'block';
        switchTab('login');
    }
}

// Close login modal
function closeLoginModal() {
    const modal = document.getElementById('loginModal');
    if (modal) {
        modal.style.display = 'none';
        // Clear forms
        document.getElementById('loginFormElement').reset();
        document.getElementById('signupFormElement').reset();
    }
}


// Switch between login and signup tabs
function switchTab(tab) {
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    const tabBtns = document.querySelectorAll('.tab-btn');

    // Remove active class from all tabs and forms
    tabBtns.forEach(btn => btn.classList.remove('active'));
    loginForm.classList.remove('active');
    signupForm.classList.remove('active');

    // Add active class to selected tab and form
    if (tab === 'login') {
        document.querySelector('.tab-btn[onclick="switchTab(\'login\')"]').classList.add('active');
        loginForm.classList.add('active');
    } else {
        document.querySelector('.tab-btn[onclick="switchTab(\'signup\')"]').classList.add('active');
        signupForm.classList.add('active');
    }
}

// Handle login
function handleLogin(email, password) {
    const userByEmail = users.find(u => u.email === email);

    if (!userByEmail) {
        showNotification('Email does not exist. Please check your email or sign up.', 'error');
        return false;
    }

    if (userByEmail.password !== password) {
        showNotification('Email is correct but password is incorrect. Please check your password.', 'error');
        return false;
    }

    currentUser = userByEmail;
    saveCurrentUser();
    updateNavigation();
    closeLoginModal();
    showNotification(`Welcome back, ${userByEmail.name}!`, 'success');
    return true;
}


// Email validation function
async function validateEmail(email) {
    // Basic email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return { valid: false, message: 'Please enter a valid email format (e.g., user@example.com)' };
    }

    try {
        // Use a free email validation API
        const response = await fetch(`https://api.email-validator.net/api/verify?Email=${encodeURIComponent(email)}&APIKey=free`);
        const data = await response.json();

        if (data.status === 'valid') {
            return { valid: true, message: 'Email is valid' };
        } else if (data.status === 'invalid') {
            return { valid: false, message: 'This email does not exist. Please use a real email address.' };
        } else {
            // If API fails, fall back to basic validation
            return { valid: true, message: 'Email format is correct' };
        }
    } catch (error) {
        console.log('Email validation API failed, using basic validation');
        return { valid: true, message: 'Email format is correct' };
    }
}

// Handle signup
async function handleSignup(name, email, password, phone) {
    // Check if user already exists
    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
        showNotification('User with this email already exists', 'error');
        return false;
    }

    // Validate email
    showNotification('Validating email address...', 'info');
    const emailValidation = await validateEmail(email);

    if (!emailValidation.valid) {
        showNotification(emailValidation.message, 'error');
        return false;
    }

    // Create new user
    const newUser = {
        id: Date.now(),
        name: name,
        email: email,
        password: password,
        phone: phone,
        role: 'customer',
        joinDate: new Date().toISOString()
    };

    users.push(newUser);
    saveUsersToStorage();

    // Auto-login the new user
    currentUser = newUser;
    saveCurrentUser();
    updateNavigation();
    closeLoginModal();
    showNotification(`Account created successfully! Welcome, ${name}!`, 'success');
    return true;
}

// Logout function
function logout() {
    currentUser = null;
    saveCurrentUser();
    updateNavigation();
    showNotification('You have been logged out', 'info');
}

// OTP and Password Recovery System
function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

function sendOTP(phoneNumber) {
    const otp = generateOTP();
    otpCodes[phoneNumber] = {
        code: otp,
        timestamp: Date.now(),
        attempts: 0
    };

    // In a real application, you would send this OTP via SMS
    // For demo purposes, we'll show it in an alert
    alert(`OTP sent to ${phoneNumber}: ${otp}`);

    showNotification('OTP sent to your mobile number!', 'success');
    return otp;
}

function verifyOTP(phoneNumber, enteredOTP) {
    const otpData = otpCodes[phoneNumber];
    if (!otpData) {
        showNotification('No OTP found for this number', 'error');
        return false;
    }

    // Check if OTP is expired (5 minutes)
    if (Date.now() - otpData.timestamp > 300000) {
        delete otpCodes[phoneNumber];
        showNotification('OTP has expired. Please request a new one.', 'error');
        return false;
    }

    // Check attempts limit
    if (otpData.attempts >= 3) {
        delete otpCodes[phoneNumber];
        showNotification('Too many failed attempts. Please request a new OTP.', 'error');
        return false;
    }

    if (otpData.code === enteredOTP) {
        delete otpCodes[phoneNumber];
        return true;
    } else {
        otpData.attempts++;
        showNotification('Invalid OTP. Please try again.', 'error');
        return false;
    }
}

function openPasswordRecoveryModal() {
    document.getElementById('passwordRecoveryModal').style.display = 'block';
}

function closePasswordRecoveryModal() {
    document.getElementById('passwordRecoveryModal').style.display = 'none';
}

function requestPasswordReset() {
    const email = document.getElementById('recoveryEmail').value;
    if (!email) {
        showNotification('Please enter your email address', 'error');
        return;
    }

    // Check if user exists with this email
    const user = users.find(u => u.email === email);
    if (!user) {
        showNotification('No account found with this email address', 'error');
        return;
    }

    // Create password reset request
    const resetRequest = {
        id: Date.now(),
        userEmail: email,
        userName: user.name,
        requestDate: new Date().toISOString(),
        status: 'pending',
        adminNotified: false
    };

    // Save reset request
    let resetRequests = JSON.parse(localStorage.getItem('wonderElectronicsResetRequests') || '[]');
    resetRequests.push(resetRequest);
    localStorage.setItem('wonderElectronicsResetRequests', JSON.stringify(resetRequests));

    showNotification('Password reset request submitted. Admin will be notified and send you a new password via email.', 'success');
    closePasswordRecoveryModal();

    // Notify admin about password reset request
    notifyAdminPasswordReset(user, resetRequest);
}

function verifyOTPForRecovery() {
    const phoneNumber = document.getElementById('recoveryPhone').value;
    const otp = document.getElementById('recoveryOTP').value;

    if (verifyOTP(phoneNumber, otp)) {
        document.getElementById('otpSection').style.display = 'none';
        document.getElementById('newPasswordSection').style.display = 'block';
        showNotification('OTP verified! Please enter your new password.', 'success');
    }
}

function resetPassword() {
    const phoneNumber = document.getElementById('recoveryPhone').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    if (newPassword !== confirmPassword) {
        showNotification('Passwords do not match', 'error');
        return;
    }

    if (newPassword.length < 6) {
        showNotification('Password must be at least 6 characters', 'error');
        return;
    }

    // Find user and update password
    const userIndex = users.findIndex(u => u.phone === phoneNumber);
    if (userIndex !== -1) {
        users[userIndex].password = newPassword;
        users[userIndex].passwordResetPending = true; // Flag for admin approval
        users[userIndex].passwordResetDate = new Date().toISOString();
        saveUsersToStorage();

        showNotification('Password reset request submitted. Please wait for admin approval.', 'success');
        closePasswordRecoveryModal();

        // Notify admin about pending password reset
        notifyAdminPasswordReset(users[userIndex]);
    }
}

function notifyAdminPasswordReset(user) {
    // In a real application, this would send a notification to admin
    console.log(`Password reset requested for user: ${user.name} (${user.email})`);
    showNotification('Admin has been notified of your password reset request.', 'info');
}

// Chat Support System
function openChatSupport() {
    const modal = document.getElementById('chatSupportModal');
    modal.style.display = 'block';
    modal.classList.add('show');
    loadChatMessages();
}

function closeChatSupport() {
    const modal = document.getElementById('chatSupportModal');
    modal.classList.remove('show');
    setTimeout(() => {
        modal.style.display = 'none';
    }, 300); // Wait for animation to complete
}

function loadChatMessages() {
    const chatMessages = document.getElementById('chatMessages');
    const storedMessages = localStorage.getItem('wonderElectronicsChatMessages');

    if (storedMessages) {
        const messages = JSON.parse(storedMessages);
        chatMessages.innerHTML = '';
        messages.forEach(message => {
            addMessageToChat(message.text, message.sender, message.timestamp);
        });
    }
}

function sendChatMessage() {
    const chatInput = document.getElementById('chatInput');
    const message = chatInput.value.trim();

    if (!message) return;

    // Get or create guest ID for non-logged-in users
    let userName = 'Guest';
    let userId = null;

    if (currentUser) {
        userName = currentUser.name;
        userId = currentUser.email;
    } else {
        // Create a unique guest ID if not exists
        userId = localStorage.getItem('wonderElectronicsGuestId');
        if (!userId) {
            userId = 'guest_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            localStorage.setItem('wonderElectronicsGuestId', userId);
        }
        userName = 'Guest User';
    }

    addMessageToChat(message, 'user', new Date().toISOString());
    chatInput.value = '';

    // Save message to localStorage with user name and ID
    saveChatMessage(message, 'user', userName, userId);
}

function addMessageToChat(text, sender, timestamp) {
    const chatMessages = document.getElementById('chatMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}-message`;

    const time = new Date(timestamp).toLocaleTimeString();
    messageDiv.innerHTML = `
        <div class="message-content">
            <p>${text}</p>
            <span class="message-time">${time}</span>
        </div>
    `;

    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function saveChatMessage(text, sender, userName, userId) {
    const messages = JSON.parse(localStorage.getItem('wonderElectronicsChatMessages') || '[]');
    messages.push({
        text: text,
        sender: sender,
        userName: userName || (currentUser ? currentUser.name : 'Guest User'),
        userId: userId || (currentUser ? currentUser.email : localStorage.getItem('wonderElectronicsGuestId')),
        timestamp: new Date().toISOString()
    });
    localStorage.setItem('wonderElectronicsChatMessages', JSON.stringify(messages));
}

function handleChatKeyPress(event) {
    if (event.key === 'Enter') {
        sendChatMessage();
    }
}

// Social Media Integration
function loadSocialMediaLinks() {
    const settings = JSON.parse(localStorage.getItem('wonderElectronicsSettings') || '{}');

    // Update social media names (numbers are fixed)
    const instagramName = document.getElementById('instagramName');
    if (instagramName) {
        instagramName.textContent = settings.instagramName || 'Wonder Electronics';
    }

    const facebookName = document.getElementById('facebookName');
    if (facebookName) {
        facebookName.textContent = settings.facebookName || 'Wonder Electronics';
    }

    const tiktokName = document.getElementById('tiktokName');
    if (tiktokName) {
        tiktokName.textContent = settings.tiktokName || 'Wonder Electronics';
    }

    // WhatsApp contact is fixed at +250787070049
}

// Check if stock quantity should be displayed
function shouldShowStock() {
    const settings = JSON.parse(localStorage.getItem('wonderElectronicsSettings') || '{}');
    return settings.showStockQuantity !== false; // Default to true if not set
}

// Product Detail Modal Functions
let currentDetailProduct = null;
let selectedColor = null;

function openProductDetail(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    currentDetailProduct = product;
    selectedColor = null;

    // Populate modal with product details
    document.getElementById('detailProductName').textContent = product.name;

    // Badges
    let badges = '';
    if (product.condition) {
        badges += `<span class="product-condition-badge ${product.condition === 'N' ? 'new' : 'used'}">${product.condition === 'N' ? 'NEW' : 'USED'}</span>`;
    }
    if (product.discount && product.discount > 0) {
        badges += `<span class="product-discount-badge" style="margin-left: 0.5rem;">${product.discount}% OFF</span>`;
    }
    document.getElementById('detailProductBadges').innerHTML = badges;

    // Price
    let priceHTML = '';
    if (product.discount && product.discount > 0) {
        priceHTML = `
            <div class="detail-price">
                <span class="original-price">${formatCurrency(product.price)}</span>
                <span class="sale-price">${formatCurrency(product.price * (1 - product.discount / 100))}</span>
            </div>
        `;
    } else {
        priceHTML = `<div class="detail-price">${formatCurrency(product.price)}</div>`;
    }
    document.getElementById('detailProductPrice').innerHTML = priceHTML;

    // Description
    document.getElementById('detailProductDescription').textContent = product.description;

    // Brand
    document.getElementById('detailProductBrand').textContent = product.brand;

    // Stock
    if (shouldShowStock()) {
        document.getElementById('detailProductStock').innerHTML = `
            <div style="margin: 1rem 0; padding: 0.8rem; background: #e8f5e8; border-radius: 8px; color: #2e7d32;">
                <i class="fas fa-box"></i> <strong>${product.stock} units</strong> in stock
            </div>
        `;
    } else {
        document.getElementById('detailProductStock').innerHTML = '';
    }

    // Images
    displayProductImages(product);

    // Colors
    if (product.colors && product.colors.length > 0) {
        document.getElementById('colorSection').style.display = 'block';
        displayColorOptions(product.colors);
    } else {
        document.getElementById('colorSection').style.display = 'none';
    }

    // Add to cart button
    document.getElementById('addToCartDetailBtn').onclick = () => {
        if (product.colors && product.colors.length > 0 && !selectedColor) {
            showNotification('Please select a color', 'error');
            return;
        }
        addToCart(product.id, selectedColor);
        closeProductDetail();
    };

    // Show modal
    document.getElementById('productDetailModal').style.display = 'block';
}

function closeProductDetail() {
    document.getElementById('productDetailModal').style.display = 'none';
    currentDetailProduct = null;
    selectedColor = null;
}

function displayProductImages(product) {
    const mainImageContainer = document.getElementById('mainProductImage');
    const thumbnailContainer = document.getElementById('thumbnailImages');

    // Collect all images
    let allImages = [product.image];
    if (product.images && product.images.length > 0) {
        allImages = allImages.concat(product.images);
    }

    console.log('Displaying product images for:', product.name);
    console.log('Main image:', product.image);
    console.log('Additional images:', product.images);
    console.log('All images:', allImages);
    console.log('First image to display:', allImages[0]);
    console.log('First image length:', allImages[0] ? allImages[0].length : 0);

    // Display main image
    mainImageContainer.innerHTML = `<img src="${allImages[0]}" alt="${product.name}" class="detail-main-image" onerror="console.log('Detail image failed to load:', '${product.name}', 'URL:', '${allImages[0]}');">`;

    // Display thumbnails
    if (allImages.length > 1) {
        thumbnailContainer.innerHTML = allImages.map((img, index) => `
            <img src="${img}" alt="${product.name} ${index + 1}" class="thumbnail-image" onclick="changeMainImage('${img}')">
        `).join('');
    } else {
        thumbnailContainer.innerHTML = '';
    }
}

function changeMainImage(imageSrc) {
    document.getElementById('mainProductImage').innerHTML = `<img src="${imageSrc}" alt="Product" class="detail-main-image">`;
}

function displayColorOptions(colors) {
    const colorContainer = document.getElementById('colorOptions');
    colorContainer.innerHTML = colors.map(color => `
        <button class="color-option" onclick="selectColor('${color}')" data-color="${color}">
            ${color}
        </button>
    `).join('');
}

function selectColor(color) {
    selectedColor = color;

    // Update UI
    document.querySelectorAll('.color-option').forEach(btn => {
        btn.classList.remove('selected');
        if (btn.dataset.color === color) {
            btn.classList.add('selected');
        }
    });

    showNotification(`Selected color: ${color}`, 'info');
}

// Product Specifications Modal
function showProductSpecifications(productId) {
    const product = products.find(p => p.id === productId);
    if (!product || !product.specifications || product.specifications.length === 0) return;

    // Create modal if it doesn't exist
    let modal = document.getElementById('specificationsModal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'specificationsModal';
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content specifications-content">
                <span class="close" onclick="closeSpecifications()">&times;</span>
                <h2 id="specsProductName"></h2>
                <div class="specifications-list" id="specificationsList"></div>
            </div>
        `;
        document.body.appendChild(modal);
    }

    // Populate modal
    document.getElementById('specsProductName').textContent = `${product.name} - Specifications`;

    const specsList = document.getElementById('specificationsList');
    specsList.innerHTML = product.specifications.map(spec => `
        <div class="spec-item">
            <span class="spec-label">${spec.split(':')[0]}:</span>
            <span class="spec-value">${spec.split(':').slice(1).join(':').trim()}</span>
        </div>
    `).join('');

    // Show modal
    modal.style.display = 'block';
}

function closeSpecifications() {
    const modal = document.getElementById('specificationsModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// Load website settings and update client-side content
function loadWebsiteSettings() {
    const settings = JSON.parse(localStorage.getItem('wonderElectronicsSettings') || '{}');

    // Update site title
    if (settings.siteTitle) {
        document.title = settings.siteTitle;
        const logo = document.querySelector('.nav-logo h2');
        if (logo) logo.textContent = settings.siteTitle;
    }

    // Update hero section
    if (settings.heroTitle) {
        const heroTitle = document.querySelector('.hero-content h1');
        if (heroTitle) heroTitle.textContent = settings.heroTitle;
    }

    if (settings.heroSubtitle) {
        const heroSubtitle = document.querySelector('.hero-content p');
        if (heroSubtitle) heroSubtitle.textContent = settings.heroSubtitle;
    }

    // Update about section
    if (settings.aboutTitle) {
        const aboutTitle = document.querySelector('#about h2');
        if (aboutTitle) aboutTitle.textContent = settings.aboutTitle;
    }

    if (settings.aboutContent) {
        const aboutContent = document.querySelector('#about p');
        if (aboutContent) aboutContent.textContent = settings.aboutContent;
    }

    // Update contact information
    if (settings.contactPhone) {
        const phoneElement = document.querySelector('.contact-item:nth-child(1) p');
        if (phoneElement) phoneElement.textContent = settings.contactPhone;
    }

    if (settings.contactEmail) {
        const emailElement = document.querySelector('.contact-item:nth-child(2) p');
        if (emailElement) emailElement.textContent = settings.contactEmail;
    }

    if (settings.contactAddress) {
        const addressElement = document.querySelector('.contact-item:nth-child(3) p');
        if (addressElement) addressElement.textContent = settings.contactAddress;
    }

    // Update currency rates
    if (settings.usdToRwf) currencyRates.RWF = settings.usdToRwf;
    if (settings.usdToEur) currencyRates.EUR = settings.usdToEur;
    if (settings.usdToGbp) currencyRates.GBP = settings.usdToGbp;
    if (settings.currency) currentCurrency = settings.currency;

    // Update currency toggle
    updateCurrencyToggle();
}

// Hero Image Functions
function loadHeroImage() {
    console.log('Loading hero image...');

    // Load hero image settings from localStorage
    const heroImageSettings = localStorage.getItem('wonderElectronicsHeroImage');
    let settings = {
        imageUrl: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=1200',
        title: 'Discover Amazing Electronics',
        message: 'Shop the latest technology at unbeatable prices'
    };

    if (heroImageSettings) {
        try {
            const savedSettings = JSON.parse(heroImageSettings);
            settings = { ...settings, ...savedSettings };
            console.log('Loaded hero image settings:', settings);
        } catch (e) {
            console.error('Error parsing hero image settings:', e);
        }
    }

    // Apply settings to hero image section
    const heroSection = document.getElementById('heroImageSection');
    const titleElement = document.getElementById('heroImageTitle');
    const messageElement = document.getElementById('heroImageMessage');

    if (heroSection) {
        heroSection.style.backgroundImage = `url('${settings.imageUrl}')`;
        heroSection.style.backgroundSize = 'cover';
        heroSection.style.backgroundPosition = 'center center';
        heroSection.style.backgroundRepeat = 'no-repeat';
        heroSection.style.imageRendering = 'high-quality';
        console.log('Applied hero image background with optimized settings:', settings.imageUrl);
    }

    // Handle optional title
    if (titleElement) {
        if (settings.title && settings.title.trim()) {
            titleElement.textContent = settings.title;
            titleElement.style.display = 'block';
            console.log('Applied hero image title:', settings.title);
        } else {
            titleElement.style.display = 'none';
            console.log('Hero image title hidden (empty)');
        }
    }

    // Handle optional message
    if (messageElement) {
        if (settings.message && settings.message.trim()) {
            messageElement.textContent = settings.message;
            messageElement.style.display = 'block';
            console.log('Applied hero image message:', settings.message);
        } else {
            messageElement.style.display = 'none';
            console.log('Hero image message hidden (empty)');
        }
    }

    // Handle Shop Now button visibility
    const shopButton = document.querySelector('.hero-image-btn');
    if (shopButton) {
        if (settings.showShopButton !== false) {
            shopButton.style.display = 'block';
            console.log('Shop Now button shown');
        } else {
            shopButton.style.display = 'none';
            console.log('Shop Now button hidden');
        }
    }

    // Adjust overlay opacity based on content visibility
    const overlay = document.querySelector('.hero-image-overlay');
    if (overlay) {
        const hasTitle = settings.title && settings.title.trim();
        const hasMessage = settings.message && settings.message.trim();
        const hasButton = settings.showShopButton !== false;

        if (hasTitle || hasMessage || hasButton) {
            // Show overlay with content
            overlay.style.background = 'rgba(0, 0, 0, 0.4)';
            overlay.style.display = 'flex';
            heroSection.classList.remove('promotion-mode');
            console.log('Overlay shown with content');
        } else {
            // Hide overlay for clean image display (promotion images)
            overlay.style.background = 'rgba(0, 0, 0, 0.1)';
            overlay.style.display = 'none';
            heroSection.classList.add('promotion-mode');
            console.log('Overlay hidden for clean image display - promotion mode');
        }
    }

    console.log('Hero image loaded successfully');
}

function scrollToProducts() {
    document.getElementById('products').scrollIntoView({ behavior: 'smooth' });
}

// Settings Functions
function openSettings() {
    document.getElementById('settingsModal').style.display = 'block';
    loadSettings();
}

function closeSettings() {
    document.getElementById('settingsModal').style.display = 'none';
}

function loadSettings() {
    const settings = JSON.parse(localStorage.getItem('wonderElectronicsSettings')) || {
        theme: 'light',
        notifications: true
    };

    // Set theme radio button
    document.querySelector(`input[name="theme"][value="${settings.theme}"]`).checked = true;

    // Set notifications checkbox
    document.getElementById('notificationsEnabled').checked = settings.notifications;

    // Apply current theme
    applyTheme(settings.theme);
}

function saveSettings() {
    const theme = document.querySelector('input[name="theme"]:checked').value;
    const notifications = document.getElementById('notificationsEnabled').checked;

    const settings = {
        theme: theme,
        notifications: notifications
    };

    localStorage.setItem('wonderElectronicsSettings', JSON.stringify(settings));
    applyTheme(theme);
    closeSettings();
    showNotification('Settings saved successfully!', 'success');
}

function resetSettings() {
    const defaultSettings = {
        theme: 'light',
        notifications: true
    };

    localStorage.setItem('wonderElectronicsSettings', JSON.stringify(defaultSettings));
    loadSettings();
    showNotification('Settings reset to default', 'info');
}

function applyTheme(theme) {
    if (theme === 'dark') {
        document.body.classList.add('dark-theme');
    } else {
        document.body.classList.remove('dark-theme');
    }
}

// Load settings on page load
document.addEventListener('DOMContentLoaded', function () {
    const settings = JSON.parse(localStorage.getItem('wonderElectronicsSettings')) || {
        theme: 'light',
        notifications: true
    };
    applyTheme(settings.theme);
});

function loadTrendingCarousel() {
    console.log('Loading trending carousel...');

    // Check if slideshow container exists
    const slidesContainer = document.getElementById('slideshowContainer');
    const indicatorsContainer = document.getElementById('slideshowIndicators');

    console.log('Slideshow containers check:', {
        slidesContainer: !!slidesContainer,
        indicatorsContainer: !!indicatorsContainer,
        slidesContainerElement: slidesContainer,
        indicatorsContainerElement: indicatorsContainer
    });

    if (!slidesContainer || !indicatorsContainer) {
        console.error('CRITICAL: Slideshow containers not found!');
        console.error('slideshowContainer:', slidesContainer);
        console.error('slideshowIndicators:', indicatorsContainer);
        return;
    }

    // Load trending products from localStorage
    const storedTrendingProducts = localStorage.getItem('wonderElectronicsTrendingProducts');
    let trendingProducts = [];

    if (storedTrendingProducts && storedTrendingProducts !== '[]' && storedTrendingProducts !== 'null') {
        try {
            trendingProducts = JSON.parse(storedTrendingProducts);
            console.log('Loaded', trendingProducts.length, 'trending products from storage');
        } catch (e) {
            console.error('Error parsing trending products:', e);
            trendingProducts = [];
        }
    }

    // If no trending products, create some sample products
    if (!trendingProducts || trendingProducts.length === 0) {
        console.log('No trending products found, creating sample products...');

        // Create sample trending products
        trendingProducts = [
            {
                id: 1,
                name: "iPhone 15 Pro Max",
                price: 1199.99,
                discount: 10,
                image: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=1200",
                shortDescription: "Latest flagship smartphone with advanced camera system",
                category: "smartphones",
                brand: "Apple"
            },
            {
                id: 2,
                name: "MacBook Pro M3",
                price: 1999.99,
                discount: 15,
                image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=1200",
                shortDescription: "Powerful laptop with M3 chip for professionals",
                category: "laptops",
                brand: "Apple"
            },
            {
                id: 3,
                name: "AirPods Pro 2nd Gen",
                price: 249.99,
                discount: 20,
                image: "https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=1200",
                shortDescription: "Premium wireless earbuds with noise cancellation",
                category: "audio",
                brand: "Apple"
            },
            {
                id: 4,
                name: "PlayStation 5",
                price: 499.99,
                discount: 5,
                image: "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=1200",
                shortDescription: "Next-generation gaming console with 4K gaming",
                category: "gaming",
                brand: "Sony"
            },
            {
                id: 5,
                name: "Samsung Galaxy S24 Ultra",
                price: 1299.99,
                discount: 12,
                image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=1200",
                shortDescription: "Premium Android smartphone with S Pen",
                category: "smartphones",
                brand: "Samsung"
            },
            {
                id: 6,
                name: "Dell XPS 13",
                price: 1299.99,
                discount: 8,
                image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=1200",
                shortDescription: "Ultra-thin laptop with stunning display",
                category: "laptops",
                brand: "Dell"
            }
        ];

        // Save sample trending products to localStorage
        localStorage.setItem('wonderElectronicsTrendingProducts', JSON.stringify(trendingProducts));
        console.log('Created sample trending products');
    }

    console.log('Displaying slideshow with', trendingProducts.length, 'trending products');
    displayTrendingSlides(trendingProducts);

    if (trendingProducts.length > 1) {
        startCarousel();
    }

    // Show notification to user about trending products
    if (trendingProducts.length > 0) {
        setTimeout(() => {
            showNotification(`Showing ${trendingProducts.length} trending products in slideshow`, 'success');
        }, 2000);
    }

    // Force show slideshow with a simple test
    setTimeout(() => {
        const slideshowElement = document.querySelector('.trending-slideshow');
        if (slideshowElement) {
            slideshowElement.style.display = 'block';
            slideshowElement.style.visibility = 'visible';
            slideshowElement.style.opacity = '1';
            slideshowElement.style.height = '450px';
            slideshowElement.style.background = '#f0f0f0';
            console.log('Forced slideshow visibility with timeout');
        } else {
            console.error('Slideshow element not found for forced visibility');
        }

        // Create a simple fallback slideshow if nothing is showing
        const slidesContainer = document.getElementById('slideshowContainer');
        if (slidesContainer && slidesContainer.children.length === 0) {
            console.log('Creating fallback slideshow content...');
            slidesContainer.innerHTML = `
                <div class="slideshow-slide active" style="display: block; opacity: 1;">
                    <img src="https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=1200" alt="iPhone 15 Pro Max" style="width: 100%; height: 100%; object-fit: cover;">
                    <div class="slide-overlay">
                        <h3>iPhone 15 Pro Max</h3>
                        <p>Latest flagship smartphone with advanced camera system</p>
                        <div class="slide-price">
                            <span class="original-price">$1,199.99</span>
                            <span class="sale-price">$1,079.99</span>
                            <span class="discount-badge">-10%</span>
                        </div>
                        <button class="slide-shop-btn" onclick="addToCart(1)">
                            <i class="fas fa-shopping-cart"></i> Add to Cart
                        </button>
                    </div>
                </div>
            `;
            console.log('Fallback slideshow content created');
        }
    }, 1000);
}

// Search Products Function with Suggestions
function searchProducts() {
    const searchInput = document.getElementById('searchInput');
    const searchTerm = searchInput.value.toLowerCase().trim();

    if (!searchTerm) {
        displayProducts();
        hideSearchSuggestions();
        return;
    }

    const filtered = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm) ||
        product.description.toLowerCase().includes(searchTerm) ||
        product.category.toLowerCase().includes(searchTerm) ||
        (product.brand && product.brand.toLowerCase().includes(searchTerm))
    );

    displayProducts('all', filtered);
    showSearchSuggestions(searchTerm, filtered);

    // Scroll to products section
    document.getElementById('products').scrollIntoView({ behavior: 'smooth' });
}

// Show search suggestions
function showSearchSuggestions(searchTerm, filteredProducts) {
    const searchContainer = document.querySelector('.search-container');
    let suggestionsContainer = document.getElementById('searchSuggestions');

    if (!suggestionsContainer) {
        suggestionsContainer = document.createElement('div');
        suggestionsContainer.id = 'searchSuggestions';
        suggestionsContainer.style.cssText = `
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            background: white;
            border: 1px solid #ddd;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
            z-index: 1000;
            max-height: 200px;
            overflow-y: auto;
        `;
        searchContainer.style.position = 'relative';
        searchContainer.appendChild(suggestionsContainer);
    }

    if (filteredProducts.length === 0) {
        suggestionsContainer.innerHTML = '<div style="padding: 10px; color: #666;">No products found</div>';
        suggestionsContainer.style.display = 'block';
        return;
    }

    const suggestions = filteredProducts.slice(0, 5).map(product => `
        <div class="suggestion-item" style="
            padding: 10px;
            cursor: pointer;
            border-bottom: 1px solid #f0f0f0;
            display: flex;
            align-items: center;
            gap: 10px;
        " onclick="selectSuggestion('${product.name}')">
            <img src="${product.image || (product.images && product.images.length > 0 ? product.images[0] : '')}" alt="${product.name}" style="width: 40px; height: 40px; object-fit: cover; border-radius: 4px;">
            <div>
                <div style="font-weight: bold; font-size: 14px;">${product.name}</div>
                <div style="color: #666; font-size: 12px;">$${product.price}</div>
            </div>
        </div>
    `).join('');

    suggestionsContainer.innerHTML = suggestions;
    suggestionsContainer.style.display = 'block';
}

// Hide search suggestions
function hideSearchSuggestions() {
    const suggestionsContainer = document.getElementById('searchSuggestions');
    if (suggestionsContainer) {
        suggestionsContainer.style.display = 'none';
    }
}

// Select suggestion
function selectSuggestion(productName) {
    const searchInput = document.getElementById('searchInput');
    searchInput.value = productName;
    hideSearchSuggestions();
    searchProducts();
}

// Hide suggestions when clicking outside
document.addEventListener('click', function (e) {
    if (!e.target.closest('.search-container')) {
        hideSearchSuggestions();
    }
});

function displayTrendingSlides(trendingProducts) {
    console.log('displayTrendingSlides called with:', trendingProducts);

    const slidesContainer = document.getElementById('slideshowContainer');
    const indicatorsContainer = document.getElementById('slideshowIndicators');

    console.log('Slideshow containers:', { slidesContainer, indicatorsContainer });

    if (!slidesContainer || !indicatorsContainer) {
        console.error('Slideshow containers not found');
        return;
    }

    slidesContainer.innerHTML = '';
    indicatorsContainer.innerHTML = '';

    if (!trendingProducts || trendingProducts.length === 0) {
        console.warn('No trending products to display');
        slidesContainer.innerHTML = '<div style="height: 450px; display: flex; align-items: center; justify-content: center; background: #f0f0f0; color: #666; border-radius: 20px;"><p>No trending products available. Add products in Admin Panel.</p></div>';
        return;
    }

    console.log('Creating product slideshow with', trendingProducts.length, 'products:', trendingProducts);

    trendingProducts.forEach((product, index) => {
        console.log('Adding product slide', index + 1, ':', product.name);

        // Get the first image of the product
        const productImage = product.images && product.images.length > 0 ? product.images[0] : product.image;

        // Create slide
        const slideDiv = document.createElement('div');
        slideDiv.className = `slideshow-slide ${index === 0 ? 'active' : ''}`;
        slideDiv.innerHTML = `
            <img src="${productImage}" alt="${product.name}" 
                 onerror="this.src='https://via.placeholder.com/1200x450?text=Product+Image+Not+Found'"
                 onload="console.log('Product slide ${index + 1} image loaded successfully')">
            <div class="slide-overlay">
                <h3>${product.name}</h3>
                <p>${product.shortDescription || product.description}</p>
                <div class="slide-price">
                    ${product.discount && product.discount > 0 ?
                `<span class="original-price">$${product.price.toFixed(2)}</span>
                         <span class="sale-price">$${(product.price * (1 - product.discount / 100)).toFixed(2)}</span>
                         <span class="discount-badge">-${product.discount}%</span>` :
                `<span class="price">$${product.price.toFixed(2)}</span>`
            }
                </div>
                <button class="slide-shop-btn" onclick="addToCart(${product.id})">
                    <i class="fas fa-shopping-cart"></i> Add to Cart
                </button>
            </div>
        `;
        slidesContainer.appendChild(slideDiv);

        // Create indicator
        const indicator = document.createElement('button');
        indicator.className = `slideshow-indicator ${index === 0 ? 'active' : ''}`;
        indicator.onclick = () => goToSlide(index);
        indicatorsContainer.appendChild(indicator);
    });

    console.log('✓ Product slideshow displayed successfully with', slidesContainer.children.length, 'slides');

    // Force visibility of slideshow
    const slideshowElement = document.querySelector('.trending-slideshow');
    if (slideshowElement) {
        slideshowElement.style.display = 'block';
        slideshowElement.style.visibility = 'visible';
        slideshowElement.style.opacity = '1';
        console.log('Forced slideshow visibility');
    }
}

function changeSlide(direction) {
    const slides = document.querySelectorAll('.slideshow-slide');
    const indicators = document.querySelectorAll('.slideshow-indicator');

    if (slides.length === 0) return;

    // Remove active class from current slide
    slides[currentSlide].classList.remove('active');
    if (indicators[currentSlide]) indicators[currentSlide].classList.remove('active');

    // Calculate new slide index
    currentSlide += direction;
    if (currentSlide >= slides.length) currentSlide = 0;
    if (currentSlide < 0) currentSlide = slides.length - 1;

    // Add active class to new slide
    slides[currentSlide].classList.add('active');
    if (indicators[currentSlide]) indicators[currentSlide].classList.add('active');
}

function goToSlide(index) {
    const slides = document.querySelectorAll('.slideshow-slide');
    const indicators = document.querySelectorAll('.slideshow-indicator');

    if (slides.length === 0) return;

    // Remove active class from current slide
    slides[currentSlide].classList.remove('active');
    if (indicators[currentSlide]) indicators[currentSlide].classList.remove('active');

    // Set new slide
    currentSlide = index;

    // Add active class to new slide
    slides[currentSlide].classList.add('active');
    if (indicators[currentSlide]) indicators[currentSlide].classList.add('active');
}

function startCarousel() {
    setInterval(() => {
        changeSlide(1);
    }, 1000); // Change slide every 1 second
}

// Currency conversion functions
function convertCurrency(amount, fromCurrency = 'USD', toCurrency = currentCurrency) {
    if (fromCurrency === toCurrency) return amount;

    // Convert to USD first, then to target currency
    const usdAmount = amount / currencyRates[fromCurrency];
    return usdAmount * currencyRates[toCurrency];
}

function formatCurrency(amount, currency = currentCurrency) {
    const convertedAmount = convertCurrency(amount, 'USD', currency);
    const symbol = currencySymbols[currency];

    if (currency === 'RWF') {
        return `${symbol}${Math.round(convertedAmount).toLocaleString()}`;
    } else {
        return `${symbol}${convertedAmount.toFixed(2)}`;
    }
}

function changeCurrency() {
    const currencySelect = document.getElementById('currencySelect');
    if (currencySelect) {
        currentCurrency = currencySelect.value;
        updateCartDisplay();
        updateCurrencyAmounts();
        updateCurrencyToggle();
        // Update all prices on the website
        updateAllPricesOnWebsite();
    }
}

function updateCurrencyAmounts() {
    const currencyAmountsContainer = document.getElementById('currencyAmounts');
    if (!currencyAmountsContainer) return;

    const subtotal = cart.reduce((sum, item) => {
        const product = products.find(p => p.id === item.id);
        return sum + (product ? product.price * item.quantity : 0);
    }, 0);

    const tax = subtotal * 0.05;
    const total = subtotal + tax;

    const currencies = ['USD', 'RWF', 'EUR', 'GBP'];

    currencyAmountsContainer.innerHTML = currencies.map(currency => {
        const convertedTotal = convertCurrency(total, 'USD', currency);
        const symbol = currencySymbols[currency];
        const formattedAmount = currency === 'RWF'
            ? `${symbol}${Math.round(convertedTotal).toLocaleString()}`
            : `${symbol}${convertedTotal.toFixed(2)}`;

        return `
            <div class="currency-amount ${currency === currentCurrency ? 'selected' : ''}" 
                 onclick="selectCurrency('${currency}')">
                <span class="currency-code">${currency}</span>
                <span class="currency-value">${formattedAmount}</span>
            </div>
        `;
    }).join('');
}

function selectCurrency(currency) {
    currentCurrency = currency;
    const currencySelect = document.getElementById('currencySelect');
    if (currencySelect) {
        currencySelect.value = currency;
    }
    updateCartDisplay();
    updateCurrencyAmounts();
    updateCurrencyToggle();
    // Update all prices on the website
    updateAllPricesOnWebsite();
}

// Currency toggle functions
function toggleCurrency() {
    const dropdown = document.getElementById('currencyDropdown');
    const button = document.getElementById('currencyToggleBtn');

    if (dropdown) {
        // Close other dropdowns first
        document.querySelectorAll('.currency-dropdown.show').forEach(dd => {
            if (dd !== dropdown) {
                dd.classList.remove('show');
            }
        });

        dropdown.classList.toggle('show');

        // For mobile, ensure dropdown is visible
        if (dropdown.classList.contains('show')) {
            // Force a reflow to ensure the dropdown is rendered
            dropdown.offsetHeight;

            // Scroll into view if needed
            dropdown.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    }

    // Add click animation
    if (button) {
        button.style.transform = 'scale(0.95)';
        setTimeout(() => {
            button.style.transform = '';
        }, 150);
    }
}

function selectCurrencyFromDropdown(currency) {
    selectCurrency(currency);
    const dropdown = document.getElementById('currencyDropdown');
    if (dropdown) {
        dropdown.classList.remove('show');
    }
}

// Add touch event support for mobile currency dropdown
function setupCurrencyMobileSupport() {
    const currencyBtn = document.getElementById('currencyToggleBtn');
    const currencyDropdown = document.getElementById('currencyDropdown');

    if (currencyBtn && currencyDropdown) {
        // Add touch event listeners for better mobile support
        currencyBtn.addEventListener('touchstart', (e) => {
            e.preventDefault();
            e.stopPropagation();
        });

        currencyBtn.addEventListener('touchend', (e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleCurrency();
        });

        // Prevent dropdown from closing when touching inside it
        currencyDropdown.addEventListener('touchstart', (e) => {
            e.stopPropagation();
        });

        currencyDropdown.addEventListener('touchend', (e) => {
            e.stopPropagation();
        });

        // Close dropdown when touching outside
        document.addEventListener('touchstart', (e) => {
            if (!currencyBtn.contains(e.target) && !currencyDropdown.contains(e.target)) {
                currencyDropdown.classList.remove('show');
            }
        });
    }
}

function updateCurrencyToggle() {
    const toggleBtn = document.getElementById('currencyToggleBtn');
    const toggleText = document.getElementById('currencyToggleText');
    const currencyIcons = {
        'USD': 'fas fa-dollar-sign',
        'RWF': 'fas fa-coins',
        'EUR': 'fas fa-euro-sign',
        'GBP': 'fas fa-pound-sign'
    };

    if (toggleBtn && toggleText) {
        const icon = toggleBtn.querySelector('i');
        if (icon) {
            icon.className = currencyIcons[currentCurrency] || 'fas fa-dollar-sign';
        }
        toggleText.textContent = currentCurrency;
    }

    // Update dropdown selection
    const currencyOptions = document.querySelectorAll('.currency-option');
    currencyOptions.forEach(option => {
        option.classList.remove('selected');
        const currencyText = option.textContent.trim();
        if (currencyText.includes(currentCurrency)) {
            option.classList.add('selected');
        }
    });
}

// Update all prices on the website when currency changes
function updateAllPricesOnWebsite() {
    // Update product prices in the main products section
    displayProducts();

    // Update cart display (this will also update cart summary)
    updateCartDisplay();

    // Update currency amounts in checkout if modal is open
    updateCurrencyAmounts();

    // Show notification about currency change
    showNotification(`💰 All prices now displayed in ${currentCurrency}`, 'success');
}

// Cart functionality
let cart = [];

// Load cart from localStorage
function loadCartFromStorage() {
    const storedCart = localStorage.getItem('wonderElectronicsCart');
    if (storedCart) {
        cart = JSON.parse(storedCart);
    }
}

// Save cart to localStorage
function saveCartToStorage() {
    localStorage.setItem('wonderElectronicsCart', JSON.stringify(cart));
}

// Update cart display
function updateCartDisplay() {
    loadCartFromStorage();
    updateCartCount();
    displayCartItems();
    updateCartSummary();
}

// Update cart count in navigation
function updateCartCount() {
    const cartCount = document.getElementById('cartCount');
    if (cartCount) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
    }
}

// Display cart items
function displayCartItems() {
    const cartItemsContainer = document.getElementById('cartItems');
    if (!cartItemsContainer) return;

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-shopping-cart"></i>
                <h3>Your cart is empty</h3>
                <p>Add some products to get started!</p>
                <a href="#products" class="btn btn-primary" onclick="closeCart()">Continue Shopping</a>
            </div>
        `;
        return;
    }

    cartItemsContainer.innerHTML = cart.map(item => {
        const product = products.find(p => p.id === item.id);
        if (!product) return '';

        return `
            <div class="cart-item" data-id="${item.id}">
                <div class="cart-item-image">
                    ${(product.image || (product.images && product.images.length > 0 ? product.images[0] : '')) ?
                `<img src="${product.image || (product.images && product.images.length > 0 ? product.images[0] : '')}" alt="${product.name}" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                         <div style="display: none; align-items: center; justify-content: center; width: 100%; height: 100%; font-size: 2rem; color: #6c757d;">
                             <i class="fas fa-mobile-alt"></i>
                         </div>` :
                `<div style="display: flex; align-items: center; justify-content: center; width: 100%; height: 100%; font-size: 2rem; color: #6c757d;">
                             <i class="fas fa-mobile-alt"></i>
                         </div>`
            }
                </div>
                <div class="cart-item-details">
                    <div class="cart-item-name">${product.name}</div>
                    ${item.color ? `<div style="font-size: 0.85rem; color: #6c757d; margin-top: 0.25rem;"><i class="fas fa-palette"></i> Color: ${item.color}</div>` : ''}
                    ${(product.discount && product.discount > 0) ? `
                        <div class="cart-item-discount">${product.discount}% OFF</div>
                        <div class="cart-item-price">
                            <span style="text-decoration: line-through; color: #999; font-size: 0.9rem;">${formatCurrency(product.price)}</span>
                            <span style="color: #e74c3c; font-weight: 700;">${formatCurrency(product.price * (1 - product.discount / 100))}</span> each
                        </div>
                    ` : `
                        <div class="cart-item-price">${formatCurrency(product.price)} each</div>
                    `}
                </div>
                <div class="cart-item-controls">
                    <div class="quantity-controls">
                        <button class="quantity-btn" onclick="updateQuantity(${item.id}, ${item.quantity - 1})">-</button>
                        <input type="number" class="quantity-input" value="${item.quantity}" min="1" max="${product.stock}" onchange="updateQuantity(${item.id}, parseInt(this.value))">
                        <button class="quantity-btn" onclick="updateQuantity(${item.id}, ${item.quantity + 1})">+</button>
                    </div>
                    <button class="remove-item" onclick="removeFromCart(${item.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

// Update cart summary
function updateCartSummary() {
    const total = cart.reduce((sum, item) => {
        const product = products.find(p => p.id === item.id);
        if (!product) return sum;

        // Calculate price with discount
        const discount = product.discount || 0;
        const finalPrice = product.price * (1 - discount / 100);
        return sum + (finalPrice * item.quantity);
    }, 0);

    document.getElementById('cartTotal').textContent = formatCurrency(total);
}

// Update quantity
function updateQuantity(productId, newQuantity) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    if (newQuantity <= 0) {
        removeFromCart(productId);
        return;
    }

    if (newQuantity > product.stock) {
        showNotification(`Only ${product.stock} items available in stock`, 'error');
        return;
    }

    const cartItem = cart.find(item => item.id === productId);
    if (cartItem) {
        cartItem.quantity = newQuantity;
        saveCartToStorage();
        updateCartDisplay();
    }
}

// Remove from cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCartToStorage();
    updateCartDisplay();
    showNotification('Item removed from cart', 'info');
}

// Open cart
function openCart() {
    updateCartDisplay();
    document.getElementById('cart').scrollIntoView({ behavior: 'smooth' });
}

// Close cart
function closeCart() {
    document.getElementById('products').scrollIntoView({ behavior: 'smooth' });
}

// Proceed to checkout
function proceedToCheckout() {
    if (cart.length === 0) {
        showNotification('Your cart is empty', 'error');
        return;
    }

    if (!currentUser) {
        showNotification('Please login to proceed with payment', 'error');
        openLoginModal();
        return;
    }

    const modal = document.getElementById('checkoutModal');
    if (modal) {
        displayCheckoutItems();
        updateCurrencyAmounts();
        modal.style.display = 'block';
    }
}

// Display checkout items
function displayCheckoutItems() {
    const checkoutItemsContainer = document.getElementById('checkoutItems');
    const checkoutTotalElement = document.getElementById('checkoutTotal');

    if (!checkoutItemsContainer || !checkoutTotalElement) return;

    const subtotal = cart.reduce((sum, item) => {
        const product = products.find(p => p.id === item.id);
        return sum + (product ? product.price * item.quantity : 0);
    }, 0);

    const tax = subtotal * 0.05;
    const total = subtotal + tax;

    checkoutItemsContainer.innerHTML = cart.map(item => {
        const product = products.find(p => p.id === item.id);
        if (!product) return '';

        return `
            <div class="checkout-item">
                <span>${product.name} x${item.quantity}</span>
                <span>${formatCurrency(product.price * item.quantity)}</span>
            </div>
        `;
    }).join('');

    checkoutTotalElement.textContent = formatCurrency(total);
}

// Close checkout modal
function closeCheckoutModal() {
    const modal = document.getElementById('checkoutModal');
    if (modal) {
        modal.style.display = 'none';
        // Clear form
        document.getElementById('customerName').value = '';
        document.getElementById('customerPhone').value = '';
        document.getElementById('customerAddress').value = '';
        document.getElementById('paymentReference').value = '';
    }
}

// Copy phone number
function copyPhoneNumber() {
    const phoneNumber = '+250787070049';
    navigator.clipboard.writeText(phoneNumber).then(() => {
        showNotification('Phone number copied to clipboard!', 'success');
    }).catch(() => {
        showNotification('Failed to copy phone number', 'error');
    });
}

// Place order
function placeOrder() {
    const customerName = document.getElementById('customerName').value;
    const customerPhone = document.getElementById('customerPhone').value;
    const customerAddress = document.getElementById('customerAddress').value;
    const paymentReference = document.getElementById('paymentReference').value;

    if (!customerName || !customerPhone || !customerAddress || !paymentReference) {
        showNotification('Please fill in all required fields', 'error');
        return;
    }

    // Create order
    const order = {
        id: Date.now(),
        customerName,
        customerPhone,
        customerAddress,
        paymentReference,
        items: [...cart],
        subtotal: cart.reduce((sum, item) => {
            const product = products.find(p => p.id === item.id);
            return sum + (product ? product.price * item.quantity : 0);
        }, 0),
        tax: cart.reduce((sum, item) => {
            const product = products.find(p => p.id === item.id);
            return sum + (product ? product.price * item.quantity : 0);
        }, 0) * 0.05,
        total: cart.reduce((sum, item) => {
            const product = products.find(p => p.id === item.id);
            return sum + (product ? product.price * item.quantity : 0);
        }, 0) * 1.05,
        status: 'pending',
        orderDate: new Date().toISOString()
    };

    // Save order to localStorage
    const orders = JSON.parse(localStorage.getItem('wonderElectronicsOrders') || '[]');
    orders.push(order);
    localStorage.setItem('wonderElectronicsOrders', JSON.stringify(orders));

    // Clear cart
    cart = [];
    saveCartToStorage();
    updateCartDisplay();

    // Close modal
    closeCheckoutModal();

    // Show success message
    showNotification(`Order placed successfully! Order #${order.id}`, 'success');
}

// Display products on the page
function displayProducts(filterCategory = 'all') {
    const productsGrid = document.getElementById('productsGrid');
    if (!productsGrid) {
        return;
    }

    let filteredProducts = filterCategory === 'all'
        ? products
        : products.filter(product => product.category === filterCategory);

    // Sort products by position: numbers first (ascending), then categories, then no position
    filteredProducts.sort((a, b) => {
        // If both have positions
        if (a.position !== undefined && b.position !== undefined) {
            // If both are numbers, sort numerically
            if (typeof a.position === 'number' && typeof b.position === 'number') {
                return a.position - b.position;
            }
            // If both are strings, sort by category order
            if (typeof a.position === 'string' && typeof b.position === 'string') {
                const order = { 'top': 1, 'middle': 2, 'bottom': 3 };
                return (order[a.position] || 2) - (order[b.position] || 2);
            }
            // Mixed types: numbers first, then strings
            if (typeof a.position === 'number') return -1;
            if (typeof b.position === 'number') return 1;
            return 0;
        }
        // If only one has position, prioritize it
        if (a.position !== undefined && b.position === undefined) return -1;
        if (a.position === undefined && b.position !== undefined) return 1;
        // If neither has position, maintain original order
        return 0;
    });

    productsGrid.innerHTML = '';

    if (filteredProducts.length === 0) {
        productsGrid.innerHTML = '<p style="text-align: center; grid-column: 1/-1; padding: 2rem;">No products found in this category.</p>';
        return;
    }

    filteredProducts.forEach((product, index) => {
        const productCard = createProductCard(product);
        productsGrid.appendChild(productCard);
    });
}

// Create a product card element
function createProductCard(product) {
    // Use main image if available, otherwise use first additional image
    const displayImage = product.image || (product.images && product.images.length > 0 ? product.images[0] : null);

    console.log('Creating product card for:', product.name);
    console.log('Main image:', product.image);
    console.log('Main image length:', product.image ? product.image.length : 0);
    console.log('Main image starts with data:', product.image ? product.image.startsWith('data:') : false);
    console.log('Additional images:', product.images);
    console.log('Additional images length:', product.images ? product.images.length : 0);
    console.log('Display image:', displayImage);
    console.log('Display image length:', displayImage ? displayImage.length : 0);
    console.log('Display image starts with data:', displayImage ? displayImage.startsWith('data:') : false);

    // Test if the image can be loaded
    if (displayImage) {
        const testImg = document.createElement('img');
        testImg.src = displayImage;
        testImg.onload = function () {
            console.log('Client: Display image loaded successfully for', product.name);
        };
        testImg.onerror = function () {
            console.log('Client: Display image failed to load for', product.name);
        };
    }

    const card = document.createElement('div');
    card.className = 'product-card';
    card.style.cursor = 'pointer';
    card.onclick = (e) => {
        // Don't open modal if clicking the add to cart button
        if (!e.target.closest('.add-to-cart')) {
            openProductDetail(product.id);
        }
    };
    card.innerHTML = `
        <div class="product-image">
            ${displayImage ? `<img src="${displayImage}" alt="${product.name}" style="width: 100%; height: 100%; object-fit: cover;" onload="console.log('Image loaded successfully for:', '${product.name}');" onerror="console.log('Image failed to load for product:', '${product.name}'); this.style.display='none'; this.nextElementSibling.style.display='flex';">
                <div style="display: none; align-items: center; justify-content: center; width: 100%; height: 100%; font-size: 4rem; color: #6c757d;">
                    <i class="fas fa-mobile-alt"></i>
                </div>` :
            `<div style="display: flex; align-items: center; justify-content: center; width: 100%; height: 100%; font-size: 4rem; color: #6c757d;">
                    <i class="fas fa-mobile-alt"></i>
                </div>`
        }
        </div>
        <div class="product-info">
            <div class="product-header">
                <div class="product-category">${product.category}</div>
                ${product.condition ? `<span class="product-condition-badge ${product.condition === 'N' ? 'new' : 'used'}">${product.condition === 'N' ? 'NEW' : 'USED'}</span>` : ''}
            </div>
            <h3 class="product-name">${product.name}</h3>
            <p class="product-description">${product.shortDescription || product.description}</p>
            <div class="product-brand">Brand: ${product.brand}</div>
            ${(product.discount && product.discount > 0) ? `
                <div class="product-discount-badge">${product.discount}% OFF</div>
                <div class="product-price">
                    <span class="original-price">${formatCurrency(product.price)}</span>
                    <span class="sale-price">${formatCurrency(product.price * (1 - product.discount / 100))}</span>
                </div>
            ` : `
                <div class="product-price">${formatCurrency(product.price)}</div>
            `}
            ${shouldShowStock() ? `
                <div style="margin-bottom: 1rem; font-size: 0.9rem; color: #6c757d;">
                    Stock: ${product.stock} units
                </div>
            ` : ''}
            <div class="product-actions">
                ${product.specifications && product.specifications.length > 0 ? `
                    <button class="btn btn-outline specs-btn" onclick="showProductSpecifications(${product.id})">
                        <i class="fas fa-list"></i> Specifications
                    </button>
                ` : ''}
                <button class="add-to-cart" onclick="addToCart(${product.id})">
                    <i class="fas fa-shopping-cart"></i> Add to Cart
                </button>
            </div>
        </div>
    `;
    return card;
}

// Mobile menu toggle function
function toggleMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    if (hamburger && navMenu) {
        // Simple toggle - if menu is open, close it; if closed, open it
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    }
}

// Close mobile menu function
function closeMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    if (hamburger && navMenu) {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    }
}

// Global functions for HTML onclick
window.toggleMobileMenu = toggleMobileMenu;
window.closeMobileMenu = closeMobileMenu;

// Hero Slideshow Functionality
let heroSlideshowInterval = null;
let currentSlideIndex = 0;

function initHeroSlideshow() {
    console.log('Initializing hero slideshow...');
    const slideshowData = localStorage.getItem('heroSlideshowData');
    console.log('Slideshow data from localStorage:', slideshowData);

    if (slideshowData) {
        const data = JSON.parse(slideshowData);
        console.log('Parsed slideshow data:', data);

        if (data.enabled && data.slides && data.slides.length > 0) {
            console.log('Starting slideshow with', data.slides.length, 'slides');
            startHeroSlideshow(data);
        } else {
            console.log('Slideshow disabled or no slides, stopping slideshow');
            stopHeroSlideshow();
        }
    } else {
        console.log('No slideshow data found, stopping slideshow');
        stopHeroSlideshow();
    }
}

function startHeroSlideshow(data) {
    console.log('Starting hero slideshow...');
    stopHeroSlideshow(); // Stop any existing slideshow

    if (data.slides.length === 0) {
        console.log('No slides to display');
        return;
    }

    const titleElement = document.getElementById('heroImageTitle');
    const messageElement = document.getElementById('heroImageMessage');

    console.log('Title element:', titleElement);
    console.log('Message element:', messageElement);

    if (!titleElement || !messageElement) {
        console.error('Hero elements not found!');
        return;
    }

    console.log('Showing first slide:', data.slides[0]);
    // Show first slide immediately
    showSlide(data.slides[0], titleElement, messageElement);

    // Start slideshow interval
    console.log('Starting slideshow interval:', data.interval, 'seconds');
    heroSlideshowInterval = setInterval(() => {
        currentSlideIndex = (currentSlideIndex + 1) % data.slides.length;
        console.log('Showing slide', currentSlideIndex + 1, ':', data.slides[currentSlideIndex]);
        showSlide(data.slides[currentSlideIndex], titleElement, messageElement);
    }, data.interval * 1000);
}

function showSlide(slide, titleElement, messageElement) {
    // Add fade effect
    titleElement.style.transition = 'opacity 0.5s ease';
    messageElement.style.transition = 'opacity 0.5s ease';

    titleElement.style.opacity = '0';
    messageElement.style.opacity = '0';

    setTimeout(() => {
        titleElement.textContent = slide.title;
        messageElement.textContent = slide.message;

        titleElement.style.opacity = '1';
        messageElement.style.opacity = '1';
    }, 250);
}

function stopHeroSlideshow() {
    if (heroSlideshowInterval) {
        clearInterval(heroSlideshowInterval);
        heroSlideshowInterval = null;
    }
    currentSlideIndex = 0;
}

// Listen for slideshow updates from admin
window.addEventListener('heroSlideshowUpdated', () => {
    initHeroSlideshow();
});

// Test slideshow function
function testSlideshow() {
    console.log('Testing slideshow...');
    const slideshowData = localStorage.getItem('heroSlideshowData');
    console.log('Current slideshow data:', slideshowData);

    if (slideshowData) {
        const data = JSON.parse(slideshowData);
        console.log('Parsed data:', data);
        alert('Slideshow data found: ' + JSON.stringify(data, null, 2));
    } else {
        alert('No slideshow data found in localStorage');
    }

    initHeroSlideshow();
}

// Make test function globally accessible
window.testSlideshow = testSlideshow;

// Initialize slideshow on page load
document.addEventListener('DOMContentLoaded', () => {
    initHeroSlideshow();
    setupCurrencyMobileSupport();
});

// Setup event listeners
function setupEventListeners() {
    // Mobile menu toggle
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    if (hamburger && navMenu) {
        // Click event
        hamburger.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleMobileMenu();
        });

        // Touch event for better mobile support
        hamburger.addEventListener('touchend', (e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleMobileMenu();
        });

        // Touch start to prevent default behavior
        hamburger.addEventListener('touchstart', (e) => {
            e.preventDefault();
        });

        // Mouse down event for better responsiveness
        hamburger.addEventListener('mousedown', (e) => {
            e.preventDefault();
        });

        // Auto-close menu when clicking on nav links and buttons
        const navLinks = document.querySelectorAll('.nav-link');
        const navButtons = document.querySelectorAll('.nav-menu button, .nav-menu .currency-btn, .nav-menu .currency-option');

        [...navLinks, ...navButtons].forEach(element => {
            element.addEventListener('click', () => {
                closeMobileMenu();
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            // Only close if menu is open and click is outside both hamburger and menu
            if (navMenu.classList.contains('active') &&
                !hamburger.contains(e.target) &&
                !navMenu.contains(e.target)) {
                closeMobileMenu();
            }
        });
    }

    // Filter buttons
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            button.classList.add('active');

            // Filter products
            const category = button.getAttribute('data-category');
            displayProducts(category);
        });
    });

    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Login form submission
    const loginForm = document.getElementById('loginFormElement');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const email = formData.get('email');
            const password = formData.get('password');
            handleLogin(email, password);
        });
    }

    // Signup form submission
    const signupForm = document.getElementById('signupFormElement');
    if (signupForm) {
        signupForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const name = formData.get('name');
            const email = formData.get('email');
            const password = formData.get('password');
            const phone = formData.get('phone');
            handleSignup(name, email, password, phone);
        });
    }


    // Close modal when clicking outside
    const loginModal = document.getElementById('loginModal');
    if (loginModal) {
        loginModal.addEventListener('click', (e) => {
            if (e.target === loginModal) {
                closeLoginModal();
            }
        });
    }


    // Close currency dropdown when clicking outside
    document.addEventListener('click', (e) => {
        const currencyToggle = document.querySelector('.currency-toggle');
        const currencyDropdown = document.getElementById('currencyDropdown');

        if (currencyToggle && currencyDropdown && !currencyToggle.contains(e.target)) {
            currencyDropdown.classList.remove('show');
        }
    });
}

// Add to cart functionality
function addToCart(productId, selectedColor = null) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    if (product.stock <= 0) {
        showNotification('Sorry, this product is out of stock!', 'error');
        return;
    }

    // Load current cart
    loadCartFromStorage();

    // Check if product already exists in cart with same color
    const existingItem = cart.find(item => item.id === productId && item.color === selectedColor);

    if (existingItem) {
        if (existingItem.quantity < product.stock) {
            existingItem.quantity += 1;
        } else {
            showNotification('Cannot add more items. Stock limit reached!', 'error');
            return;
        }
    } else {
        const cartItem = {
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image || (product.images && product.images.length > 0 ? product.images[0] : ''),
            quantity: 1,
            discount: product.discount || 0
        };

        // Add color if selected
        if (selectedColor) {
            cartItem.color = selectedColor;
        }

        cart.push(cartItem);
    }

    // Save cart to localStorage
    saveCartToStorage();

    // Update cart display
    updateCartDisplay();

    // Show success message
    const colorMsg = selectedColor ? ` (${selectedColor})` : '';
    showNotification(`${product.name}${colorMsg} added to cart!`, 'success');
}

// Show notification
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#28a745' : type === 'error' ? '#dc3545' : '#17a2b8'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 5px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        font-weight: 500;
        max-width: 300px;
        animation: slideIn 0.3s ease;
    `;

    notification.textContent = message;

    // Add animation styles
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
    `;
    document.head.appendChild(style);

    document.body.appendChild(notification);

    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Search functionality
function searchProducts(query) {
    const searchTerm = query.toLowerCase();
    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm) ||
        product.description.toLowerCase().includes(searchTerm) ||
        product.brand.toLowerCase().includes(searchTerm) ||
        product.category.toLowerCase().includes(searchTerm)
    );

    const productsGrid = document.getElementById('productsGrid');
    if (!productsGrid) return;

    productsGrid.innerHTML = '';

    if (filteredProducts.length === 0) {
        productsGrid.innerHTML = '<p style="text-align: center; grid-column: 1/-1; padding: 2rem;">No products found matching your search.</p>';
        return;
    }

    filteredProducts.forEach(product => {
        const productCard = createProductCard(product);
        productsGrid.appendChild(productCard);
    });
}

// Category and Subcategory Filtering
let currentCategory = 'all';
let currentSubcategory = 'all';

function setupProductFilters() {
    console.log('Setting up product filters...');
    const categoryButtons = document.querySelectorAll('.category-btn');
    console.log('Found category buttons:', categoryButtons.length);

    categoryButtons.forEach(button => {
        button.addEventListener('click', function (e) {
            e.stopPropagation();

            const category = this.dataset.category;

            if (category === 'all') {
                // Handle "All Products" button
                closeAllDropdowns();
                removeActiveFromAllCategories();
                this.classList.add('active');
                currentCategory = 'all';
                currentSubcategory = 'all';
                filterProducts();
            } else {
                // Handle category buttons with dropdowns
                const dropdown = document.getElementById(`${category}-dropdown`);
                console.log(`Clicked ${category}, dropdown found:`, dropdown);

                if (!dropdown) {
                    console.log(`Dropdown not found for ${category}`);
                    return;
                }

                const isDropdownOpen = dropdown.classList.contains('show');
                console.log(`Dropdown is open:`, isDropdownOpen);

                // Close all other dropdowns
                closeAllDropdowns();

                if (!isDropdownOpen) {
                    // Open this dropdown
                    console.log(`Opening dropdown for ${category}`);
                    dropdown.classList.add('show');
                    this.classList.add('active');
                    currentCategory = category;
                    currentSubcategory = 'all';
                    filterProducts();
                } else {
                    // Close this dropdown
                    console.log(`Closing dropdown for ${category}`);
                    this.classList.remove('active');
                    currentCategory = 'all';
                    currentSubcategory = 'all';
                    filterProducts();
                }
            }
        });
    });

    // Add event listeners to dropdown items
    const dropdownItems = document.querySelectorAll('.subcategory-dropdown-item');
    dropdownItems.forEach(item => {
        item.addEventListener('click', function (e) {
            e.stopPropagation();

            // Remove active class from all items in this dropdown
            const parentDropdown = this.closest('.subcategory-dropdown');
            const allItems = parentDropdown.querySelectorAll('.subcategory-dropdown-item');
            allItems.forEach(dropdownItem => dropdownItem.classList.remove('active'));

            // Add active class to clicked item
            this.classList.add('active');

            // Update current subcategory
            currentSubcategory = this.dataset.subcategory;

            // Close dropdown
            parentDropdown.classList.remove('show');

            // Filter products
            filterProducts();
        });
    });

    // Close dropdowns when clicking outside
    document.addEventListener('click', function (e) {
        if (!e.target.closest('.category-dropdown-container')) {
            closeAllDropdowns();
        }
    });
}

function closeAllDropdowns() {
    const dropdowns = document.querySelectorAll('.subcategory-dropdown');
    const categoryButtons = document.querySelectorAll('.category-btn');

    dropdowns.forEach(dropdown => {
        dropdown.classList.remove('show');
    });

    categoryButtons.forEach(button => {
        if (button.dataset.category !== 'all') {
            button.classList.remove('active');
        }
    });
}

function removeActiveFromAllCategories() {
    const categoryButtons = document.querySelectorAll('.category-btn');
    categoryButtons.forEach(button => {
        button.classList.remove('active');
    });
}


function filterProducts() {
    let filteredProducts = products;

    // Filter by category
    if (currentCategory !== 'all') {
        filteredProducts = filteredProducts.filter(product => product.category === currentCategory);
    }

    // Filter by subcategory
    if (currentSubcategory !== 'all') {
        filteredProducts = filteredProducts.filter(product => product.subcategory === currentSubcategory);
    }

    // Display filtered products directly
    displayFilteredProducts(filteredProducts);
}

// Display filtered products
function displayFilteredProducts(filteredProducts) {
    const productsGrid = document.getElementById('productsGrid');
    if (!productsGrid) return;

    productsGrid.innerHTML = '';

    if (filteredProducts.length === 0) {
        productsGrid.innerHTML = '<p style="text-align: center; grid-column: 1/-1; padding: 2rem;">No products found in this category.</p>';
        return;
    }

    filteredProducts.forEach(product => {
        const productCard = createProductCard(product);
        productsGrid.appendChild(productCard);
    });
}

// Simple category selection function
function selectCategory(category) {
    console.log('Selected category:', category);

    // Remove active class from all buttons
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.classList.remove('active');
    });

    // Add active class to clicked button
    event.target.closest('.category-btn').classList.add('active');

    // Update current category
    currentCategory = category;
    currentSubcategory = 'all';

    // Show notification
    showNotification(`Selected category: ${category}`, 'success');

    if (category === 'all') {
        // Hide subcategory section
        console.log('Hiding subcategory section for all products');
        closeSubcategorySection();
    } else {
        // Show subcategory section
        console.log('Showing subcategory section for:', category);
        showSubcategories(category);
    }

    // Filter products
    filterProducts();
}

// Show subcategories for selected category
function showSubcategories(category) {
    console.log('showSubcategories called with:', category);

    const subcategorySection = document.getElementById('subcategorySection');
    const subcategoryTitle = document.getElementById('subcategoryTitle');
    const subcategoryOptions = document.getElementById('subcategoryOptions');

    if (!subcategorySection || !subcategoryTitle || !subcategoryOptions) {
        console.error('Subcategory elements not found!');
        return;
    }

    // Update title
    subcategoryTitle.textContent = `Choose ${category.charAt(0).toUpperCase() + category.slice(1)} Type`;

    // Define subcategories for each category with their specific functions
    const subcategories = {
        smartphones: [
            { name: 'All Smartphones', value: 'all', function: 'filterSmartphones' },
            { name: 'iPhone', value: 'iphone', function: 'filteriPhone' },
            { name: 'Samsung', value: 'samsung', function: 'filterSamsung' },
            { name: 'Google', value: 'google', function: 'filterGoogle' },
            { name: 'OnePlus', value: 'oneplus', function: 'filterOnePlus' }
        ],
        laptops: [
            { name: 'All Laptops', value: 'all', function: 'filterLaptops' },
            { name: 'MacBook', value: 'macbook', function: 'filterMacBook' },
            { name: 'Dell', value: 'dell', function: 'filterDell' },
            { name: 'HP', value: 'hp', function: 'filterHP' },
            { name: 'Lenovo', value: 'lenovo', function: 'filterLenovo' }
        ],
        audio: [
            { name: 'All Audio', value: 'all', function: 'filterAudio' },
            { name: 'AirPods', value: 'airpods', function: 'filterAirPods' },
            { name: 'Sony', value: 'sony', function: 'filterSony' },
            { name: 'Bose', value: 'bose', function: 'filterBose' },
            { name: 'JBL', value: 'jbl', function: 'filterJBL' }
        ],
        gaming: [
            { name: 'All Gaming', value: 'all', function: 'filterGaming' },
            { name: 'PlayStation', value: 'playstation', function: 'filterPlayStation' },
            { name: 'Xbox', value: 'xbox', function: 'filterXbox' },
            { name: 'Nintendo', value: 'nintendo', function: 'filterNintendo' },
            { name: 'Gaming PC', value: 'gaming pc', function: 'filterGamingPC' }
        ],
        accessories: [
            { name: 'All Accessories', value: 'all', function: 'filterAccessories' },
            { name: 'Phone Cases', value: 'phone cases', function: 'filterPhoneCases' },
            { name: 'Chargers', value: 'chargers', function: 'filterChargers' },
            { name: 'Cables', value: 'cables', function: 'filterCables' },
            { name: 'Power Banks', value: 'power banks', function: 'filterPowerBanks' }
        ]
    };

    // Create subcategory buttons with individual functions
    const options = subcategories[category] || [];
    console.log('Subcategory options for', category, ':', options);

    subcategoryOptions.innerHTML = options.map(option => {
        return `<button class="subcategory-btn" onclick="${option.function}('${option.value}')">${option.name}</button>`;
    }).join('');

    console.log('Subcategory buttons HTML created');

    // Show the section with animation
    subcategorySection.style.display = 'block';
    subcategorySection.style.opacity = '0';
    subcategorySection.style.transform = 'translateY(-20px)';

    // Add animation
    setTimeout(() => {
        subcategorySection.style.opacity = '1';
        subcategorySection.style.transform = 'translateY(0)';
    }, 10);
}

// Close subcategory section
function closeSubcategorySection() {
    const subcategorySection = document.getElementById('subcategorySection');
    subcategorySection.style.opacity = '0';
    subcategorySection.style.transform = 'translateY(-20px)';

    setTimeout(() => {
        subcategorySection.style.display = 'none';
    }, 300);
}

// Individual filter functions for each subcategory

// Smartphone filters
function filterSmartphones(value) {
    setActiveButton(event.target);
    currentCategory = 'smartphones';
    currentSubcategory = value;
    showNotification('Showing all smartphones', 'success');
    filterProducts();
}

function filteriPhone(value) {
    setActiveButton(event.target);
    currentCategory = 'smartphones';
    currentSubcategory = 'iphone';
    showNotification('Showing iPhone products', 'success');
    filterProducts();
}

function filterSamsung(value) {
    setActiveButton(event.target);
    currentCategory = 'smartphones';
    currentSubcategory = 'samsung';
    showNotification('Showing Samsung products', 'success');
    filterProducts();
}

function filterGoogle(value) {
    setActiveButton(event.target);
    currentCategory = 'smartphones';
    currentSubcategory = 'google';
    showNotification('Showing Google Pixel products', 'success');
    filterProducts();
}

function filterOnePlus(value) {
    setActiveButton(event.target);
    currentCategory = 'smartphones';
    currentSubcategory = 'oneplus';
    showNotification('Showing OnePlus products', 'success');
    filterProducts();
}

// Laptop filters
function filterLaptops(value) {
    setActiveButton(event.target);
    currentCategory = 'laptops';
    currentSubcategory = value;
    showNotification('Showing all laptops', 'success');
    filterProducts();
}

function filterMacBook(value) {
    setActiveButton(event.target);
    currentCategory = 'laptops';
    currentSubcategory = 'macbook';
    showNotification('Showing MacBook products', 'success');
    filterProducts();
}

function filterDell(value) {
    setActiveButton(event.target);
    currentCategory = 'laptops';
    currentSubcategory = 'dell';
    showNotification('Showing Dell products', 'success');
    filterProducts();
}

function filterHP(value) {
    setActiveButton(event.target);
    currentCategory = 'laptops';
    currentSubcategory = 'hp';
    showNotification('Showing HP products', 'success');
    filterProducts();
}

function filterLenovo(value) {
    setActiveButton(event.target);
    currentCategory = 'laptops';
    currentSubcategory = 'lenovo';
    showNotification('Showing Lenovo products', 'success');
    filterProducts();
}

// Audio filters
function filterAudio(value) {
    setActiveButton(event.target);
    currentCategory = 'audio';
    currentSubcategory = value;
    showNotification('Showing all audio products', 'success');
    filterProducts();
}

function filterAirPods(value) {
    setActiveButton(event.target);
    currentCategory = 'audio';
    currentSubcategory = 'airpods';
    showNotification('Showing AirPods products', 'success');
    filterProducts();
}

function filterSony(value) {
    setActiveButton(event.target);
    currentCategory = 'audio';
    currentSubcategory = 'sony';
    showNotification('Showing Sony audio products', 'success');
    filterProducts();
}

function filterBose(value) {
    setActiveButton(event.target);
    currentCategory = 'audio';
    currentSubcategory = 'bose';
    showNotification('Showing Bose products', 'success');
    filterProducts();
}

function filterJBL(value) {
    setActiveButton(event.target);
    currentCategory = 'audio';
    currentSubcategory = 'jbl';
    showNotification('Showing JBL products', 'success');
    filterProducts();
}

// Gaming filters
function filterGaming(value) {
    setActiveButton(event.target);
    currentCategory = 'gaming';
    currentSubcategory = value;
    showNotification('Showing all gaming products', 'success');
    filterProducts();
}

function filterPlayStation(value) {
    setActiveButton(event.target);
    currentCategory = 'gaming';
    currentSubcategory = 'playstation';
    showNotification('Showing PlayStation products', 'success');
    filterProducts();
}

function filterXbox(value) {
    setActiveButton(event.target);
    currentCategory = 'gaming';
    currentSubcategory = 'xbox';
    showNotification('Showing Xbox products', 'success');
    filterProducts();
}

function filterNintendo(value) {
    setActiveButton(event.target);
    currentCategory = 'gaming';
    currentSubcategory = 'nintendo';
    showNotification('Showing Nintendo products', 'success');
    filterProducts();
}

function filterGamingPC(value) {
    setActiveButton(event.target);
    currentCategory = 'gaming';
    currentSubcategory = 'gaming pc';
    showNotification('Showing Gaming PC products', 'success');
    filterProducts();
}

// Accessories filters
function filterAccessories(value) {
    setActiveButton(event.target);
    currentCategory = 'accessories';
    currentSubcategory = value;
    showNotification('Showing all accessories', 'success');
    filterProducts();
}

function filterPhoneCases(value) {
    setActiveButton(event.target);
    currentCategory = 'accessories';
    currentSubcategory = 'phone cases';
    showNotification('Showing phone cases', 'success');
    filterProducts();
}

function filterChargers(value) {
    setActiveButton(event.target);
    currentCategory = 'accessories';
    currentSubcategory = 'chargers';
    showNotification('Showing chargers', 'success');
    filterProducts();
}

function filterCables(value) {
    setActiveButton(event.target);
    currentCategory = 'accessories';
    currentSubcategory = 'cables';
    showNotification('Showing cables', 'success');
    filterProducts();
}

function filterPowerBanks(value) {
    setActiveButton(event.target);
    currentCategory = 'accessories';
    currentSubcategory = 'power banks';
    showNotification('Showing power banks', 'success');
    filterProducts();
}

// Helper function to set active button
function setActiveButton(button) {
    // Remove active class from all subcategory buttons
    document.querySelectorAll('.subcategory-btn').forEach(btn => {
        btn.classList.remove('active');
    });

    // Add active class to clicked button
    button.classList.add('active');
}

// Create example trending products for demonstration
function createExampleTrendingProducts() {
    const storedTrendingProducts = localStorage.getItem('wonderElectronicsTrendingProducts');

    // Only create examples if no trending products exist
    if (!storedTrendingProducts || storedTrendingProducts === '[]') {
        console.log('Creating example trending products for demonstration...');

        // Get some products from the main products array
        const allProducts = JSON.parse(localStorage.getItem('wonderElectronicsProducts')) || products;

        // Select 6 diverse products for trending
        const exampleTrendingProducts = [
            allProducts.find(p => p.name.includes('iPhone 15 Pro Max')) || allProducts[0],
            allProducts.find(p => p.name.includes('MacBook Pro')) || allProducts[1],
            allProducts.find(p => p.name.includes('AirPods Pro')) || allProducts[2],
            allProducts.find(p => p.name.includes('PlayStation 5')) || allProducts[3],
            allProducts.find(p => p.name.includes('Samsung Galaxy')) || allProducts[4],
            allProducts.find(p => p.name.includes('Dell XPS')) || allProducts[5]
        ].filter(product => product); // Remove any undefined products

        // Save example trending products
        localStorage.setItem('wonderElectronicsTrendingProducts', JSON.stringify(exampleTrendingProducts));
        console.log('Created', exampleTrendingProducts.length, 'example trending products');

        // Show notification to user
        setTimeout(() => {
            showNotification('Example trending products added! Check the slideshow above.', 'success');
        }, 1000);
    }
}


// Initialize page
document.addEventListener('DOMContentLoaded', function () {
    // Add search functionality if search input exists
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            searchProducts(e.target.value);
        });
    }
});
