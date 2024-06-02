const dbservice = require('../model/userModel');

const userService = {};

userService.insertData = async (data) => {
    try {
        let insertForm = await dbservice.insertUsermdata(data);
        if (insertForm) {
            return insertForm;
        } else {
            return "";
        }
    } catch (error) {
        throw new Error("Error in inserting data: " + error.message);
    }
};



userService.studentlogin = async (email,password) => {
    try {
        let insertForm = await dbservice.chekStudentlogin(email,password);
        if (insertForm) {
            return insertForm;
        } else {
            return "";
        }
    } catch (error) {
        throw new Error("Error in Login: " + error.message);
    }
};

userService.teacherlogin = async (email,password) => {
    try {
        let insertForm = await dbservice.checkteacherlogin(email,password);
        if (insertForm) {
            return insertForm;
        } else {
            return "";
        }
    } catch (error) {
        throw new Error("Error in Login: " + error.message);
    }
};

userService.userData = async (id) => {
    try {
        let insertForm = await dbservice.findUser(id);
        if (insertForm) {
            return insertForm;
        } else {
            return "";
        }
    } catch (error) {
        throw new Error("Error in Login: " + error.message);
    }
};

userService.InsertTest = async (data) => {
    try {
        let inserttest = await dbservice.inserTestData(data);
        if (inserttest) {
            return inserttest;
        } else {
            return "";
        }
    } catch (error) {
        throw new Error("Error in inserting data: " + error.message);
    }
};

userService.testData = async () => {
    try {
        let tests = await dbservice.findTestData();
        if (tests) {
            return tests;
        } else {
            return "";
        }
    } catch (error) {
        throw new Error("Error in finding test: " + error.message);
    }
};

userService.inserExamtData = async (data,id) => {
    try {
       
        let insertexamdata = await dbservice.insertexamdata(data);
   
        if (insertexamdata) {
            return insertexamdata;
        } else {
            return " data added successfully";
        }
    } catch (error) {
        throw new Error("Error in inserting data: " + error.message);
    }
};

userService.getUserResult=async(id)=>{
    try{
        let data=await dbservice.getUserResultTable(id);
        return data;
    }catch (error) {
        throw new Error("Error in inserting data: " + error.message);
    }
}
userService.getDatausingCategory=async(category)=>{
    try{
        let data=await dbservice.getTestsDataUsingCategory(category);
        return data;
    }catch (error) {
        throw new Error("Error in inserting data: " + error.message);
    }
}

userService.teacherTestData=async(id)=>{
    try{
        let data=await dbservice.teachertestData(id);
        return data;
    }catch (error) {
        throw new Error("Error in getting data: " + error.message);
    }

}
userService.binTestData=async(id)=>{
    try{
        let data=await dbservice.binTestData(id);
        return data;
    }catch (error) {
        throw new Error("Error in getting data: " + error.message);
    }  
}
userService.deleteTestData=async (testId)=>{
    try{
        let data=await dbservice.deleteTestDatas(testId);
        return data;
    }catch (error) {
        throw new Error("Error in deleting tests data: " + error.message);
    }
}
userService.deleteTestDataPermanently=async(testId)=>{
    try{
        let data=await dbservice.deleteTestDataspermanent(testId);
        return data;
    }catch (error) {
        throw new Error("Error in deleting tests data: " + error.message);
    }
}
userService.undoDeletedExam=async(testId)=>{
    try{
        let data=await dbservice.undoDeletedTest(testId);
        return data;
    }catch (error) {
        throw new Error("Error in restoring the data : " + error.message);
    } 
}



userService.getadminsubcribers=async(testId,studentId)=>{
    try{
        let data=await dbservice.getsubcribersfromtestid(testId,studentId);
        return data;
    }catch (error) {
        throw new Error("Error in geting subcribers: " + error.message);
    }
}


userService.insertsubcriber = async (data) => {
    try {
        let insertsubdata=await dbservice.addsubcriberinteacher(data);
        return insertsubdata

    } catch (error) {
        throw new Error("Error in inserting data: " + error.message);
    }
};



userService.removeSubscriber = async (data) => {
    try {
        // Logic to remove the subscriber from the teacher's subscribers list
        let removeSubData = await dbservice.removesubcriberfromteacher(data);
        return removeSubData

    } catch (error) {
        throw new Error("Error in removing subscriber: " + error.message);
    }
};

userService.studentsubcriptions = async (id) => {
    try {
        let insertForm = await dbservice.findSubscriptions(id);
        if (insertForm) {
            return insertForm;
        } else {
            return "";
        }
    } catch (error) {
        throw new Error("Error in Login: " + error.message);
    }
};


userService.allcretares = async (id) => {
    try {
        let creaters = await dbservice.findallCreaters(id);
        if (creaters) {
            return creaters;
        } else {
            return "";
        }
    } catch (error) {
        throw new Error("Error in finding test: " + error.message);
    }
};


userService.updateData = async (data) => {
    try {
        let insertuserdata = await dbservice.updateUsermdata(data);
        if (insertuserdata) {
            return insertuserdata;
        } else {
            return "";
        }
    } catch (error) {
        throw new Error("Error in inserting data: " + error.message);
    }
};

userService.allcretaresforhomepage = async (id) => {
    try {
        let creaters = await dbservice.findallCreatersforHomepage();
        if (creaters) {
            return creaters;
        } else {
            return "";
        }
    } catch (error) {
        throw new Error("Error in finding test: " + error.message);
    }
};


module.exports = userService;
