// JSON schema for validating category data
export const categorySchema = {
    type: "object",
    required: ["name"],
    properties: {
        name: { type: "string", minLength: 1, maxLength: 100 }
    }
};