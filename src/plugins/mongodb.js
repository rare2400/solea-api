import fastifyPlugin from "fastify-plugin";
import mongo from "@fastify/mongodb";

// Plugin connects to MongoDB and makes the database accessible via fastify.mongo
export default fastifyPlugin(async (fastify) => {
    await fastify.register(mongo, {

        // MongoDB URL from .env and specify the database name
        url: process.env.DATABASE_URL,
        database: "solea"
    });
    console.log("Connected to MongoDB");
});