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

const productValidation = [
  body("name").trim().notEmpty().withMessage("Product name is required"),
  body("description").trim().notEmpty().withMessage("Description is required"),
  body("price").isFloat({ min: 0 }).withMessage("Price must be a number"),
  body("category").trim().notEmpty().withMessage("Category is required"),
  body("stock").isInt({ min: 0 }).withMessage("Stock must be a number"),
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
    productValidation,
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
    productValidation,
    validateRequest,
    updateProduct,
  )
  .delete(protect, productIdValidation, validateRequest, deleteProduct);

module.exports = router;
