const express = require("express");
const { body, param } = require("express-validator");
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");
const { protect } = require("../middleware/authMiddleware");
const { validateRequest } = require("../middleware/validationMiddleware");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

const router = express.Router();

const createProductValidation = [
  body("name").trim().notEmpty().withMessage("Product name is required"),
  body("description").trim().notEmpty().withMessage("Description is required"),
  body("price").isFloat({ min: 0 }).withMessage("Price must be a non-negative number"),
  body("category").trim().notEmpty().withMessage("Category is required"),
  body("stock").isInt({ min: 0 }).withMessage("Stock must be a non-negative integer"),
];

// Update validation uses optional() so partial payloads are accepted
const updateProductValidation = [
  body("name").optional().trim().notEmpty().withMessage("Product name cannot be empty"),
  body("description").optional().trim().notEmpty().withMessage("Description cannot be empty"),
  body("price").optional().isFloat({ min: 0 }).withMessage("Price must be a non-negative number"),
  body("category").optional().trim().notEmpty().withMessage("Category cannot be empty"),
  body("stock").optional().isInt({ min: 0 }).withMessage("Stock must be a non-negative integer"),
];

const productIdValidation = [
  param("id").isMongoId().withMessage("Valid product id is required"),
];

router
  .route("/")
  .get(getProducts)
  .post(
    protect,
    upload.single("image"),
    createProductValidation,
    validateRequest,
    createProduct,
  );

router
  .route("/:id")
  .get(productIdValidation, validateRequest, getProductById)
  .put(
    protect,
    upload.single("image"),
    productIdValidation,
    updateProductValidation,
    validateRequest,
    updateProduct,
  )
  .delete(protect, productIdValidation, validateRequest, deleteProduct);

module.exports = router;
