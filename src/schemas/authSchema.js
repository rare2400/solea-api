// JSON schema for validating user registration data
export const userSchema = {
    type: "object",
    required: ["firstname", "lastname", "email", "password", "role"],
    properties: {
        firstname: { type: "string", minLength: 1, maxLength: 30 },
        lastname: { type: "string", minLength: 1, maxLength: 30 },
        email: { type: "string" },
        password: { type: "string", minLength: 6 },
        role: { type: "string", enum: ["admin", "staff"] }
    }
}

// JSON schema for validating user login data
export const loginSchema = {
    type: "object",
    required: ["email", "password"],
    properties: {
        email: { type: "string" },
        password: { type: "string", minLength: 6 }
    }
}

// JSON schema for validating user profile update data
export const updateUserSchema = {
    type: "object",
    required: ["firstname", "lastname", "email"],
    properties: {
        firstname: { type: "string", minLength: 1, maxLength: 30 },
        lastname: { type: "string", minLength: 1, maxLength: 30 },
        email: { type: "string" }
    }
}