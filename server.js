"use strict";

import Fastify from 'fastify'
import dotenv from 'dotenv'
import cors from '@fastify/cors'
import jwt from '@fastify/jwt'
import auth from '@fastify/auth'
import mongoDb from './src/plugins/mongodb.js'

// import routes
import authRoutes from './src/routes/authRoutes.js'
import productRoutes from './src/routes/productRoutes.js'

// Load environment variables from .env file
dotenv.config()

// Fastify server instance with logging enabled
const fastify = Fastify({ logger: true })

// Plugins
await fastify.register(cors, {
    origin: "*" // Allow all origins (adjust as needed for production)
})

await fastify.register(jwt, {
    secret: process.env.JWT_SECRET
})

await fastify.register(mongoDb)
await fastify.register(auth)

// Verify JWT token
fastify.decorate("verifyJWT", async (request, reply) => {
    try {
        await request.jwtVerify()
    } catch (error) {
        return reply.code(401).send({ error: "Unauthorized" })
    }
})

// Verify admin role
fastify.decorate("verifyAdmin", async (request, reply) => {
    if (!request.user || request.user.role !== "admin") {
        return reply.code(403).send({ error: "Forbidden: Admins only" })
    }
})

// Routes
await fastify.register(authRoutes, { prefix: "/auth" })
await fastify.register(productRoutes, { prefix: "/products" })

// Start the server with error handling
const start = async () => {
    const port = process.env.PORT || 3000

    try {
        await fastify.listen({
            port: port,
            host: "0.0.0.0"
        })
        console.log(`Server is running on port ${port}`)
    } catch (err) {
        fastify.log.error(err)
        process.exit(1)
    }
}

start()
