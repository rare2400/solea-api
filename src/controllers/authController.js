import bcrypt from 'bcrypt'

const saltRounds = 10

// Register a new user
export async function registerUser(request, reply) {
    try {
        const { firstname, lastname, email, password, role } = request.body
        const { db } = request.server.mongo

        // Check if the user already exists
        const existingUser = await db.collection("users").findOne({ email })
        if (existingUser) {
            return reply.code(400).send({ error: "Email already in use" })
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, saltRounds)

        // Insert new user into the database
        await db.collection("users").insertOne({
            firstname,
            lastname,
            email,
            password: hashedPassword,
            role,
            created_at: new Date()
        })

        reply.code(201).send({ message: "User registered successfully" })

    } catch (err) {
        request.log.error(err)
        return reply.code(500).send({ error: "Internal Server Error" })
    }
}

// Authenticate user and return JWT
export async function loginUser(request, reply) {
    try {
        const { email, password } = request.body
        const { db } = request.server.mongo

        // Find the user by email
        const user = await db.collection("users").findOne({ email })
        if (!user) {
            return reply.code(400).send({ error: "Invalid email or password" })
        }

        // Compare the provided password with the hashed password
        const validPassword = await bcrypt.compare(password, user.password)
        if (!validPassword) {
            return reply.code(400).send({ error: "Invalid email or password" })
        }

        // Generate a JWT token
        const token = request.server.jwt.sign(
            {
                userId: user._id,
                firstname: user.firstname,
                email: user.email,
                role: user.role
            }, { expiresIn: "8h" }
        )

        return reply.code(200).send({ token })
    } catch (err) {
        request.log.error(err)
        return reply.code(500).send({ error: "Internal Server Error" })
    }


}

// Get the authenticated user's profile
export async function getProfile(request, reply) {
    try {
        const { db, ObjectId } = request.server.mongo
        const userId = request.user.userId

        // Find the user by ID
        const user = await db.collection("users").findOne(
            { _id: new ObjectId(userId) }
        )

        if (!user) {
            return reply.code(404).send({ error: 'User not found' })
        }

        return reply.code(200).send({
            firstname: user.firstname,
            role: user.role
        })

    } catch (err) {
        request.log.error(err)
        return reply.code(500).send({ error: 'Internal Server Error' })
    }

}

// Get a list of all users 
export async function getAllUsers(request, reply) {
    try {
        const { db } = request.server.mongo

        // Get all users from the database
        const users = await db.collection('users').find(
            {},
            { projection: { password: 0 } }
        ).toArray()

        return reply.code(200).send(users)
    } catch (err) {
        request.log.error(err)
        return reply.code(500).send({ error: 'Internal Server Error' })
    }
}

// Update user profile
export async function updateUser(request, reply) {
    try {
        const { db, ObjectId } = request.server.mongo
        const { id } = request.user.userId
        const updates = request.body

        // Hide password field if it's not being updated
        delete updates.password

        const result = await db.collection("users").updateOne(
            { _id: new ObjectId(id) },
            { $set: updates }
        )

        if(result.matchedCount === 0) {
            return reply.code(404).send({ error: "User not found" })
        }

        return reply.code(200).send({ message: "User profile updated successfully" })

    } catch (err) {
        request.log.error(err)
        return reply.code(500).send({ error: "Internal Server Error" })
    }
}

// Delete user
export async function deleteUser(request, reply) {
    try {
        const { db, ObjectId } = request.server.mongo
        const { id } = request.params

        const result = await db.collection("users").deleteOne({ _id: new ObjectId(id) })

        if(result.deletedCount === 0) {
            return reply.code(404).send({ error: "User not found" })
        }

        return reply.code(200).send({ message: "User deleted successfully" })

    } catch (err) {
        request.log.error(err)
        return reply.code(500).send({ error: "Internal Server Error" })
    }
}