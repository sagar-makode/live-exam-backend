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
        let data = await findtestData.find({}, { submitedBy: 0, correctAnswers: 0, teacherId: 0 });
        let jsonData = [];
        for (let i = 0; i < data.length; i++) {
            if (!data[i].testStatus) {
                jsonData.push(data[i]);
            }
        }
        return jsonData;


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
        const testData = await findtestData.find({}, { submitedBy: 1 });
        for (let i = 0; i < testData.length; i++) {
            for (let j = 0; j < testData[i].submitedBy.length; j++) {

                if (testData[i].submitedBy[j].submitterId == id) {
                    data.push(testData[i].submitedBy[j])
                }
            }
        }


        return data;

    } catch (error) {
        throw new Error("Error in inserting form data: " + error.message);
    }
}


userModel.getTestsDataUsingCategory = async (category) => {
    try {
        let data = []
        let findtestData = await dbmodel.gettestSchema();
        const testData = await findtestData.find({});
        for (let i = 0; i < testData.length; i++) {
            if (testData[i].category == category) {
                data.push(testData);
            }
        }
        return data;

    } catch (error) {
        throw new Error("Error in inserting form data: " + error.message);
    }
}

userModel.teachertestData = async (id) => {
    try {
        let findtestData = await dbmodel.gettestSchema();
        const testData = await findtestData.find({ teacherId: id });

        let jsonData = [];
        for (let i = 0; i < testData.length; i++) {

            if (!testData[i].testStatus) {
                jsonData.push(testData[i]);
            }
        }
        return jsonData;

    } catch (error) {
        throw new Error("Error in inserting form data: " + error.message);
    }
}
userModel.binTestData = async (id) => {
    try {
        let findtestData = await dbmodel.gettestSchema();
        const testData = await findtestData.find({ teacherId: id });
        let jsonData = [];
        for (let i = 0; i < testData.length; i++) {
            if (testData[i].testStatus) {
                jsonData.push(testData[i]);
            }
        }
        return jsonData;
    } catch (error) {
        throw new Error("Error in inserting form data: " + error.message);
    }
}


// for Deleting any test
userModel.deleteTestDatas = async (testId) => {

    try {
        let testModel = await dbmodel.gettestSchema();
        const doc = await testModel.findById(testId);
        if (!doc) {
            return res.status(404).json({ message: 'Document not found' });
        }

        doc.testStatus = true;
        // Save the updated document
        await doc.save();

        return ("Document Moved in trash ending with testId: " + testId);

    } catch (error) {
        throw new Error("Error in inserting form data: " + error.message);
    }
}
userModel.deleteTestDataspermanent = async (testId) => {
    try {
        const testModel = await dbmodel.gettestSchema();


        // Delete the document with the specified testId
        const doc = await testModel.deleteOne({ "_id": testId });

        // If no document was found with the given testId, return a 404 response
        if (!doc) {
            return res.status(404).json({ message: 'Document not found' });
        }

        return ("Test Document Deleted with TestId: " + testId);

    } catch (error) {
        throw new Error("Error in inserting form data: " + error.message);
    }

}

//For undo Delete Tests 
userModel.undoDeletedTest = async (testId) => {
    try {
        let testModel = await dbmodel.gettestSchema();
        const doc = await testModel.findById(testId);

        if (!doc) {
            return res.status(404).json({ message: 'Document not found' });
        }
        doc.testStatus = false;
        // Save the updated document
        await doc.save();

        return "document added in all created test with test id: " + testId;

    } catch (error) {
        throw new Error("Error in inserting form data: " + error.message);
    }
}







userModel.getsubcribersfromtestid = async (testId, studentId) => {
    try {
        let findtestData = await dbmodel.gettestSchema();
        const test = await findtestData.findOne({ _id: testId });


        const teacherId = test.teacherId;


        const teacherProfileModel = await dbmodel.getTeacherSchema();
        const teacherProfile = await teacherProfileModel.findOne({ _id: teacherId }, { email: 0, password: 0, mobileNumber: 0 });
        const isSubscribed = teacherProfile.subscribers.includes(studentId);

        return { teacherProfile, isSubscribed }

    } catch (error) {
        throw new Error("Error in inserting form data: " + error.message);
    }

}


userModel.addsubcriberinteacher = async (data) => {
    try {
        const teacherProfile = await dbmodel.getTeacherSchema();
        const teacher = await teacherProfile.findById(data.teacherId);

        // Add studentId to teacher's subscribers array
        teacher.subscribers.push(data.studentId);

        // Save the updated teacher document
        await teacher.save();

        let studentModel = await dbmodel.getStudentSchema();
        const studentProfile = await studentModel.findById(data.studentId);
        // Add teacherId to student's subscriptions array
        studentProfile.subscriptions.push(data.teacherId);

        // Save the updated student document
        await studentProfile.save();

        return { success: true, message: `Added subscriber` };


    } catch (error) {
        throw new Error("Error in inserting subcriber: " + error.message);
    }

}


userModel.removesubcriberfromteacher = async (data) => {
    try {
        const teacherProfile = await dbmodel.getTeacherSchema();
        const studentProfile = await dbmodel.getStudentSchema();


        const teacher = await teacherProfile.findById(data.teacherId);

        // Find the index of the studentId in the subscribers array and remove it
        const index = teacher.subscribers.indexOf(data.studentId);
        if (index !== -1) {
            teacher.subscribers.splice(index, 1);

            // Save the updated teacher document
            await teacher.save();

            const student = await studentProfile.findById(data.studentId);
            // Find the index of the teacherId in the subscriptions array
            const teacherIndex = student.subscriptions.indexOf(data.teacherId);
            if (teacherIndex !== -1) {
                // Remove the teacherId from the subscriptions array
                student.subscriptions.splice(teacherIndex, 1);

                // Save the updated student document
                await student.save();

                return { success: true, message: `Removed subscriber and subscription` };
            }
        }

    } catch (error) {
        throw new Error("Error in removing subscriber: " + error.message);
    }
}




userModel.findSubscriptions = async (id) => {
    try {
        const teacherProfile = await dbmodel.getTeacherSchema();
        const teachers = await teacherProfile.find({ subscribers: id }, { _id: 0, email: 0, password: 0, mobileNumber: 0 });
        return teachers

    } catch (error) {
        // If any error occurs, rethrow it
        throw error;
    }
};


userModel.findallCreaters = async (id) => {
    try {

        let findcretaterData = await dbmodel.getTeacherSchema()
        //not sending the answers
        let data = await findcretaterData.find({}, { email: 0, password: 0, mobileNumber: 0 });
        let jsonData = [];
        for (let i = 0; i < data.length; i++) {
            isSubscribed = false
            if (data[i].subscribers && data[i].subscribers.includes(id)) {
                isSubscribed = true;

            }
            let plainObject = data[i].toObject();

            let createrwithsubcriptionstatus = { ...plainObject, isSubscribed };
            jsonData.push(createrwithsubcriptionstatus);
        }
        return jsonData;


    } catch (error) {
        throw new Error("Error in inserting form data: " + error.message);
    }
};

module.exports = userModel;
