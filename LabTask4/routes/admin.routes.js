const express = require("express");
const {
  dashboard,
  listProducts,
  addProductForm,
  createProduct,
  editProductForm,
  updateProduct,
  deleteProduct
} = require("../controllers/admin.controller");

const router = express.Router();

router.get("/", dashboard);
router.get("/products", listProducts);
router.get("/products/add", addProductForm);
router.post("/products/add", createProduct);
router.get("/products/edit/:id", editProductForm);
router.post("/products/edit/:id", updateProduct);
router.get("/products/delete/:id", deleteProduct);

module.exports = router;
