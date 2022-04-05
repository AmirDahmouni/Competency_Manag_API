const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description:{type:String,required:true},
  logo:{type:String,required:false},
  deadline:{type:Date,required:true},
  budget:{type:Number,required:true,default:0},
  progress:{type:Number,required:true,default:0},
  status:{type:String,required:true,enum:["in progress","closed"],default:"in progress"},
  manager:{type:mongoose.Schema.Types.ObjectId,ref:"User",required:true},
  developers:[{type:mongoose.Schema.Types.ObjectId,ref:"User",required:true}],
  client:{type:mongoose.Schema.Types.ObjectId,ref:"Client",required:true},
  technologies:[{type:mongoose.Schema.Types.ObjectId,ref:"Technology",required:true}]
});

const projectModel = mongoose.model('Project', projectSchema);
module.exports=projectModel;