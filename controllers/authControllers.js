import {User} from '../models/userModel.js'
import bcryptjs from 'bcryptjs'
import jwt from "jsonwebtoken"




  export const google = async (req, res, next) => {
    const { username , email , googlePhotoUrl } = req.body;
    console.log(email , username , googlePhotoUrl)
    try {
      const user = await User.findOne({ email });
      if (user) {
        const token = jwt.sign(
          { id: user._id, isAdmin: user.isAdmin },
          process.env.JWT_SECRET
        );
        // const { password, ...rest } = user._doc;
        const { password, ...rest } = user._doc;
        const response = {token , ...rest}
        res
          .status(200).json(response);
      } else {
        const generatedPassword =
          Math.random().toString(36).slice(-8) +
          Math.random().toString(36).slice(-8);
        const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);
        const newUser = new User({
          username:
            username.toLowerCase().split(' ').join('') +
            Math.random().toString(9).slice(-4),
          email,
          password: hashedPassword,
          profilePicture: googlePhotoUrl,
        });
        await newUser.save();
        const token = jwt.sign(
          { id: newUser._id, isAdmin: newUser.isAdmin },
          process.env.JWT_SECRET
        );
        const { password, ...rest } = newUser._doc;
        const response = {token , ...rest}
        res.status(200).json(response);
      }
    } catch (error) {
      next(error);
    }
  };