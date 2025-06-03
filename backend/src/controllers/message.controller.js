import cloudinary from "../lib/cloudinary.js"
import Message from "../models/message.model.js"
import User from "../models/user.model.js"
import http_status from 'http-status'
import { get_receiver_socket_id, io } from "../lib/socket.js"

// Getting all the users to display in sidebar
export const get_all_users = async (req, res) => {
    try {
        const logged_in_user_id = req.user._id
        // To not display ourselves
        const filter_users = await User.find({_id: {$ne: logged_in_user_id}}).select('-password')
        res.status(http_status.OK).json(filter_users)
    } catch (err) {
        console.log(`Error in users ${err.message}`)
        res.status(http_status.INTERNAL_SERVER_ERROR).json({message: "Internal server error"})
    }
}

// Getting all the message of the user
export const get_all_messages = async (req, res) => {
    try {
        const {id: user_chat_id} = req.params
        const sender_id = req.user._id
        const messages = await Message.find({
            $or: [
                {sender_id: sender_id, receiver_id: user_chat_id},
                {sender_id: user_chat_id, receiver_id: sender_id}
            ]
        })
        res.status(http_status.OK).json(messages)
    } catch (err) {
        console.log(`Error in get all message ${err.message}`)
        res.status(http_status.INTERNAL_SERVER_ERROR).json({message: "Onternal server error."})
    }
}

export const send_message = async (req, res) => {
    try {
        const {text, image} = req.body
        const {id: receiver_id} = req.params
        const sender_id = req.user._id
        let img_url
        if (image) {
            const upload_response = await cloudinary.uploader.upload(image)
            img_url = upload_response.secure_url
        }
        const new_message = new Message({
            sender_id: sender_id,
            receiver_id: receiver_id,
            text: text,
            image: img_url
        })
        await new_message.save()
        const receiver_socket_id = get_receiver_socket_id(receiver_id)
        // If user is inline then send the message to them
        if (receiver_socket_id) {
            io.to(receiver_socket_id).emit('new_message', new_message)
        }
        res.status(http_status.CREATED).json(new_message)
    } catch (err) {
        console.log(`Error in send message ${err.message}`)
        res.status(http_status.INTERNAL_SERVER_ERROR).json({message: "Internal server error."})
    }
}