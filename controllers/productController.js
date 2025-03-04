const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();  

async function createProduct(req, res) {
  try {
    if (!req.body.name || !req.body.price || !req.body.categoryId || (req.body.price <= 0)|| (typeof req.body.price !=='number')) {
      return res.status(400).json({ error: 'Name, price and categoryId are required' });
    }

    if (!await prisma.category.findUnique({ where: { id: parseInt(req.body.categoryId) } })) {
      return res.status(404).json({ error: 'Category not found' });
    }

    const newProduct = await prisma.product.create({
      data: req.body,
      include: {
        category: {
          select: {
            id: true,
            name: true,
          },
        }
      },
      omit : {
        categoryId : true
      }
    });
    console.log(newProduct);
    res.status(201).json(newProduct);
    } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
    }

 }

 async function getProducts(req, res) {
  try {
    const products = await prisma.product.findMany({
      include: {
        category: {
          select: {
            id: true,
            name: true,
          },
        }
      },
      omit : {
        categoryId : true
      }
    });
    res.status(200).json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function getProductById(req, res) {
  try {
    const product = await prisma.product.findUnique({
      where: { id: parseInt(req.params.id) },
      include: {
        category: {
          select: {
            id: true,
            name: true,
          },
        }
      },
      omit : {
        categoryId : true
      }
    });
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.status(200).json(product);
    
  } catch (error) {
   res.status(500).json({ error: 'Internal server error' });   
  }
}

async function updateProduct(req, res) {
  try {
    if (req.body.name !== undefined && req.body.name.trim() === '') {
        return res.status(422).json({ error: 'Name cannot be empty' })
    }

    if (req.body.price !== undefined && (typeof req.body.price !== 'number' || req.body.price < 0)) {
        return res.status(422).json({ error: 'Price must be a non-negative number' })
    }

    if (req.body.categoryId !== undefined && !await prisma.category.findUnique({ where: { id: req.body.categoryId } })) {
        return res.status(422).json({ error: 'Category id not found' })
    }

    const updatedProduct = await prisma.product.update({
        data: req.body,

        where: {
            id: parseInt(req.params.id)
        },

        include: {
            category: {
                select: {
                    id: true,
                    name: true
                }
            }
        },

        omit: {
            categoryId: true
        }              
    })

    return res.status(200).json(updatedProduct)
} catch (error) {
    if (error.code === 'P2025') {
        return res.status(404).json({ error: 'Product not found' })
    }

    return res.status(500).json({ error: error.message }) 
  }
  
}

async function deleteProduct(req, res){
  try {
      await prisma.product.delete({
          where: {
              id: parseInt(req.params.id)
          }
      })

      return res.status(204).send()
  } catch (error) {
      if (error.code === 'P2025') {
          return res.status(404).json({ error: 'Product not found' })
      }

      return res.status(500).json({ error: error.message })  
  }
}

async function getProductByCategoryId(req, res) {
  try {
    if (!await prisma.category.findUnique({ where: { id: parseInt(req.params.categoryId) } })) {
        return res.status(404).json({ error: 'Category id not found' })
    }

    const products = await prisma.product.findMany({
        where: {
            categoryId: parseInt(req.params.categoryId)
        },

        include: {
            category: {
                select: {
                    id: true,
                    name: true
                }
            }
        },

        omit: {
            categoryId: true
        },
        
        orderBy: {
            name: 'asc'
        }
    })

    return res.status(200).json(products)
} catch (error) {
    return res.status(500).json({ error: error.message })  
}
  
}

module.exports = { createProduct, getProducts, getProductById, updateProduct, deleteProduct, getProductByCategoryId };