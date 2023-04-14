import Joi from 'joi';
export const addBookValidatinon = {
    user:Joi.object().required().keys({
        _id:Joi.string().required()
    }),
    body: Joi.object().required().keys({
        name: Joi.string().required(),
        author: Joi.string().required(),
        isBorrowed: Joi.boolean().default(false).required(),
    })
}
export const updateBookValidatinon = {
    admin:Joi.object().required().keys({
        _id:Joi.string().required()
    }),
    body: Joi.object().required().keys({
        name: Joi.string().required(),
        author: Joi.string().required(),
    }),
    params: Joi.object().required().keys({
        BookId: Joi.string().required(),
    })
}
export const deleteBookValidatinon = {
    admin:Joi.object().required().keys({
        _id:Joi.string().required()
    }),
    params: Joi.object().required().keys({
        BookId: Joi.string().required(),
    })
}
export const returnBookValidatinon = {
    user:Joi.object().required().keys({
        _id:Joi.string().required()
    }),
    params: Joi.object().required().keys({
        bookId: Joi.string().required(),
    })
}
export const borrowBookValidatinon = {
    user:Joi.object().required().keys({
        _id:Joi.string().required()
    }),
    params: Joi.object().required().keys({
        bookId: Joi.string().required(),
    }),
    body:Joi.object().required().keys({
        BorrowedPeriod: Joi.number().required(),
    }),
}
export const searchBorrowedBooksValidatinon = {
    params: Joi.object().required().keys({
        bookname: Joi.string().required(),
        borrowingDate: Joi.date().required(),
    }),
}
export const searchIssuedBooksValidatinon = {
    params: Joi.object().required().keys({
        bookname: Joi.string().required()
    }),
}
export const uploadBookPicValidatinon = {
    admin:Joi.object().required().keys({
        _id:Joi.string().required()
    }),
    params: Joi.object().required().keys({
        _id: Joi.string().required(),
    })
}