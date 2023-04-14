import mongoose, { model, Schema } from "mongoose";
const adminSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true
    },
    isLoggedIn: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true
})


export const AdminModel = mongoose.models.admin || model("admin", adminSchema)