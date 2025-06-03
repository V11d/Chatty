import mongoose from 'mongoose'
import dotenv from 'dotenv'
dotenv.config()

export const connect_to_db = async () => {
    try {
        const cn = await mongoose.connect(process.env.ATLAS_URL)
        console.log(`database connected: ${cn.connection.host}`)
    } catch (err) {
        console.log(`database connection error ${err}`)
    }
}