const router = require('express').Router();

const { createProduct, getProducts, updateProduct, getProductById, deleteProduct, getProductByCategoryId } = require('../controllers/productController');

router.post('/createproduct', createProduct);
router.get('/allproducts', getProducts);
router.get('/product/:id', getProductById);
router.put('/updateproduct/:id', updateProduct);
router.delete('/deleteproduct/:id', deleteProduct);
router.get('/productbycategory/:categoryId', getProductByCategoryId);


module.exports = router;