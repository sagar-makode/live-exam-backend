const dbmodel = require('../utilities/connections');
const userModel = {};


userModel.insertUsermdata = async (insdata) => {
    try {
        // let userModel = await dbmodel.getUserRegisterSchema();
        // let addData = await userModel.create(insdata);
        if (insdata.role === "Teacher") {
            let teacherData = await dbmodel.getTeacherSchema();
            await teacherData.create(insdata);
            return insdata
        }

        else {
            let studentData = await dbmodel.getStudentSchema()
            await studentData.create(insdata)

            return insdata
        }

    } catch (error) {
        throw new Error("Error in inserting form data: " + error.message);
    }
};





userModel.chekStudentlogin = async (email, password) => {
    try {
        // Retrieve user data by email
        let loginModel = await dbmodel.getStudentSchema();
        let user = await loginModel.findOne({ email: email })

        if (user) {
            if (user.password === password) {
                return { message: "Login Success", id: user._id }
            } else {
                return { message: "Please Enter Correcet Password" }
            }
        } else {
            return { message: "Please Enter Correct Email" }
        }

    } catch (error) {
        // If any error occurs, rethrow it
        throw error;
    }
};

userModel.checkteacherlogin = async (email, password) => {
    try {
        // Retrieve user data by email
        let loginModel = await dbmodel.getTeacherSchema();
        let user = await loginModel.findOne({ email: email })

        if (user) {
            if (user.password === password) {
                return { message: "Login Success", id: user._id }
            } else {
                return { message: "Please Enter Correcet Password" }
            }
        } else {
            return { message: "Please Enter Correct Email" }
        }

    } catch (error) {
        // If any error occurs, rethrow it
        throw error;
    }
};

userModel.findUser = async (id) => {
    try {
        // Retrieve user data by email
        let studentModel = await dbmodel.getStudentSchema();
        let student = await studentModel.findOne({ _id: id })
        if (student) {
            user = student.toObject(); // Convert Mongoose document to plain JavaScript object
            user.role = 'student';
           
            return user
        }

        let teacherModel = await dbmodel.getTeacherSchema();
        let teacher = await teacherModel.findOne({ _id: id })
        if (teacher) {
            user = teacher.toObject(); // Convert Mongoose document to plain JavaScript object
            user.role = 'teacher';
       
            return user
        }

        return "UserNot Found"


    } catch (error) {
        // If any error occurs, rethrow it
        throw error;
    }
};




userModel.inserTestData = async (data) => {
    try {

        let testData = await dbmodel.gettestSchema();
        await testData.create(data);
        return data


    } catch (error) {
        throw new Error("Error in inserting form data: " + error.message);
    }
};


userModel.findTestData = async () => {
    try {

        let findtestData = await dbmodel.gettestSchema();
        //not sending the answers
        let data = await findtestData.find({},{submitedBy:0, correctAnswers:0 , teacherId: 0});
        return data


    } catch (error) {
        throw new Error("Error in inserting form data: " + error.message);
    }
};


userModel.insertexamdata = async (insdata) => {

    try {
        let findtestData = await dbmodel.gettestSchema();
        const test = await findtestData.findById(insdata.testId);
       

         // Calculate score
         const userAnswers = insdata.userAnswers;
         const calculateScore = () => {
             let score = 0;
             userAnswers.forEach((answer, index) => {
                 if (answer === test.correctAnswers[index]) {
                     score += 1;
                 }
             });
             return score;
         };
         const correctAnswers = calculateScore();
         
         const totalQuestions = test.questions.length;
         const totalMarks = test.totalMarks;
         const obtainedMarks = (correctAnswers / totalQuestions) * totalMarks;

         const percentageObtained = (obtainedMarks / totalMarks) * 100;

         const newObtainmark = obtainedMarks.toFixed(2);
         const newpercentageObtained = percentageObtained.toFixed(2)
        //  // Determine pass or fail status
         const passPercentage = 60; // 60% passing threshold
         const passStatus = percentageObtained >= passPercentage ? 'Pass' : 'Fail';
 



         const submittedData = {
            userAnswers: insdata.userAnswers,
            testId: insdata.testId,
            name: insdata.name,
            testName: test.testName,
            submitterId: insdata.submitterId,
            totalQuestions: totalQuestions,
            correctAnswers: correctAnswers,
            totalMarks: totalMarks,
            obtainedMarks: newObtainmark,
            percentageObtained: newpercentageObtained,
            passStatus: passStatus
        };

        test.submitedBy.push(submittedData);
        await test.save();

        const retunData = {
            totalQuestions: totalQuestions,
            correctAnswers: correctAnswers,
            totalMarks: totalMarks,
            obtainedMarks: newObtainmark,
            percentageObtained: newpercentageObtained,
            passStatus: passStatus

        }
        return retunData;
    } catch (error) {
        throw new Error("Error in inserting form data: " + error.message);
    }
};

userModel.getUserResultTable = async (id) => {
    try {
        let data = []
        
        let findtestData = await dbmodel.gettestSchema();
        const testData = await findtestData.find ({},{submitedBy:1});
        for (let i = 0; i < testData.length; i++) {
            for (let j = 0; j < testData[i].submitedBy.length; j++) {
                
                if (testData[i].submitedBy[j].submitterId==id) {
                    data.push(testData[i].submitedBy[j])
                }
            }
        }
        
        
        return data;

    } catch (error) {
        throw new Error("Error in inserting form data: " + error.message);
    }
}


userModel.getTestsDataUsingCategory=async (category)=>{
    try {
        let data = []
        let findtestData = await dbmodel.gettestSchema();
        const testData = await findtestData.find ({});
        for(let i=0;i<testData.length;i++){
            if(testData[i].category==category){              
                data.push(testData);
            }
        }
        return data;

    } catch (error) {
        throw new Error("Error in inserting form data: " + error.message);
    }
}

userModel.teachertestData=async(id)=>{
    try {
       
        let findtestData = await dbmodel.gettestSchema();
        const testData = await findtestData.find ({teacherId: id});
       
        return testData;
    } catch (error) {
        throw new Error("Error in inserting form data: " + error.message);
    }
}


module.exports = userModel;
