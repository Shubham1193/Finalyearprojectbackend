import mongoose from 'mongoose';

// const testCaseSchema = new mongoose.Schema({
//   input: Object,
//   output: [Number]
// });

const problemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  input: {
    nums: {
      type: String,
      required: true
    },
    target: {
      type: String,
      required: true
    }
  },
  category : {
    type : String
  },
  tag : {
    type : String,
  },
  
  defaultcode : {},
  testCases: {},
  constraints: [String],
  category : {
    type : String
  },
  highlight : {
    type : String
  },
  difficulty : {
    type : String
  }
});

const Problem = mongoose.model('Problem', problemSchema);

export default Problem;

