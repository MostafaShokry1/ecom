import { v2 as cloudinary } from 'cloudinary'
import express from 'express'
import dotenv from 'dotenv'
import bootstrap from './src/bootstrap.js'
import connectToDb from './db/connection.js'

dotenv.config()

cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
})


const app = express()
const port = +process.env.PORT

connectToDb()
bootstrap(app)

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
