import express from 'express'
import { problems , singleProblem, submissions , friends} from '../controllers/userController.js'

const router = express.Router()

router.get('/problems' , problems)
router.get('/problem/:id' , singleProblem)
router.get('/submission' , submissions)
router.get('/friends/:name', friends);

export default router