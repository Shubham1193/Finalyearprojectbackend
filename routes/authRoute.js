import express from 'express'
import { google} from '../controllers/authControllers.js'

// const express = require('express')
// const {google} = requier('../controllers/authControllers.js')
const router = express.Router()

router.post('/google' , google)

export default router