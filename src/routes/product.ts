import express from 'express'

import { createProduct } from '../controllers/product/create-product'
import { deleteProduct } from '../controllers/product/delete-product'
import { getProducts } from '../controllers/product/get-products'
import { getProductById } from '../controllers/product/get-product-by-id'
import { updateProduct } from '../controllers/product/update-product'

const router = express.Router()

router.get('/api/products', getProducts )

router.get('api/products/:id', getProductById)

router.post('/api/products', createProduct)

router.put('/api/products/:id', updateProduct)

router.delete('/api/products/:id', deleteProduct)


export {router as productRoutes};