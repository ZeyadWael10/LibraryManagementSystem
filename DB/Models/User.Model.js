import mongoose, { model, Schema } from "mongoose";
const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    image: {
        profilePictureUrl: {
            type: String,
        },
        publicId: {
            type: String,
        }
    },
    confirmed: {
        type: Boolean,
        default: false,
    },
    isLoggedIn: {
        type: Boolean,
        default: false,
    },
    borrowedBooks: [{
        type: Schema.Types.ObjectId,
        ref: 'book'
    }],
    fines: {
        type: Number,
    },
    resetPasawordCode: {
        type: String,
    }, resetExpiresTimer: {
        type: Date
    },
}, {
    timestamps: true
})


export const UserModel = mongoose.models.user||model("user", userSchema)