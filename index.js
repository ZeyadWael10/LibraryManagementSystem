import { config } from "dotenv";
import cors from 'cors'
import express from "express";
import { ConnectionDB } from "./DB/Connection.js";
import { stackLocation } from "./Utils/ErrorHandling.js";
import * as Routers from "./modules/Index.routes.js"
const app = express()
config({ path: "./DB/Secret.env" });
ConnectionDB()
const BaseUrl = process.env.BASEURL
const Port = process.env.PORT || 8080
app.use(cors())
app.use(express.json())
app.use(`${BaseUrl}/user`, Routers.UserRouter)
app.use(`${BaseUrl}/book`, Routers.BookRouter)
app.use("*", (req, res) => res.json({ message: "Invalid Routing" }))
app.use((error, req, res, next) => {
    if (error) {
        res
        .status(error["cause"] || 500)
        .json({Error: error.message, Stack: stackLocation, StackResponse: error.stack })
    }
})
app.listen(Port, () => console.log(`App listening on Port ${Port}`))