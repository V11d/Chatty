import cloudinary from "../lib/cloudinary.js"
import { generate_token } from "../lib/utils.js"
import User from "../models/user.model.js"
import bcrypt from 'bcryptjs'
import http_status from 'http-status'

export const signup = async (req, res) => {
    const {user_name, email, password} = req.body
    try {
        if (!user_name || !email || !password) {
            return res.status(http_status.BAD_REQUEST).json({message: "All fields are required."})
        }
        if (password.length < 6) {
            return res.status(400).json({message: "password length cannot be lower than 6 characters."})
        }
        const user = await User.findOne({email})
        // If user already exsists
        if (user) {
            return res.status(http_status.BAD_REQUEST).json({message: "User already exsists."})
        }
        const salt = await bcrypt.genSalt(10)
        const hashed_password = await bcrypt.hash(password, salt)
        const new_user = new User({
            email: email,
            user_name: user_name,
            password: hashed_password
        })
        // If new user is created than send the token else give error
        if (new_user) {
            generate_token(new_user._id, res)
            await new_user.save()
            res.status(http_status.CREATED).json({_id: new_user._id, username: new_user.user_name, email: new_user.email, profile_pic: new_user.profile_pic})
        } else {
            return res.status(http_status.BAD_REQUEST).json({message: "Invalid user credentials."})
        }
    } catch (err) {
        console.log(`Error in signup controller ${err}`)
        res.status(http_status.INTERNAL_SERVER_ERROR).json({message: "Internal server error"})
    }
}

export const login = async (req, res) => {
    const {email, password} = req.body
    try {
        const user = await User.findOne({email})
        if (!user) {
            return res.status(http_status.BAD_REQUEST).json({message: "User doen't exist."})
        }
        const is_password_correct = await bcrypt.compare(password, user.password)
        if (!is_password_correct) {
            return res.status(http_status.BAD_REQUEST).json({message: "Invalid email and password."})
        }
        generate_token(user._id, res)
        res.status(http_status.OK).json({_id: user._id, user_name: user.user_name, email: user.email, profile_pic: user.profile_pic})
    } catch (err) {
        console.log(`Error in login route ${err}`)
        res.status(http_status.INTERNAL_SERVER_ERROR).json({message: "Internal server error."})
    }
}

export const logout = async (req, res) => {
    try {
        res.cookie('jwt', '', {maxAge: 0})
        res.status(http_status.OK).json({message: "You logged out successfully."})
    } catch (err) {
        console.log(`Error in logout route ${err}`)
        res.status(http_status.INTERNAL_SERVER_ERROR).json({message: "Internal server error."})
    }
}

export const update_profile = async (req, res) => {
    try {
        const {profile_pic} = req.body
        const user_id = req.user._id
        if (!profile_pic) {
            return res.status(http_status.BAD_REQUEST).json({message: "Profile picture is required."})
        }
        const upload_response = await cloudinary.uploader.upload(profile_pic)
        const updated_user = await User.findByIdAndUpdate(user_id, {profile_pic: upload_response.secure_url}, {new: true})
        res.status(http_status.OK).json(updated_user)
    } catch (err) {
        console.log(`Error in update profile ${err.message}`)
        res.status(http_status.INTERNAL_SERVER_ERROR).json({message: "Internal server error."})
    }
}

export const check_auth = (req, res) => {
    try {
        res.status(http_status.OK).json(req.user)
    } catch (err) {
        console.log(`Error in check auth ${err}`)
        res.status(http_status.INTERNAL_SERVER_ERROR).json({message: "Internal server error"})
    }
}