import express from 'express'
import { problems , singleProblem, submissions , friends , searchUsers , sendFriendRequest , getPendingRequests , acceptFriendRequest , cancelFriendRequest} from '../controllers/userController.js'

const router = express.Router()

router.get('/problems' , problems)
router.get('/problem/:id' , singleProblem)
router.get('/submission' , submissions)
router.get('/friends/:name', friends);
router.get('/search/:query', searchUsers); // Search users
router.post('/friend-request/send', sendFriendRequest); // Send friend request
router.get('/friend-requests/:username', getPendingRequests); // Get pending requests
router.post('/friend-request/accept', acceptFriendRequest); // Accept request
router.post('/friend-request/cancel', cancelFriendRequest); // Cancel sent request

export default router