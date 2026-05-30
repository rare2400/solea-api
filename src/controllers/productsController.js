import { errorHandler, notFound, badRequest } from '../utils/errorHandler.js'
import { parseId } from '../utils/parseId.js'
import { getCollection } from '../utils/getCollection.js'

// Get all products
export async function getAllProducts(request, reply) {
    try {
        const products = getCollection(request, "products")
        const result = await products.find().toArray()

        return reply.code(200).send(result)
    } catch (err) {
        return errorHandler(reply, err, "Failed to fetch products")
    }
}

// Get a product by ID
export async function getProductById(request, reply) {
    try {
        const { ObjectId } = request.server.mongo
        const products = getCollection(request, "products")
        const _id = parseId(ObjectId, request.params.id, reply)
        if (!_id) return

        const product = await products.findOne({ _id })
        if (!product) return notFound(reply, "Product not found")

        return reply.code(200).send(product)
    } catch (err) {
        return errorHandler(reply, err, "Failed to fetch product")
    }
}

// Get all unique product categories
export async function getCategories(request, reply) {
    try {
        const products = getCollection(request, "products")
        const categories = await products.distinct("category")

        return reply.code(200).send(categories)
    } catch (err) {
        return errorHandler(reply, err, "Failed to fetch categories")
    }
}

// POST a new product
export async function addProduct(request, reply) {
    try {
        const products = getCollection(request, "products")
        const { name, description, price, shelf, sku, stock, category } = request.body

        // Check if SKU already exists
        const existingProduct = await products.findOne({ sku })
        if (existingProduct) {
            return badRequest(reply, "SKU already exists")
        }

        const result = await products.insertOne({
            name,
            description,
            price,
            shelf,
            sku,
            stock,
            category,
            created_at: new Date()
        })

        return reply.code(201).send({ message: "Product added successfully", productId: result.insertedId })
    } catch (err) {
        return errorHandler(reply, err, "Failed to add product")
    }
}

// PUT update a product by ID
export async function updateProduct(request, reply) {
    try {
        const { ObjectId } = request.server.mongo
        const products = getCollection(request, "products")
        const _id = parseId(ObjectId, request.params.id, reply)
        if (!_id) return

        const result = await products.updateOne(
            { _id },
            { $set: { ...request.body, updated_at: new Date() } }
        )

        if (result.matchedCount === 0) return notFound(reply, "Product not found")

        return reply.code(200).send({ message: "Product updated successfully" })
    } catch (err) {
        return errorHandler(reply, err, "Failed to update product")
    }
}

// DELETE a product by ID
export async function deleteProduct(request, reply) {
    try {
        const { ObjectId } = request.server.mongo
        const products = getCollection(request, "products")
        const _id = parseId(ObjectId, request.params.id, reply)
        if (!_id) return

        const result = await products.deleteOne({ _id })

        if (result.deletedCount === 0) return notFound(reply, "Product not found")

        return reply.code(200).send({ message: "Product deleted successfully" })
    } catch (err) {
        return errorHandler(reply, err, "Failed to delete product")
    }
}

// PATCH Update stock
export async function updateStock(request, reply) {
    try {
        const { ObjectId } = request.server.mongo
        const products = getCollection(request, "products")
        const _id = parseId(ObjectId, request.params.id, reply)
        if (!_id) return

        const { stock } = request.body

        const product = await products.findOne({ _id })
        if (!product) return notFound(reply, "product not found")

        const newStock = product.stock + stock
        if (newStock < 0) return badRequest(reply, "Stock cannot be negative")

        await products.updateOne(
            { _id },
            { $set: { stock: newStock, updated_at: new Date() } }
        )

        return reply.code(200).send({ message: "Stock updated successfully", stock: newStock })
    } catch (err) {
        return errorHandler(reply, err, "Failed to update stock")
    }
}