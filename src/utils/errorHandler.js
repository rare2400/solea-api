export function errorHandler(request, reply, err, message = "Internal Server Error") {
    request.log.error(err)
    return reply.code(500).send({ error: message
     })
}

export function notFound(reply, message = "Not Found") {
    return reply.code(404).send({ error: message })
}

export function badRequest(reply, message = "Bad Request") {
    return reply.code(400).send({ error: message })
}