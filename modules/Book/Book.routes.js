import { Router } from "express";
import { auth } from "../../Middlewares/Authentication.js";
import { myMulter, validObject } from "../../Services/Multer.js";
import { asyncHandler } from "../../Utils/ErrorHandling.js";
import * as BookController from "./Book.controller.js"
import * as validators from "./Book.validation.js"
import { ValidationFunction } from "../../Middlewares/Validation.js";
const router =Router()
router.get("/",BookController.getAllBooks)
router.post("/addbook",ValidationFunction(validators.addBookValidatinon),asyncHandler(BookController.addBook))
router.post("/updatebook/:BookId",ValidationFunction(validators.updateBookValidatinon),asyncHandler(BookController.updateBook))
router.delete("/deletebook/:BookId",ValidationFunction(validators.deleteBookValidatinon),asyncHandler(BookController.deleteBook))
router.put("/borrowbook/:bookId",auth(),ValidationFunction(validators.borrowBookValidatinon),asyncHandler(BookController.borrowBook))
router.put("/returnbook/:bookId",auth(),ValidationFunction(validators.returnBookValidatinon),asyncHandler(BookController.returnBook))
router.get("/search/issued/:bookname",ValidationFunction(validators.searchIssuedBooksValidatinon),asyncHandler(BookController.searchIssuedBooks))
router.get("/search/borrowed/:bookname/:borrowingDate",ValidationFunction(validators.searchBorrowedBooksValidatinon),asyncHandler(BookController.searchBorrowedBooks))
router.patch("/addBookPics/:BookId",myMulter({validation:validObject}).array("image"),asyncHandler(BookController.uploadBookPicture))
export default router;