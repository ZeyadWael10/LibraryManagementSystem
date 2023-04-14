import { AdminModel } from "../DB/Models/Admin.Model.js";
import { UserModel } from "../DB/Models/User.Model.js";
import { tokenDecode } from "../Utils/TokenFunction.js";

export const auth = () => {
    return async (req, res, next) => {
        const { authorization } = req.headers;
        if (!authorization) {
            return res.json({ message: "Please Enter Your Token" })
        }
        if (!authorization.startsWith(process.env.PERFIX)) {
            return res.json({ message: "Invalid Perfix" })
        }
        const token = authorization.split(process.env.PERFIX)[1]
        const decoded = tokenDecode({ payload: token })
        if (!decoded || !decoded.id) {
            return res.json({ message: "Invalid Token" })
        }
        const user = await UserModel.findById(decoded.id)
        if (user) {
            req.user = user
            next()
        } else {
            res.json({ message: "Invalid UserId" })
        }

    }
}
export const adminAuth = () => {
    return async (req, res, next) => {
        const { authorization } = req.headers;
        if (!authorization) {
            return res.json({ message: "Please Enter Your Token" })
        }
        if (!authorization.startsWith(process.env.PERFIX)) {
            return res.json({ message: "Invalid Perfix" })
        }
        const token = authorization.split(process.env.PERFIX)[1]
        const decoded = tokenDecode({ payload: token })
        if (!decoded || !decoded.id) {
            return res.json({ message: "Invalid Token" })
        }
        const admin = await AdminModel.findById(decoded.id)
        if (!admin) return next(new Error("Invalid UserId", { cause: 400 }))
        req.admin = admin
        next()
    }
}