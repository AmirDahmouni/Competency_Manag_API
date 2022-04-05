

const fileSize = (data, maxSize) => {
    console.log('in  file size', data.length / 1048576);
    if (data.length / 1048576 > maxSize) return false
}
module.exports=fileSize;