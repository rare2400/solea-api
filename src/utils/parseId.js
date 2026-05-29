export function parseId(ObjectId, id, reply) {
    try {
        return new ObjectId(id)
    } catch (err) {
        reply.code(400).send({ error: 'Invalid ID format' })
        return null
    }
}