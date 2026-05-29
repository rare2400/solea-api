import bcrypt from 'bcrypt'
import { errorHandler, notFound, badRequest } from '../utils/errorHandler.js'
import { parseId } from '../utils/parseId.js'
import { getCollection } from '../utils/getCollection.js'

const saltRounds = 10

// Register a new user
export async function registerUser(request, reply) {
    try {
        const { firstname, lastname, email, password, role } = request.body
        const users = getCollection(request, "users")

        // Check if the user already exists
        const existingUser = await users.findOne({ email })
        if (existingUser) {
            return badRequest(reply, "Email is already registered")
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, saltRounds)

        // Insert new user into the database
        await users.insertOne({
            firstname,
            lastname,
            email,
            password: hashedPassword,
            role,
            created_at: new Date()
        })

        return reply.code(201).send({ message: "User registered successfully" })

    } catch (err) {
        return errorHandler(request, reply, err, "Failed to register user")
    }
}

// Authenticate user and return JWT
export async function loginUser(request, reply) {
    try {
        const { email, password } = request.body
        const users = getCollection(request, "users")

        // Find the user by email
        const user = await users.findOne({ email })
        if (!user) {
            return badRequest(reply, "Invalid email or password")
        }

        // Compare the provided password with the hashed password
        const validPassword = await bcrypt.compare(password, user.password)
        if (!validPassword) {
            return badRequest(reply, "Invalid email or password")
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
        return errorHandler(request, reply, err, "Failed to login user")
    }


}

// Get the authenticated user's profile
export async function getProfile(request, reply) {
    try {
        const { ObjectId } = request.server.mongo
        const users = getCollection(request, "users")
        const _id = parseId(ObjectId, request.user.userId, reply)
        if (!_id) return

        // Find the user by ID
        const user = await users.findOne({ _id })

        if (!user) {
            return notFound(reply, message)
        }

        return reply.code(200).send({
            firstname: user.firstname,
            role: user.role
        })

    } catch (err) {
        return errorHandler(request, reply, err, "Failed to retrieve user profile")
    }

}

// Get a list of all users 
export async function getAllUsers(request, reply) {
    try {
        const users = getCollection(request, "users")

        // Get all users from the database
        const result = await users.find(
            {},
            { projection: { password: 0 } }
        ).toArray()

        return reply.code(200).send(result)
    } catch (err) {
        return errorHandler(request, reply, err, "Failed to retrieve users")
    }
}

// Update user profile
export async function updateUser(request, reply) {
    try {
        const { ObjectId } = request.server.mongo
        const users = getCollection(request, "users")
        const _id = parseId(ObjectId, request.params.id, reply)
        if (!_id) return

        const updates = { ...request.body }

        // Hide password field if it's not being updated
        delete updates.password

        const result = await users.updateOne(
            { _id },
            { $set: updates }
        )

        if (result.matchedCount === 0) {
            return notFound(reply, message)
        }

        return reply.code(200).send({ message: "User profile updated successfully" })

    } catch (err) {
        return errorHandler(request, reply, err, "Failed to update user profile")
    }
}

// Delete user
export async function deleteUser(request, reply) {
    try {
        const { ObjectId } = request.server.mongo
        const users = getCollection(request, "users")
        const _id = parseId(ObjectId, request.params.id, reply)
        if(!_id) return

        const result = await users.deleteOne({ _id })

        if (result.deletedCount === 0) {
            return notFound(reply, message)
        }

        return reply.code(200).send({ message: "User deleted successfully" })

    } catch (err) {
        return errorHandler(request, reply, err, "Failed to delete user")
    }
}