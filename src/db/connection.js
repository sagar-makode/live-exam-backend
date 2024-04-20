const mongoose = require('mongoose')
const dotenv = require('dotenv')
dotenv.config({
    path: './.env'
})

const url = process.env.MONGODBURL

const connectDB = async () =>{
    try {
  
        const connectionInstance = await mongoose.connect(url, { dbName: 'exam-portal'})
        // console.log(`\n MongoDB connected !! DB HOST:  ${connectionInstance.connection.host}`);
    } catch (error) {
        console.log(`mongoose connection error`, error);
        process.exit(1);        
    }
}

module.exports = connectDB
