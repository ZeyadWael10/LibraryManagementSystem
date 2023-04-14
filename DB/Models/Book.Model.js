import mongoose, { model, Schema } from "mongoose";

const BookSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true   
    },
    author: {
        type: String,
        required: true
    },
    BookPictures:[ {
        type: String,
    }],
    isBorrowed: {
        type: Boolean,
        default:false,
        required: true
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: "admin"
    },
    BorrowedBy: {
        type: Schema.Types.ObjectId,
        ref: "user"
    },
    BorrowedAt: {
        type: Date,
    },
    BorrowedPeriod: {
        type: Number,
    },
    finePerDay:{
        type: Number,
        default:25
    }
}, {
    timestamps: true
})
export const BookModel = mongoose.models.book || model("book", BookSchema)