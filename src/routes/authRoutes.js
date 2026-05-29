import * as authController from '../controllers/authController.js';
import { userSchema, loginSchema, updateUserSchema } from '../schemas/authSchema.js';

export default async function authRoutes(fastify) {
    // User registration route with validation
    fastify.post("/register", {
        preHandler: fastify.auth([
            fastify.verifyJWT,
            fastify.verifyAdmin
        ], {
            relation: "and"
        }),
        schema: { body: userSchema },
        handler: authController.registerUser
    })

    // User login route with validation
    fastify.post("/login", {
        schema: { body: loginSchema },
        handler: authController.loginUser
    })

    // Get authenticated user's profile
    fastify.get("/profile", {
        preHandler: fastify.auth([fastify.verifyJWT]),
        handler: authController.getProfile
    })

    // GET all users (admin only)
    fastify.get("/users", {
        preHandler: fastify.auth([
            fastify.verifyJWT,
            fastify.verifyAdmin
        ], {
            relation: "and"
        }),
        handler: authController.getAllUsers
    })

    // PUT update user profile
    fastify.put("/users/:id", {
        preHandler: fastify.auth([fastify.verifyJWT]),
        schema: { body: updateUserSchema },
        handler: authController.updateUser
    })

    // DELETE user account
    fastify.delete("/users/:id", {
        preHandler: fastify.auth([
            fastify.verifyJWT,
            fastify.verifyAdmin
        ], {
            relation: "and"
        }),
        handler: authController.deleteUser
    })
}