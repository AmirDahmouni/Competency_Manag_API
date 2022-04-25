const mongoose = require("mongoose");


const questionSchema = new mongoose.Schema({
      question: { type: String, required: true },
      answers:[{
          answer:{type:String,required:true},
          score:{type:Number,required:true,enum:[0,50,100]}
      }]
});


const quizSchema = new mongoose.Schema({
  subject: { type: String, required: true },
  deadline:{type:Date,required:true},
  training:{type:mongoose.Schema.Types.ObjectId,ref:"Quiz",required:true},
  questions:[questionSchema]
});

const quizModel = mongoose.model('Quiz', quizSchema);
module.exports=quizModel;