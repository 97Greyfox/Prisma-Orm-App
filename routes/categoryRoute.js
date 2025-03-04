const router = require('express').Router();

const  {createCategory, getCategories, updateCategory, deleteCategory} = require('../controllers/categoryController');

router.post('/createcategory', createCategory);
router.get('/getcategories', getCategories);
router.put('/updatecategory/:id', updateCategory);
router.delete('/deletecategory/:id', deleteCategory);

module.exports = router;