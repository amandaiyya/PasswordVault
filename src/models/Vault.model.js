import mongoose, { Schema } from "mongoose";

const VaultSchema = new Schema({
    data: {
        type: String,
        required: [true, "Entry's data is required"]
    },

    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, "Owner ID is required"],
        ref: "User",
    },
},{ timestamps: true });

const Vault = mongoose.models.Vault || mongoose.model("Vault", VaultSchema);

export default Vault;