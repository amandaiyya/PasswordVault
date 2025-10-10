import mongoose, { Schema } from "mongoose";

const UserSchema = new Schema({
    email: {
        type: String,
        unique: true,
        required: [true, "Email is required"],
    },

    password: {
        type: String,
        required: [true, "Password is required"],
    },

    salt: {
        type: String,
        required: [true, "Salt is required"],
    },

    vaultTest: {
        ciphertext: {
            type: String,
            required: [true, "ciphertext is required"],
        },
        iv: {
            type: String,
            required: [true, "iv is required"],
        }
    }
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model("User", UserSchema);

export default User;