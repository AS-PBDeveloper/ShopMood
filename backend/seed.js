const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
const User = require("./models/User");
const Product = require("./models/Product");
const connectDB = require("./config/db");

dotenv.config();

const importData = async () => {
  try {
    await connectDB();

    await User.deleteMany();
    await Product.deleteMany();

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash("password123", salt);

    const adminUser = await User.create({
      name: "Admin User",
      email: "admin@shopmood.com",
      password: hashedPassword,
      role: "admin",
    });

    const products = [
      // Original Catalog Products
      {
        name: "Wireless Noise-Cancelling Headphones",
        description:
          "Immersive sound experience with advanced active noise cancellation.",
        price: 299.99,
        category: "Electronics",
        stock: 15,
        imageUrl:
          "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
        ratings: 4.8,
        numReviews: 24,
      },
      {
        name: "Minimalist Modern Chair",
        description:
          "A stylish and comfortable addition to any contemporary living room.",
        price: 150.0,
        category: "Furniture",
        stock: 30,
        imageUrl:
          "https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
        ratings: 4.2,
        numReviews: 12,
      },
      {
        name: "Professional DSLR Camera",
        description:
          "Capture stunning moments with high-resolution clarity and speed.",
        price: 1199.99,
        category: "Electronics",
        stock: 8,
        imageUrl:
          "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
        ratings: 4.9,
        numReviews: 50,
      },
      {
        name: "Classic White Sneakers",
        description:
          "Versatile and comfortable, a staple for any casual outfit.",
        price: 85.0,
        category: "Clothing",
        stock: 50,
        imageUrl:
          "https://images.unsplash.com/photo-1542291026-7eec264c27ff?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
        ratings: 4.5,
        numReviews: 89,
      },

      // Newly Generated Products with Dedicated Assets
      {
        name: "Horizon Pro Smartwatch",
        description:
          "Next-gen AMOLED touchscreen with sapphire crystal glass, 24/7 heart rate and SpO2 tracking, GPS, and premium hand-stitched leather strap.",
        price: 249.99,
        category: "Electronics",
        stock: 25,
        imageUrl: "/images/products/smartwatch.jpg",
        ratings: 4.9,
        numReviews: 48,
      },
      {
        name: "KeyCraft Custom Mechanical Keyboard",
        description:
          "Wireless 75% mechanical keyboard featuring hot-swappable tactile switches, vintage two-tone PBT keycaps, per-key RGB backlighting, and acoustic silicone damping.",
        price: 159.0,
        category: "Electronics",
        stock: 18,
        imageUrl: "/images/products/keyboard.jpg",
        ratings: 4.8,
        numReviews: 36,
      },
      {
        name: "Heritage Artisan Leather Backpack",
        description:
          "Handcrafted full-grain saddle leather travel and tech rucksack with antique brass buckles, weather-resistant finish, and padded 16-inch laptop compartment.",
        price: 189.5,
        category: "Accessories",
        stock: 12,
        imageUrl: "/images/products/backpack.jpg",
        ratings: 4.7,
        numReviews: 29,
      },
      {
        name: "Aura Sound ANC Wireless Earbuds",
        description:
          "Audiophile-tuned true wireless earbuds with hybrid active noise cancellation, custom graphene drivers, ambient awareness mode, and 36-hour charging case.",
        price: 129.99,
        category: "Electronics",
        stock: 40,
        imageUrl: "/images/products/earbuds.jpg",
        ratings: 4.6,
        numReviews: 62,
      },
      {
        name: "StudioMaster Wireless ANC Headphones",
        description:
          "Over-ear studio monitor headphones with 45mm dynamic neodymium drivers, multi-device Bluetooth 5.3 pairing, memory foam ear cushions, and 50h battery.",
        price: 299.0,
        category: "Electronics",
        stock: 15,
        imageUrl: "/images/products/headphones.jpg",
        ratings: 4.9,
        numReviews: 54,
      },
      {
        name: "Aurora Velocity Running Sneakers",
        description:
          "Ultra-responsive performance running shoes engineered with high-rebound nitrogen-infused foam midsoles and breathable lightweight engineered knit mesh.",
        price: 119.99,
        category: "Footwear",
        stock: 35,
        imageUrl: "/images/products/sneakers.jpg",
        ratings: 4.7,
        numReviews: 41,
      },

      // AI-Generated Premium Apparel & Clothing Collection
      {
        name: "AeroForm Heavyweight Oversized Hoodie",
        description:
          "Engineered from 480 GSM organic French terry cotton with a dropped-shoulder relaxed streetwear drape, double-layered hood without drawstrings, and ribbed micro-stretch cuffs for ultimate daily warmth.",
        price: 89.99,
        category: "Clothing",
        stock: 45,
        imageUrl: "/images/products/hoodie.jpg",
        ratings: 4.8,
        numReviews: 38,
      },
      {
        name: "Belgrave Tailored Wool Trench Overcoat",
        description:
          "Masterfully tailored from an insulating 70/30 Italian wool-cashmere blend. Features structured notched lapels, a cinching waist tie-belt, tonal horn buttons, and deep storm-flap pockets for refined cold-weather layering.",
        price: 229.0,
        category: "Clothing",
        stock: 20,
        imageUrl: "/images/products/overcoat.jpg",
        ratings: 4.9,
        numReviews: 52,
      },
      {
        name: "Kuroki 14oz Japanese Selvedge Denim",
        description:
          "Crafted from raw vintage shuttle-loom selvedge denim woven in Okayama. Features distinctive redline selvedge ID, custom copper hardware, button fly, and a contemporary slim-tapered silhouette that ages uniquely with wear.",
        price: 145.0,
        category: "Clothing",
        stock: 30,
        imageUrl: "/images/products/jeans.jpg",
        ratings: 4.7,
        numReviews: 44,
      },
      {
        name: "Riviera Relaxed Linen Resort Shirt",
        description:
          "Woven from 100% Normandy flax linen with garment-dyed softness and natural breathability. Designed with a retro camp collar, mother-of-pearl buttons, and side-slit hem for relaxed coastal leisure.",
        price: 68.5,
        category: "Clothing",
        stock: 50,
        imageUrl: "/images/products/linen-shirt.jpg",
        ratings: 4.6,
        numReviews: 29,
      },
    ];

    await Product.insertMany(products);

    console.log("✅ Data Imported Successfully!");
    process.exit();
  } catch (error) {
    console.error(`❌ Error with data import: ${error.message}`);
    process.exit(1);
  }
};

importData();
