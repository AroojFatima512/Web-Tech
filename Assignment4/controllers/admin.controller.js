const Product = require("../models/product.model");

// Dashboard
const dashboard = (req, res) => {
  res.render("admin/dashboard", { layout: "/layout" });
};

// READ – List Products
const listProducts = async (req, res) => {
  const products = await Product.find();
  res.render("admin/products", {
    layout: "/layout",
    products
  });
};

// CREATE – Form
const addProductForm = (req, res) => {
  res.render("admin/addProduct", { layout: "/layout" });
};

// CREATE – Save
const createProduct = async (req, res) => {
  await Product.create(req.body);
  res.redirect("/admin/products");
};

// UPDATE – Form
const editProductForm = async (req, res) => {
  const product = await Product.findById(req.params.id);
  res.render("admin/editProduct", {
    layout: "/layout",
    product
  });
};

// UPDATE – Save
const updateProduct = async (req, res) => {
  await Product.findByIdAndUpdate(req.params.id, req.body);
  res.redirect("/admin/products");
};

// DELETE
const deleteProduct = async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.redirect("/admin/products");
};

module.exports = {
  dashboard,
  listProducts,
  addProductForm,
  createProduct,
  editProductForm,
  updateProduct,
  deleteProduct
};
