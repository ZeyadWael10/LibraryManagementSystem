import { AdminModel } from "../../DB/Models/Admin.Model.js"
import { comparingFunction, hashingFunction } from "../../Utils/HashingFunction.js"
import { tokenGeneration } from "../../Utils/TokenFunction.js"

export const signUp = async (req, res, next) => {
    const { name, email, password } = req.body
    const hashedPassword = hashingFunction({ payload: password })
    const admin = new AdminModel({ name, email, password: hashedPassword })
    const savedAdmin = await admin.save()
    if (savedAdmin) return res.status(201).json({ message: "Signup Success", Admin: savedAdmin })
    next(new Error("Signup Failed"))
}
export const logIn = async (req, res, next) => {
    const { email, password } = req.body
    const isExist = await AdminModel.findOne({ email })
    if (!isExist) return next(new Error("Admin notfound", { cause: 400 }))
    const matchingPasswords = comparingFunction({ payload: password, comparingPassword: isExist.password })
    if (!matchingPasswords) return next(new Error("Passwords Doesnot Match", { cause: 400 }))
    const token = tokenGeneration({ payload: { id: isExist._id, email: isExist.email } })
    await AdminModel.findOneAndUpdate({ email }, { isLoggedIn: true })
    if (token) return res.json({ message: "Login Success", Token: token })
}
export const logout = async (req, res, next) => {
    const { _id } = req.admin
    const admin = await AdminModel.findByIdAndUpdate(_id, { isLoggedIn: false })
    if (admin) return res.status(200).json({ message: "Logged Out" })
    next(new Error("Cannot LogOut"))
}
export const deleteAdmin = async (req, res, next) => {
    const { _id } = req.admin
    const DeletedAdmin = await AdminModel.findByIdAndDelete(_id)
    if (DeletedAdmin) return res.status(200).json({ message: "Deleted Successfully" })
    next(new Error("Deleting Failed"))
}
export const updatePassword = async (req, res, next) => {
    const { _id } = req.admin
    const { password } = req.body
    const hashedPassword = hashingFunction({ payload: password })
    const UpdatedAdmin = await AdminModel.findByIdAndUpdate(_id, { password: hashedPassword })
    if (UpdatedAdmin) return res.status(200).json({ message: "Updated Successfully" })
    next(new Error("Updating Failed"))
}