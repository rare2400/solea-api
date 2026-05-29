export function getCollection(request, collectionName) {
    return request.server.mongo.db.collection(collectionName)
}