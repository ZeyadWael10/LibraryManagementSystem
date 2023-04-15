import { BookModel } from "../../DB/Models/Book.Model.js"
import moment from 'moment';
import { UserModel } from "../../DB/Models/User.Model.js";
import Cloudinary from "../../Utils/Cloudinary.js";
import { sendEmail } from "../../Services/SendEmail.js";
import { nanoid } from "nanoid";
export const getAllBooks = async (req, res, next) => {
    const books = await BookModel.find({})
    if (books) return res.status(201).json({ message: "Done", Books: books })
    next(new Error("Unknown Error"))
}
export const addBook = async (req, res, next) => {
    const { name, author } = req.body
    const addedBook = new BookModel({ name, author})
    const Book = await addedBook.save()
    if (Book) return res.status(201).json({ message: "Book Added Successfully", Book })
    next(new Error("Error Adding Book"))
}
export const updateBook = async (req, res, next) => {
    const { name, author } = req.body
    const { BookId } = req.params
    const book = await BookModel.findOneAndUpdate({ _id: BookId}, { name, author }, { new: true })
    if (book) return res.status(200).json({ message: "Book Updated Successfully", UpdatedData: book })
    next(new Error("Error Updating Book"))
}
export const deleteBook = async (req, res, next) => {
    const { BookId } = req.params
    const deletedBook = await BookModel.findOneAndDelete({ _id: BookId})
    if (deletedBook) return res.status(201).json({ message: "Book Deleted Successfully" })
    next(new Error("Error Deleting Book"))
}
export const borrowBook = async (req, res, next) => {
    const { _id } = req.user
    const { bookId } = req.params
    const { BorrowedPeriod } = req.body
    const isBorrowed = await BookModel.findOne({ _id: bookId, isBorrowed: true })
    if (isBorrowed) return res.status(404).json({ message: "Book Is Already Borrowed" })
    const borrowDate = moment()
    const borrowedBook = await BookModel.findOneAndUpdate({ _id: bookId }, { isBorrowed: true, BorrowedBy: _id, BorrowedAt: borrowDate, BorrowedPeriod })
    const Borrower = await UserModel.findByIdAndUpdate(_id, { $push: { borrowedBooks: bookId } })
    if (borrowedBook) {
        const systemMessage = `<h1>Borrowed Book Announcement</h1>
        <p>Kindly Be Informed That is Book Borrowed With ID:${bookId} and Name:${borrowedBook.name} and The Borrower Name Is: ${Borrower.name} and BorrowerId: ${_id}</p>`
        const userMessage = `<h1>Borrowed Book Announcement</h1>
        <p>Kindly Be Informed That is a Book With ID:${bookId} and Name:${borrowedBook.name} is Borrowed</p>`
        const sendingEmail = sendEmail({
            to: process.env.systemEmail,
            subject: "Book Borrowed",
            message: systemMessage
        })
        const sendingUserEmail = sendEmail({
            to: Borrower.email,
            subject: "Book Borrowed",
            message: userMessage
        })
        if (sendingEmail && sendingUserEmail) return res.status(200).json({ message: "Book Borrowed Successfully" })
    }
    next(new Error("Error Borrowing Book"))
}
export const returnBook = async (req, res, next) => {
    const { _id } = req.user
    const { bookId } = req.params
    const borrowingRecord = await BookModel.findOne({ _id: bookId, BorrowedBy: _id, isBorrowed: true })
    const returnDate = moment();
    const borrowingDate = borrowingRecord.BorrowedAt;
    const borrowingPeriod = borrowingRecord.BorrowedPeriod;
    const daysLate = returnDate.diff(moment(borrowingDate), "days") - borrowingPeriod;
    const fine = daysLate > 0 ? daysLate * borrowingRecord.finePerDay : 0;
    const book = await BookModel.findOneAndUpdate({ _id: bookId, BorrowedBy: _id, isBorrowed: true }, { isBorrowed: false, $unset: { BorrowedBy: '', BorrowedAt: '', BorrowedPeriod: "" }, })
    const user = await UserModel.findOneAndUpdate({ _id, isLoggedIn: true, confirmed: true }, { fines: fine, $pull: { borrowedBooks: bookId } })
    const systemMessage = `<h1>Returned Book Announcement</h1>
    <p>Kindly Be Informed That is Book Returned With ID:${bookId} and Name:${book.name} and The Borrower Name Is: ${user.name} and BorrowerId: ${_id}</p>`
    const userMessage = `<h1>Returned Book Announcement</h1>
    <p>Kindly Be Informed That is a Book With ID:${bookId} and Name:${book.name} is Returned</p>`
    const sendingEmail = sendEmail({
        to: process.env.systemEmail,
        subject: "Book Returned",
        message: systemMessage
    })
    const sendingUserEmail = sendEmail({
        to: user.email,
        subject: "Book Returned",
        message: userMessage
    })
    if (sendingEmail && sendingUserEmail) return res.status(200).json({ message: "Book Returned Successfully" })
    next(new Error("Error Returning Book"))
}
export const searchBorrowedBooks = async (req, res, next) => {
    const { bookname, borrowingDate } = req.params;
    const books = await BookModel.find({ name: { $regex: bookname, $options: 'i' },BorrowedAt:{$gte: moment(borrowingDate)}});
    res.json({ message: "Done", Books: books });
    next(new Error("Unkown Error"))
}
export const searchIssuedBooks = async (req, res, next) => {
    const { bookname } = req.params;
    const books = await BookModel.find({ name: { $regex: bookname, $options: 'i' }});
    res.json({ message: "Done", Books: books });
    next(new Error("Unkown Error"))
}
export const uploadBookPicture = async (req, res, next) => {
    if (!req.files.length) {
        next(new Error("Please Upload Pictures", { cause: 400 }))
    }
    const { BookId } = req.params
    const book = await BookModel.findById(BookId)
    if (!book) return next(new Error("Book Notfound"))
    let coverPicsArr = []
    const customId = nanoid(5)
    for (const file of req.files) {
        const { secure_url } = await Cloudinary.uploader.upload(file.path, {
            folder: `Pictures/Books/${customId}/Images`
        })
        coverPicsArr.push(secure_url)
    }
    const updatedBook = await BookModel.findOneAndUpdate({ _id: BookId}, { BookPictures: [...book.BookPictures, ...coverPicsArr] }, { new: true })
    updatedBook ? res.status(200).json({ message: "Done", UpdatedData: updatedBook }) : next(new Error("Error Uploading Photos"))
}