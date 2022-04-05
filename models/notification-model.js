const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  title: { type: String, required: true },
  type:{type:String,required:true,enum:["quiz","training","project","mission"]},
  viewed:{type:Boolean,required:true,default:false},
  notification:{type:mongoose.Schema.Types.ObjectId}
});

const notificationModel = mongoose.model('Notification', notificationSchema);
module.exports=notificationModel;