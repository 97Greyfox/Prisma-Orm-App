const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();                          

async function createCategory(req, res) {
  try {
    if (!req.body.name) {
      return res.status(400).json({ error: 'Name is required' });
    }

    if (await prisma.category.findUnique({ where: { name: req.body.name } })) {
      return res.status(409).json({ error: 'Category already exist' });
    }

    const { name } = req.body;
    const category = await prisma.category.create({
      data: {
        name,
      },
    });
    res.status(201).json(category);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
    
}

async function getCategories(req, res) {
  try {
    const categories = await prisma.category.findMany();
    res.status(200).json(categories);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });  
  }
  
}

async function updateCategory (req, res) {
  const categoryId = req.params.id;
  const categoryExist = await prisma.category.findUnique({ where: { id: parseInt(categoryId) } });
  if (!categoryExist) {
    return res.status(404).json({ error: 'Category not found' });
  }
  const { name } = req.body;
  if(!name) {
    return res.status(400).json({ error: 'Name is required' });
  }
  if (await prisma.category.findUnique({ where: { name } })) {
    return res.status(409).json({ error: 'Category already exist' });
  }
  try {
    const category = await prisma.category.update({
      where: { id: parseInt(categoryId) },
      data: {
        name,
      },
    });
    res.status(200).json(category);
  } catch (error) { 
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function deleteCategory(req, res) {
  const categoryId = req.params.id;
  const categoryExist = await prisma.category.findUnique({ where: { id: parseInt(categoryId) } });
  if (!categoryExist) {
    return res.status(404).json({ error: 'Category not found' });
  }

      const productCount = await prisma.product.count({
        where: {
            categoryId: parseInt(req.params.id)
        }
    })

    if (productCount) {
        return res.status(409).json({ error: `Category id is being used in ${productCount} product(s)` })
    }

  try {
    await prisma.category.delete({
      where: { id: parseInt(categoryId) },
    });
    res.status(204).end();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
}




module.exports = { createCategory, getCategories, updateCategory, deleteCategory };