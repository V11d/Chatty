import jwt from 'jsonwebtoken'
import User from '../models/user.model.js'
import http_status from 'http-status'

export const is_logged_in = async (req, res, next) => {
    try {
        const cookie = req.cookies.jwt
        if (!cookie) {
            return res.status(http_status.UNAUTHORIZED).json({message: "Unauthorized - No token provided."})
        }
        const decoded = jwt.verify(cookie, process.env.JWT_SECRET)
        if (!decoded) {
            return res.status(http_status.UNAUTHORIZED).json({message: "Unauthorized - Invalid token."})
        }
        const user = await User.findById(decoded.user_id).select('-password')
        if (!user) {
            return res.status(http_status.NOT_FOUND).json({message: "User does not exist."})
        }
        req.user = user
        next()
    } catch (err) {
        console.log(`Error in is_logged_in ${err.message}`)
        res.status(http_status.INTERNAL_SERVER_ERROR).json({message: "Internal server error."})
    }
}