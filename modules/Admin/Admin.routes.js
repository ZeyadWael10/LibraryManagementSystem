import { Router } from "express";
import { adminAuth } from "../../Middlewares/Authentication.js";
import { ValidationFunction } from "../../Middlewares/Validation.js";
import * as validators from "./Admin.validation.js";
import * as AdminContoller from "./Admin.controller.js"
import { asyncHandler } from "../../Utils/ErrorHandling.js";
const router =Router()
router.post("/signup",ValidationFunction(validators.signUpValidatinon),asyncHandler(AdminContoller.signUp))
router.post("/login",ValidationFunction(validators.loginValidation),asyncHandler(AdminContoller.logIn))
router.post("/logout",adminAuth(),ValidationFunction(validators.logoutValidation),asyncHandler(AdminContoller.logout))
router.delete("/deleteadmin",adminAuth(),ValidationFunction(validators.deleteUserValidation),asyncHandler(AdminContoller.deleteAdmin))
router.patch("/updatepassword",adminAuth(),ValidationFunction(validators.updatePasswordValidation),asyncHandler(AdminContoller.updatePassword))
export default router;