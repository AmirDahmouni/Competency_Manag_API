const mongoose = require("mongoose");

const certificateSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type:{type:String,required:true},
  domain:{type:String,required:true},
  status:{type:Boolean,required:true,default:true},
  owners:[{type:mongoose.Schema.Types.ObjectId,ref:"User"}]
  
});

const certificateModel = mongoose.model('Certificate', certificateSchema);
module.exports=certificateModel;