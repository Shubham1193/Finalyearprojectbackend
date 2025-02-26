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
        console.log(name);

        const user = await User.findOne({ username : name }).populate('friends'); // Assuming you have a friends field
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
