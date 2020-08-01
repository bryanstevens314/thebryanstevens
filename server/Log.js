const fs = require('fs');
const Log = ((exports.Log = {}));

module.exports = Log

Log.infoStream = fs.createWriteStream('storage/system_audit.txt')

Log.get = async () => {
    try{
        const data = fs.readFileSync('storage/system_audit.txt')
        if(data.toString().length <= 0){
            return 'No Server Events.'
        }
        return data.toString()
    } catch(error){
        console.log(error)
    }
}
Log.info = async (ip, message) => {
    try{
        Log.infoStream.write(`${new Date().toDateString()} - ${message} - ${ip}<br>`)
    } catch(error){
        console.log(error)
    }
}
