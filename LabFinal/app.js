const mongoose = require("mongoose");
const Product = require("./models/product.model");
require("dotenv").config();

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const products = [
  {
    name: "Laptop",
    price: 1200,
    category: "Electronics",
    image: "laptop.jpg",
    description: "Powerful laptop"
  },
  {
    name: "Phone",
    price: 800,
    category: "Electronics",
    image: "phone.jpg",
    description: "Smart phone"
  },
  {
    name: "Shoes",
    price: 100,
    category: "Fashion",
    image: "shoes.jpg",
    description: "Running shoes"
  }
];

(async () => {
  await Product.insertMany(products);
  console.log("Sample Products Inserted");
  process.exit();
})();
