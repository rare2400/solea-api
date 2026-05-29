// GET all categories
export async function getCategories(request, reply) {
    try {
        const { db } = request.server.mongo
        const categories = await db.collection("categories").find().toArray()

        return reply.code(200).send(categories)
    } catch (err) {
        request.log.error(err)
        return reply.code(500).send({ error: "An error occurred while fetching products" })
    }
}

// GET a category by ID
export async function getCategoryById(request, reply) {
    try {
        const { db, ObjectId } = request.server.mongo
        const { id } = request.params

        const category = await db.collection("categories").findOne({ _id: new ObjectId(id) })
        if (!category) {
            return reply.code(404).send({ error: "Category not found" })
        }

        return reply.code(200).send(category)
    } catch (err) {
        request.log.error(err)
        return reply.code(500).send({ error: "An error occurred while fetching the category" })
    }
}

// POST a new category
export async function addCategory(request, reply) {
    try {
        const { db } = request.server.mongo
        const { name } = request.body

        // Check if the category already exists
        const existingCategory = await db.collection("categories").findOne({ name })
        if (existingCategory) {
            return reply.code(400).send({ error: "Category already exists" })
        }

        // Insert the new category into the database
        const result = await db.collection("categories").insertOne({
            name,
            created_at: new Date()
        })

        return reply.code(201).send({ message: "Category added successfully", categoryId: result.insertedId })
    } catch (err) {
        request.log.error(err)
        return reply.code(500).send({ error: "An error occurred while adding the category" })
    }
}

// PUT update a category by ID
export async function updateCategory(request, reply) {
    try {
        const { db, ObjectId } = request.server.mongo
        const { id } = request.params

        // Check if the category exists
        const result = await db.collection("categories").updateOne(
            { _id: new ObjectId(id) },
            { $set: { ...request.body, updatedAt: new Date() } }
        )

        if (result.matchedCount === 0) {
            return reply.code(404).send({ error: "Category not found" })
        }

        return reply.code(200).send({ message: "Category updated successfully" })
    } catch (err) {
        request.log.error(err)
        return reply.code(500).send({ error: "An error occurred while updating the category" })
    }
}

// DELETE a category by ID
export async function deleteCategory(request, reply) {
    try {
        const { db, ObjectId } = request.server.mongo
        const { id } = request.params

        // Delete the category from the database
        const result = await db.collection("categories").deleteOne({ _id: new ObjectId(id) })
        if (result.deletedCount === 0) {
            return reply.code(404).send({ error: "Category not found" })
        }


        return reply.code(200).send({ message: "Category deleted successfully" })
    } catch (err) {
        request.log.error(err)
        return reply.code(500).send({ error: "An error occurred while deleting the category" })
    }
}