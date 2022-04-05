const acceptableImage =require('./accept-file');
const fileSize =require('./file-size');
const mkdirp = require('mkdirp')
const fs=require("fs")

const uploadImage = async (directory,name, file, type = "any", maxSize = 5242880) => {
  try {
    
    if(type=='image' && !acceptableImage(file.mimetype)) return "error"
    if(file.data.length/maxSize>1) return "error"
    
    const made = await mkdirp(directory)
    const file_path = `./${directory}/${name}-${file.name}`;
    await file.mv(file_path)
    return file_path
  }
  catch (error) {    
    return "error"
  }
}


const uploadFile = async (directory,name, file, type = "any", maxSize = 5242880) => {
  try {
    
    if(type !=='pdf') return "error"
    if(file.data.length/maxSize>1) return "error"
    
    const made = await mkdirp(directory)
    const file_path = `./${directory}/${name}-${file.name}`;
    await file.mv(file_path)
    return file_path
  }
  catch (error) {    
    return "error"
  }
}


const deleteFile = async (path)=>{
  
  fs.unlink(path, (err) => {
    if (err) return false
    return true
  });

}



module.exports={ uploadImage,uploadFile,deleteFile}