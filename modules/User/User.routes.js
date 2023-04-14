import { Router } from "express";
import { auth } from "../../Middlewares/Authentication.js";
import { ValidationFunction } from "../../Middlewares/Validation.js";
import * as validators from "./User.validation.js";
import * as UserContoller from "./User.controller.js"
import { asyncHandler } from "../../Utils/ErrorHandling.js";
import { myMulter, validObject } from "../../Services/Multer.js";
const router =Router()
router.post("/signup",ValidationFunction(validators.signUpValidatinon),asyncHandler(UserContoller.signUp))
router.get("/confirmemail/:token",ValidationFunction(validators.confirmEmailValidation),asyncHandler(UserContoller.confirmEmail))
router.post("/login",ValidationFunction(validators.loginValidation),asyncHandler(UserContoller.logIn))
router.post("/logout",auth(),ValidationFunction(validators.logoutValidation),asyncHandler(UserContoller.logout))
router.delete("/deleteuser",auth(),ValidationFunction(validators.deleteUserValidation),asyncHandler(UserContoller.deleteUser))
router.patch("/updatepassword",auth(),ValidationFunction(validators.updatePasswordValidation),asyncHandler(UserContoller.updatePasswordAfterLogin))
router.post("/forgetpassword",ValidationFunction(validators.sendForgetPasswordEmailValidation),asyncHandler(UserContoller.sendForgetPasswordEmail))
router.post("/resetpassword",ValidationFunction(validators.resetPasswordValidation),asyncHandler(UserContoller.ResetPassword))
router.put("/update",auth(),ValidationFunction(validators.updateDataValidation),asyncHandler(UserContoller.updateData))
router.patch("/addProfilePic",myMulter({validation:validObject.image}).single("image"),auth(),ValidationFunction(validators.uploadUserPicValidation),asyncHandler(UserContoller.uploadUserProfile))
export default router;