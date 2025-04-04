import mongoose from 'mongoose';

const submissionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  questionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Problem',
    required: true
  },
  code: {
    type: String,
    required: true
  },
  language: {
    type: String,
    required: true
  },
  result: {
    type: Object,
    required: true
  },
  status: {
    type: String,
    required: true
  }
}, { timestamps: true });

const Submission = mongoose.model('Submission', submissionSchema);

export default Submission;
