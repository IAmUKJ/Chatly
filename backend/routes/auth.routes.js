import express from 'express'
import { login, logOut, signUp } from '../controllers/auth.controllers.js'

const authRouter = express.Router()

authRouter.post("/Signup",signUp)
authRouter.post("/login",login)
authRouter.get("/logout",logOut)

export default authRouter