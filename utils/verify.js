import jwt from 'jsonwebtoken'
import { errorHandler } from './error.js'


export const verifyToken = (req,res,next) => {
    const token = req.headers.authorization
    if(!token){
        return next(errorHandler(401 , 'Unauthorized'))
    }
    jwt.verify(token , process.env.JWT_SECRET , (err , user) => {
        if(err){
            return next(errorHandler(401 , 'Unathorized'))
        }
        req.user = user
        next()
    })
}