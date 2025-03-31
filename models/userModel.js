import mongoose from 'mongoose';

const userSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  profilePicture: {
    type: String,
    default: 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png'
  },
  friends: {
    type: [String], // Array of usernames
    default: []
  },
  friendRequestsSent: {
    type: [String], // Array of usernames to whom requests were sent
    default: []
  },
  friendRequestsReceived: {
    type: [String], // Array of usernames from whom requests were received
    default: []
  }
});

export const User = mongoose.model('User', userSchema);