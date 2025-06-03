import mongoose from 'mongoose'

const user_schema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        required: true
    },
    user_name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
        minlength: 5
    },
    profile_pic: {
        type: String,
        default: ''
    }
}, { timestamps: true })

const User = mongoose.model('User', user_schema)

export default User