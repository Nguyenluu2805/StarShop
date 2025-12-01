const express = require('express');
const { check } = require('express-validator');
const productController = require('../controllers/productController');
const { verifyToken } = require('../middlewares/authJwt');
const authorizeRoles = require('../middlewares/authorizeRoles');

const router = express.Router();

// Get all products (public)
router.get('/', productController.getAllProducts);

// Get product by ID (public)
router.get('/:id', productController.getProductById);

// Create a new product (Admin and Staff only)
router.post(
  '/',
  [verifyToken, authorizeRoles(['admin', 'staff']),
    check('name', 'Name is required').not().isEmpty(),
    check('category', 'Category is required').not().isEmpty(),
    check('price', 'Price must be a number').isFloat({ gt: 0 }),
    check('stock', 'Stock must be an integer').isInt({ gt: -1 }),
  ],
  productController.createProduct
);

// Update product by ID (Admin and Staff only)
router.put(
  '/:id',
  [verifyToken, authorizeRoles(['admin', 'staff']),
    check('name', 'Name is required').optional().not().isEmpty(),
    check('category', 'Category is required').optional().not().isEmpty(),
    check('price', 'Price must be a number').optional().isFloat({ gt: 0 }),
    check('stock', 'Stock must be an integer').optional().isInt({ gt: -1 }),
  ],
  productController.updateProduct
);

// Delete product by ID (Admin and Staff only)
router.delete(
  '/:id',
  [verifyToken, authorizeRoles(['admin', 'staff'])],
  productController.deleteProduct
);

module.exports = router;
