const { Schema } = require('mongoose');
const mongoose = require('mongoose')



const teacherSchema = Schema({  
    name: String,
    email: String, 
    password: String,
    mobileNumber: Number,
    subscribers:Array
}, { versionKey: false });

const studentSchema = Schema({  
    name: String,
    email: String, 
    password: String,
    mobileNumber: Number,
    subscriptions:Array
}, { versionKey: false });


const testSchema = Schema({  
    teacherId: mongoose.Schema.Types.ObjectId, // Assuming teacher ID is stored in teacherProfileData.id
    testName : String,
    testStatus: Boolean,
    totalMinutes : Number,
    category : String,
    questions: Array,
    totalMarks: Number,
    correctAnswers: Array,
    submitedBy: Array,
    teacherName:String
}, { versionKey: false });

const collection = {};



collection.getTeacherSchema = async () => {
    try {
        // const dbconnection = await mongoose.connect(url);
        const users = new mongoose.model('teacher', teacherSchema);
        return users;
    } catch (error) {
        const err = new Error("Could not add the data");
        err.status = 500;
        throw err;
    }
};

collection.getStudentSchema = async () => {
    try {
        // const dbconnection = await mongoose.connect(url);
        const users = new mongoose.model('student', studentSchema);
        return users;
    } catch (error) {
        const err = new Error("Could not add the data");
        err.status = 500;
        throw err;
    }
};

collection.gettestSchema = async () => {
    try {
        // const dbconnection = await mongoose.connect(url);
        const test = new mongoose.model('test', testSchema);
        return test;
    } catch (error) {
        const err = new Error("Could not add the data");
        err.status = 500;
        throw err;
    }
};


module.exports = collection;
