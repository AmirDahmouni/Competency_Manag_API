
const mongoose = require("mongoose");
const ConvertStrToObjectId = (str) => {
    var array=str.slice(1, -1).split(",");
    objectIdArray = array.map(s => mongoose.Types.ObjectId(s));
    return objectIdArray
}
module.exports=ConvertStrToObjectId;