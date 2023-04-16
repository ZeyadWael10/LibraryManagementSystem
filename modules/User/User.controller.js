import { UserModel } from "../../DB/Models/User.Model.js"
import { sendEmail } from "../../Services/SendEmail.js"
import Cloudinary from "../../Utils/Cloudinary.js"
import { comparingFunction, hashingFunction } from "../../Utils/HashingFunction.js"
import { tokenDecode, tokenGeneration } from "../../Utils/TokenFunction.js"
import { nanoid } from "nanoid"

export const signUp = async (req, res, next) => {
    const { name, email, password, phone, age } = req.body
    const hashedPassword = hashingFunction({ payload: password })
    const user = new UserModel({ name, email, password: hashedPassword, phone, age })
    const token = tokenGeneration({ payload: { id: user._id, name: user.name } })
    const confirmationLink = `${req.protocol}://${req.headers.host}/api/v1/user/confirmEmail/${token}`;
    const message = `<h1>Thanks For Registering On Our Website</h1>
    <h4>Kindly Confirm Your Email By Clicking On The Link Below</h4>
    <a href=${confirmationLink}>Click to confirm your email</a></br>`
    const sendingEmail = sendEmail({
        to: user.email,
        subject: "Confirmation Email",
        message: message
    })
    if (sendingEmail) {
        const savedUser = await user.save()
        return res.status(201).json({ message: "Signup Success, Please Confirm Your Email Then Login", User: savedUser })
    }
    next(new Error("Signup Failed"))

}
export const confirmEmail = async (req, res, next) => {
    const { token } = req.params;
    const decoded = tokenDecode({ payload: token })
    if (decoded.id) {
        await UserModel.findOneAndUpdate({ _id: decoded.id, confirmed: false }, { confirmed: true, isLoggedIn: true })
        return res.json({ message: "Email Confirmed...Plaese Try To Login" })
    }
    res.status(201).json({ message: "unknow error" });
}
export const logIn = async (req, res, next) => {
    const { email, password } = req.body
    const isExist = await UserModel.findOne({ email })
    if (isExist) {
        const matchingPasswords = comparingFunction({ payload: password, comparingPassword: isExist.password })
        if (matchingPasswords) {
            const token = tokenGeneration({ payload: { id: isExist._id, email: isExist.email } })
            await UserModel.findOneAndUpdate({ email }, { isLoggedIn: true })
            if (token) return res.json({ message: "Login Success", Token: token, User: isExist })
            res.json({ message: "Generation of Token Failed" })
        } else {
            next(new Error("Invalid Login Information", { cause: 400 }))
        }
    } else {
        res.json({ message: "Invalid login information" })
    }
}
export const logout = async (req, res, next) => {
    const { _id } = req.user
    const user = await UserModel.findByIdAndUpdate(_id, { isLoggedIn: false })
    if (user) return res.status(200).json({ message: "Logged Out" })
    next(new Error("Cannot LogOut"))
}
export const deleteUser = async (req, res, next) => {
    const { _id } = req.user
    const DeletedUser = await UserModel.findByIdAndDelete(_id)
    if (DeletedUser) return res.status(200).json({ message: "Deleted Successfully" })
    next(new Error("Deleting Failed"))
}
export const updateData = async (req, res, next) => {
    const { _id } = req.user
    const { name, age } = req.body
    const user = await UserModel.findOneAndUpdate({ _id }, { name, age },{new:true})
    if (user) return res.status(200).json({ message: "Account Updated Successfully", Updateddata:user })
    next(new Error("Account Updating Failed"))
}
export const updatePasswordAfterLogin = async (req, res, next) => {
    const { _id } = req.user
    const { password } = req.body
    const hashedPassword = hashingFunction({ payload: password })
    const UpdatedUser = await UserModel.findByIdAndUpdate(_id, { password: hashedPassword })
    if (UpdatedUser) return res.status(200).json({ message: "Updated Successfully" })
    next(new Error("Updating Failed"))
}
export const sendForgetPasswordEmail = async (req, res, next) => {
    const { email } = req.body
    const user = await UserModel.findOne({ email, confirmed: true });
    if (!user) return next(new Error("User Notfound"))
    const resetCode = Math.floor(Math.random() * 900000) + 100000;
    const resetExpires = new Date(Date.now() + 10 * 60 * 1000);
    await UserModel.findOneAndUpdate({email, confirmed: true},{resetPasawordCode:resetCode,resetExpiresTimer:resetExpires});
    const message = `<p>Your Reset Password Code Is: ${resetCode}</p>`;
    const resetEmail = sendEmail({
        to: user.email,
        subject: 'Reset Your Password',
        message: message
    });
    if (resetEmail) return res.json({ message: 'Password reset email sent' });
    next(new Error("Error Sending Reset Email"))
}
export const ResetPassword = async (req, res, next) => {
    const { email, resetCode, password } = req.body;
    const user = await UserModel.findOne({ email, confirmed: true ,isLoggedIn:false });
    if (!user) return next(new Error("User Notfound"));
    if (resetCode !== user.resetPasawordCode || Date.now() > user.resetExpiresTimer) return res.status(400).json({ message: 'Invalid or expired reset code' });
    const hashedPassword = hashingFunction({ payload: password })
    await UserModel.findOneAndUpdate({ email, confirmed: true,isLoggedIn:false },{password : hashedPassword,resetPasawordCode:"",resetExpiresTimer:""})
    res.status(200).json({message:"Password Reset Done"})
}
export const uploadUserProfile= async (req, res, next) => {
    if (!req.file) next(new Error("Please Upload Picture", { cause: 400 }))
    const { _id } = req.user
    const customName = nanoid(5)
    const { secure_url } = await Cloudinary.uploader.upload(req.file.path, {
        folder: `Pictures/Users/${customName}/Profile`
    })
    const user = await UserModel.findByIdAndUpdate(_id, { profilePicture: secure_url })
    if (!user) next(new Error("User Notfound"))
    res.status(200).json({ message: "Done" })
}