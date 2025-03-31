import mongoose from 'mongoose';

const egSchema = new mongoose.Schema({
  input: {},
  output: {},
  explanation : {}
});

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
  example : {
    type : [egSchema]
  },
  defaultcode : {

  },
  testCases: {

  },
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

