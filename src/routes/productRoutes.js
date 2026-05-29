import * as productController from '../controllers/productsController.js'
import { productSchema } from '../schemas/productSchema.js'

export default async function productRoutes(fastify) {

    // GET /products
    fastify.get("/", {
        preHandler: fastify.auth([fastify.verifyJWT]),
        handler: productController.getAllProducts
    })

    // GET /products/categories
    fastify.get("/categories", {
        preHandler: fastify.auth([fastify.verifyJWT]),
        handler: productController.getCategories
    })

    // GET /products/:id
    fastify.get("/:id", {
        preHandler: fastify.auth([fastify.verifyJWT]),
        handler: productController.getProductById
    })

    // POST /products
    fastify.post("/", {
        preHandler: fastify.auth([fastify.verifyJWT]),
        schema: { body: productSchema },
        handler: productController.addProduct
    })

    // PUT /products/:id
    fastify.put("/:id", {
        preHandler: fastify.auth([fastify.verifyJWT]),
        schema: { body: productSchema },
        handler: productController.updateProduct
    })

    // DELETE /products/:id
    fastify.delete("/:id", {
        preHandler: fastify.auth([fastify.verifyJWT]),
        handler: productController.deleteProduct
    })

    // PATCH /products/:id/stock
    fastify.patch("/:id/stock", {
        preHandler: fastify.auth([fastify.verifyJWT]),
        handler: productController.updateStock
    })
}