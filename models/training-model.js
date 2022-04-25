const mongoose = require("mongoose");

const trainingSchema = new mongoose.Schema({
  date_begin:{type:Date,required:true,default:Date.now},
  subject: {type: String, required: true, unique: true},
  description:{type:String,required:false,default:""},
  room:{type:String,required:true,default:"",enum:["A10","A20","A30","A40","A50","A60","A70","A80","A90"]},
  status:{type:String,default:"not yet",required:true,enum:[
      "not yet",
      "closed",
      "in progress",
      "canceled"
  ]},
  trainer:{type:mongoose.Schema.Types.ObjectId,ref:"User",required:true},
  presences:[{type:mongoose.Schema.Types.ObjectId,ref:"User",required:false}],
  absences:[{type:mongoose.Schema.Types.ObjectId,ref:"User",required:false}],
  interested_members:[{type:mongoose.Schema.Types.ObjectId,ref:"User",required:false}],
  quiz:{type:mongoose.Schema.Types.ObjectId,ref:"Quiz",required:false}
  
});

const trainingModel = mongoose.model('Training', trainingSchema);
module.exports=trainingModel;