import * as categoryController from '../controllers/categoriesController.js';
import { categorySchema } from '../schemas/categorySchema.js';

export default async function categoryRoutes(fastify) {
    // Get all categories
    fastify.get("/categories", {
        preHandler: fastify.auth([fastify.verifyJWT]),
        schema: categorySchema,
        handler: categoryController.getCategories
    })

    // Get one category by ID
    fastify.get("/category/:id", {
        preHandler: fastify.auth([fastify.verifyJWT]),
        schema: categorySchema,
        handler: categoryController.getCategoryById
    })

    // Add a new category with validation
    fastify.post("/category", {
        preHandler: fastify.auth([fastify.verifyJWT]),
        schema: categorySchema,
        handler: categoryController.addCategory
    })

    // Update an existing category with validation
    fastify.put("/category/:id", {
        preHandler: fastify.auth([fastify.verifyJWT]),
        schema: categorySchema,
        handler: categoryController.updateCategory
    })

    // Delete a category by ID
    fastify.delete("/category/:id", {
        preHandler: fastify.auth([fastify.verifyJWT]),
        schema: categorySchema,
        handler: categoryController.deleteCategory
    });
}