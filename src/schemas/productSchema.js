// JSON schema for validating product data
export const productSchema = {
    type: "object",
    required: ["name, price, stock"],
    properties: {
        name: { type: "string", minLength: 1, maxLength: 100 },
        description: { type: "string", maxLength: 500 },
        price: { type: "number", minimum: 0 },
        image_url: { type: "string" },
        stock: { type: "integer", minimum: 0 },
        categoryId: { type: "string", minLength: 1 }
    }
};