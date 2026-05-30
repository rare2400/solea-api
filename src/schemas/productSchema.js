// JSON schema for validating product data
export const productSchema = {
    type: "object",
    required: ["name", "price", "sku", "stock", "category"],
    properties: {
        name: { type: "string", minLength: 1, maxLength: 100 },
        description: { type: "string", maxLength: 500 },
        price: { type: "number", minimum: 0 },
        shelf: { type: "string", minLength: 4, maxLength: 10 },
        sku: { type: "string", minLength: 8, maxLength: 20 },
        stock: { type: "integer", minimum: 0 },
        category: { type: "string", minLength: 1 }
    },
    additionalProperties: false
}