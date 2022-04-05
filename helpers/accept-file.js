
const acceptableImage = (mime, types=[])=>{
    
    if(!types.length || types==[]) return mime.match('image.*');
  
    for (let i = 0; i < types.length; i++) {
      if(mime.match(types[i])!=null) return true;
    }
    return false
  }
  
  module.exports=acceptableImage;