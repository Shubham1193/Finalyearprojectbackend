import Problem from "../models/questionModel.js";
import Submission from "../models/submissionSchema.js";
import {User} from '../models/userModel.js'

export const problems = async(req,res,next) => {
    const problems = await Problem.find()
    // console.log(problems)
    res.status(200).send(problems)
}



export const submissions = async (req, res, next) => {
    try {
      const id = req.headers.id;
      // Populate the 'questionId' field to include additional data from the Problem collection
      const submissionsData = await Submission.find({ userId: id }).populate("questionId");
      res.status(200).send(submissionsData);
    } catch (error) {
      res.status(500).json({ error: "Error fetching submissions" });
    }
  };
  

export const singleProblem = async(req,res,next) => {
    const id = req.params.id
    console.log(id)
    const problem = await Problem.findById(id)
    res.status(200).send(problem)
}

export const friends = async (req, res, next) => {
    try {
        const { name } = req.params;  // Extract name from params
        // console.log(name);

        const user = await User.findOne({ username : name }).populate('friends'); // Assuming you have a friends field
        // console.log(user)
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // console.log(user.friends);
        res.status(200).json({ friends: user.friends });
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
      .select('username')
      .limit(10); // Limit results for performance
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Send a friend request
export const sendFriendRequest = async (req, res) => {
  const { sender, receiver } = req.body;
  try {
    const senderUser = await User.findOne({ username: sender });
    const receiverUser = await User.findOne({ username: receiver });

    if (!senderUser || !receiverUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    if (senderUser.friends.includes(receiver)) {
      return res.status(400).json({ message: 'Already friends' });
    }
    if (senderUser.friendRequestsSent.includes(receiver)) {
      return res.status(400).json({ message: 'Request already sent' });
    }

    senderUser.friendRequestsSent.push(receiver);
    receiverUser.friendRequestsReceived.push(sender);
    await senderUser.save();
    await receiverUser.save();

    res.status(200).json({ message: 'Friend request sent' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Get pending friend requests (sent and received)
export const getPendingRequests = async (req, res) => {
  const { username } = req.params;
  try {
    const user = await User.findOne({ username }).select('friendRequestsSent friendRequestsReceived');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({
      sent: user.friendRequestsSent,
      received: user.friendRequestsReceived,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Accept a friend request
export const acceptFriendRequest = async (req, res) => {
  const { acceptor, sender } = req.body;
  try {
    const acceptorUser = await User.findOne({ username: acceptor });
    const senderUser = await User.findOne({ username: sender });

    if (!acceptorUser || !senderUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    if (!acceptorUser.friendRequestsReceived.includes(sender)) {
      return res.status(400).json({ message: 'No pending request' });
    }

    acceptorUser.friends.push(sender);
    senderUser.friends.push(acceptor);
    acceptorUser.friendRequestsReceived = acceptorUser.friendRequestsReceived.filter(
      (req) => req !== sender
    );
    senderUser.friendRequestsSent = senderUser.friendRequestsSent.filter(
      (req) => req !== acceptor
    );

    await acceptorUser.save();
    await senderUser.save();

    res.status(200).json({ message: 'Friend request accepted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Cancel a sent friend request
export const cancelFriendRequest = async (req, res) => {
  const { sender, receiver } = req.body;
  try {
    const senderUser = await User.findOne({ username: sender });
    const receiverUser = await User.findOne({ username: receiver });

    if (!senderUser || !receiverUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    if (!senderUser.friendRequestsSent.includes(receiver)) {
      return res.status(400).json({ message: 'No request sent' });
    }

    senderUser.friendRequestsSent = senderUser.friendRequestsSent.filter(
      (req) => req !== receiver
    );
    receiverUser.friendRequestsReceived = receiverUser.friendRequestsReceived.filter(
      (req) => req !== sender
    );

    await senderUser.save();
    await receiverUser.save();

    res.status(200).json({ message: 'Friend request canceled' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

