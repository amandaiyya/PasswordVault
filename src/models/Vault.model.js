import mongoose, { Schema } from "mongoose";

const VaultSchema = new Schema({
    title: {
        type: String,
        required: [true, "Title is required"],
        trim: true,
    },

    username: {
        type: String,
        required: [true, "Username is required"],
        trim: true,
    },

    password: {
        type: String,
        required: [true, "Password is required"],
    },

    url: {
        type: String,
        default: "",
    },

    note: {
        type: String,
        default: "",
    },

    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, "Owner ID is required"],
        ref: "User",
    },
},{ timestamps: true });

const Vault = mongoose.models.Vault || mongoose.model("Vault", VaultSchema);

export default Vault;