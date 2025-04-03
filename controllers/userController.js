import Problem from "../models/questionModel.js";
import Submission from "../models/submissionSchema.js";
import { User } from '../models/userModel.js';
import { Friends } from '../models/friendsModel.js'; // Import the new Friends model

export const problems = async(req, res, next) => {
    const problems = await Problem.find();
    res.status(200).send(problems);
};

export const submissions = async (req, res, next) => {
    try {
      const id = req.headers.id;
      const submissionsData = await Submission.find({ userId: id }).populate("questionId");
      res.status(200).send(submissionsData);
    } catch (error) {
      res.status(500).json({ error: "Error fetching submissions" });
    }
};

export const singleProblem = async(req, res, next) => {
    const id = req.params.id;
    console.log(id);
    const problem = await Problem.findById(id);
    res.status(200).send(problem);
};

export const friends = async (req, res, next) => {
    try {
        const { name } = req.params;
        console.log(name)
        // First, find the user to get their ID
        const user = await User.findOne({ username: name });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        
        // Then, find their friends data and populate the friends array with user details
        const friendsData = await Friends.findOne({ userId: user._id })
            .populate({
                path: 'friends',
                select: 'username email profilePicture'
            });
            
        if (!friendsData) {
            return res.status(404).json({ message: "Friends data not found" });
        }
        
        res.status(200).json({ friends: friendsData.friends });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

// Search for users by username
export const searchUsers = async (req, res) => {
    const { query } = req.params;
    try {
        const users = await User.find({ username: { $regex: query, $options: 'i' } })
            .select(['username', 'profilePicture'] )
            .limit(10)
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Send a friend request
export const sendFriendRequest = async (req, res) => {
  const { sender, receiver } = req.body;
  try {
    // Get both users
    const senderUser = await User.findOne({ username: sender });
    const receiverUser = await User.findOne({ username: receiver });

    if (!senderUser || !receiverUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Get or create friends data for both users
    let senderFriends = await Friends.findOne({ userId: senderUser._id });
    let receiverFriends = await Friends.findOne({ userId: receiverUser._id });

    // Create friends document if it doesn't exist for sender
    if (!senderFriends) {
      senderFriends = new Friends({
        userId: senderUser._id,
        friends: [],
        friendRequestsSent: [],
        friendRequestsReceived: []
      });
    }

    // Create friends document if it doesn't exist for receiver
    if (!receiverFriends) {
      receiverFriends = new Friends({
        userId: receiverUser._id,
        friends: [],
        friendRequestsSent: [],
        friendRequestsReceived: []
      });
    }

    // Check if already friends
    if (senderFriends.friends.some(id => id.toString() === receiverUser._id.toString())) {
      return res.status(400).json({ message: 'Already friends' });
    }

    // Check if request already sent
    if (senderFriends.friendRequestsSent.some(id => id.toString() === receiverUser._id.toString())) {
      return res.status(400).json({ message: 'Request already sent' });
    }

    // Add to appropriate arrays
    senderFriends.friendRequestsSent.push(receiverUser._id);
    receiverFriends.friendRequestsReceived.push(senderUser._id);
    
    await senderFriends.save();
    await receiverFriends.save();
    console.log("friend request sent");

    res.status(200).json({ message: 'Friend request sent' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get pending friend requests (sent and received)
export const getPendingRequests = async (req, res) => {
    const { username } = req.params;
    try {
        // Find user
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Find and populate friends data
        const friendsData = await Friends.findOne({ userId: user._id })
            .populate('friendRequestsSent', 'username profilePicture')
            .populate('friendRequestsReceived', 'username profilePicture');
            
        if (!friendsData) {
            return res.status(404).json({ message: 'Friends data not found' });
        }
        
        res.status(200).json({
            sent: friendsData.friendRequestsSent,
            received: friendsData.friendRequestsReceived,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Accept a friend request
export const acceptFriendRequest = async (req, res) => {
    const { acceptor, sender } = req.body;
    try {
        // Find both users
        const acceptorUser = await User.findOne({ username: acceptor });
        const senderUser = await User.findOne({ username: sender });

        if (!acceptorUser || !senderUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Find friends data for both users
        const acceptorFriends = await Friends.findOne({ userId: acceptorUser._id });
        const senderFriends = await Friends.findOne({ userId: senderUser._id });

        if (!acceptorFriends || !senderFriends) {
            return res.status(404).json({ message: 'Friends data not found' });
        }

        // Check if request exists
        const requestExists = acceptorFriends.friendRequestsReceived.some(id => 
            id.toString() === senderUser._id.toString()
        );
        
        if (!requestExists) {
            return res.status(400).json({ message: 'No pending request' });
        }

        // Add to friends lists
        acceptorFriends.friends.push(senderUser._id);
        senderFriends.friends.push(acceptorUser._id);
        
        // Remove from request lists
        acceptorFriends.friendRequestsReceived = acceptorFriends.friendRequestsReceived.filter(
            id => id.toString() !== senderUser._id.toString()
        );
        
        senderFriends.friendRequestsSent = senderFriends.friendRequestsSent.filter(
            id => id.toString() !== acceptorUser._id.toString()
        );

        await acceptorFriends.save();
        await senderFriends.save();

        res.status(200).json({ message: 'Friend request accepted' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Cancel a sent friend request
export const cancelFriendRequest = async (req, res) => {
    const { sender, receiver } = req.body;
    try {
        // Find both users
        const senderUser = await User.findOne({ username: sender });
        const receiverUser = await User.findOne({ username: receiver });

        if (!senderUser || !receiverUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Find friends data for both users
        const senderFriends = await Friends.findOne({ userId: senderUser._id });
        const receiverFriends = await Friends.findOne({ userId: receiverUser._id });

        if (!senderFriends || !receiverFriends) {
            return res.status(404).json({ message: 'Friends data not found' });
        }

        // Check if request exists
        const requestExists = senderFriends.friendRequestsSent.some(id => 
            id.toString() === receiverUser._id.toString()
        );
        
        if (!requestExists) {
            return res.status(400).json({ message: 'No request sent' });
        }

        // Remove from request lists
        senderFriends.friendRequestsSent = senderFriends.friendRequestsSent.filter(
            id => id.toString() !== receiverUser._id.toString()
        );
        
        receiverFriends.friendRequestsReceived = receiverFriends.friendRequestsReceived.filter(
            id => id.toString() !== senderUser._id.toString()
        );

        await senderFriends.save();
        await receiverFriends.save();

        res.status(200).json({ message: 'Friend request canceled' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};


/// instead of keeping directly name i kept id because what if i add profile name change then what we had to 
// to change both in user friends list and friends table // thats why if kept only id then no need to change 
/// id 