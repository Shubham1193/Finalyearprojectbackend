// const mongoose = require('mongoose')
import mongoose from 'mongoose'

const userSchema = mongoose.Schema({
    username : {
        type : String,
        required : true,
        unique : true
    },
    email : {
        type : String,
        require : true,
        unique : true
    },
    password : {
        type : String,
        require : true
    },
    profilePicture : {
        type : String,
        default : 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png',
    },
    friends: {
        type : []
    }
})



export const User = mongoose.model('User' , userSchema)

