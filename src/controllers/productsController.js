// Get all products
export async function getAllProducts(request, reply) {
    try {
        const { db } = request.server.mongo

        const products = await db.collection("products").find().toArray()

        return reply.code(200).send(products)
    } catch (err) {
        request.log.error(err)
        return reply.code(500).send({ error: "An error occurred while fetching products" })
    }
}

// Get a product by ID
export async function getProductById(request, reply) {
    try {
        const { db, ObjectId } = request.server.mongo
        const { id } = request.params

        const product = await db.collection("products").findOne({ _id: new ObjectId(id) })
        if (!product) {
            return reply.code(404).send({ error: "Product not found" })
        }

        return reply.code(200).send(product)
    } catch (err) {
        request.log.error(err)
        return reply.code(500).send({ error: "An error occurred while fetching the product" })
    }
}

// Get all unique product categories
export async function getCategories(request, reply) {
    try {
        const { db } = request.server.mongo
        const categories = await db.collection("products").distinct("category")

        return reply.code(200).send(categories)

    } catch (err) {
        request.log.error(err)
        return reply.code(500).send({ error: "An error occurred while fetching categories" })
    }
}

// POST a new product
export async function addProduct(request, reply) {
    try {
        const { db } = request.server.mongo
        const { name, description, price, image_url, stock, category } = request.body

        // Insert the new product into the database
        const result = await db.collection("products").insertOne({
            name,
            description,
            price,
            image_url,
            stock,
            category,
            created_at: new Date()
        })

        return reply.code(201).send({ message: "Product added successfully", productId: result.insertedId })
    } catch (error) {
        request.log.error(error)
        return reply.code(500).send({ error: "An error occurred while adding the product" })
    }
}

// PUT update a product by ID
export async function updateProduct(request, reply) {
    try {
        const { db, ObjectId } = request.server.mongo
        const { id } = request.params

        // Update the product in the database
        const result = await db.collection("products").updateOne(
            { _id: new ObjectId(id) },
            { $set: { ...request.body, updated_at: new Date() } }
        )

        if (result.matchedCount === 0) {
            return reply.code(404).send({ error: "Product not found" })
        }


        reply.code(200).send({ message: "Product updated successfully" })
    } catch (err) {
        request.log.error(err)
        return reply.code(500).send({ error: "An error occurred while updating the product" })
    }
}

// DELETE a product by ID
export async function deleteProduct(request, reply) {
    try {
        const { db, ObjectId } = request.server.mongo
        const { id } = request.params

        // Check if the product exists
        const result = await db.collection("products").deleteOne({ _id: new ObjectId(id) })

        if (result.deletedCount === 0) {
            return reply.code(404).send({ error: "Product not found" })
        }

        reply.send({ message: "Product deleted successfully" })
    } catch (err) {
        request.log.error(err)
        return reply.code(500).send({ error: "An error occurred while deleting the product" })
    }
}

// PATCH Update stock
export async function updateStock(request, reply) {
    try {
        const { db, ObjectId } = request.server.mongo
        const { id } = request.params
        const { stock } = request.body

        // Update the product stock in the database
        const product = await db.collection("products").findOne({ _id: new ObjectId(id) })
        if (!product) {
            return reply.code(404).send({ error: "Product not found" })
        }

        // Prevent stock from going negative
        const newStock = product.stock + stock
        if (newStock < 0) {
            return reply.code(400).send({ error: "Stock cannot be negative" })
        }

        // Update the product stock in the database
        await db.collection("products").updateOne(
            { _id: new ObjectId(id) },
            { $set: { stock: newStock, updates_at: new Date() } }
        )

        reply.code(200).send({ message: "Product stock updated successfully" })
    } catch (err) {
        request.log.error(err)
        return reply.code(500).send({ error: "An error occurred while updating the product stock" })
    }
}