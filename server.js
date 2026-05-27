"use strict";

import Fastify from 'fastify';
import dotenv from 'dotenv';
import mongoDb from './src/plugins/mongodb.js';

// Load environment variables from .env file
dotenv.config();

// Fastify server instance with logging enabled
const fastify = Fastify({ logger: true });

await fastify.register(mongoDb);

// Start the server with error handling
const start = async () => {
    const port = process.env.PORT || 3000;

    try {
        await fastify.listen({
            port: port,
            host: "0.0.0.0"
        });
        console.log(`Server is running on port ${port}`);
    } catch (err) {
        fastify.log.error(err);
        process.exit(1);
    }
}

start();
