const express = require('express');
const router = express.Router();
const userService = require('../service/userService');
const jwt = require('jsonwebtoken');
const verifyJWT = require('../midalware/auth.midalware');
const dotenv   = require('dotenv')

const upload = require('../midalware/multer.middlewares');
const uploadOnCloudinary = require('../utilities/cloudinary')

dotenv.config({
  path: './.env'
})

const JWT_KEY = process.env.JWT_KEY


//Route 1: Registering Profile in Database (POST: "/register")
router.post('/register', async (req, res, next) => {
  try {
    const { name, email, password, mobileNumber, role } = req.body;
    let adduser = await userService.insertData({ name, email, password, mobileNumber, role });
    if (adduser) {
      res
        .status(200)
        .json({ 'message': "Successfully added" });
    }
  } catch (error) {
    res
      .status(400)
      .json("Something went wrong");
    //Going to the error handler middleware

  }
});


//Route 2: For Student Login (POST:"/studentlogin")
router.post('/studentlogin', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await userService.studentlogin(email, password);
    const token = jwt.sign({ userId: user.id }, JWT_KEY, { expiresIn: '1h' });

    if (!user || user.message !== "Login Success") {
      return res
        .status(401)
        .json({ message: "Invalid credentials" });
    }
    const options = {
      httpOnly: true,
      secure: true
    }

    return res.
      status(200)
      .cookie("token", token, options)
      .json({ token, message: "User logged in successfully" })

  } catch (error) {
    res
      .status(400)
      .json("Something went wrong")
    //Going to the error handler middleware
    // next(error);
  }
});


//ROUTE 3: For Teacher Login (POST:"/teacherLogin")
router.post('/teacherlogin', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await userService.teacherlogin(email, password);
    const token = jwt.sign({ userId: user.id }, JWT_KEY, { expiresIn: '1h' });

    if (!user || user.message !== "Login Success") {
      return res
        .status(401)
        .json({ message: "Invalid credentials" });
    }
    const options = {
      httpOnly: true,
      secure: true
    }

    return res
      .status(200)
      .cookie("token", token, options)
      .json({ token, message: "User logged in successfully" })

  } catch (error) {
    res
      .status(400)
      .json("Something went wrong");
    //Going to the error handler middleware
    next(error);
  }
});

//ROUTE 4: Getting dashboard data (Student/Teacher) (GET: "/dashboard")
router.get("/dashboard", verifyJWT, async (req, res, next) => {
  try {
    const userId = req.userId
    const userData = await userService.userData(userId);

    if (userId) {
      res
        .status(200)
        .json(userData);
    }
    else {
      res
        .status(404)
        .json({ "message": "No data is availble for this user" })
    }

  } catch (error) {
    res
      .status(400)
      .json("Something went wrong")
    //Going to the error handler middleware
    next(error);
  }
})

//ROUTE 5: Creating New Test (POST:"/createtest")
router.post('/createtest', async (req, res, next) => {
  try {
    const { teacherId, testName, totalMinutes, category, questions, correctAnswers, totalMarks,teacherName } = req.body;
    let addtest = await userService.InsertTest({ teacherId, testName, totalMinutes, category, questions, correctAnswers, totalMarks,teacherName });

    if (addtest) {
      res
        .status(200)
        .json({ 'message': "Successfully added test" });
    }
    else {
      res
        .status(404).
        json({ "message": "Not able to create test at this moment" })
    }
  } catch (error) {
    res
      .status(400)
      .json("Something went wrong")
    //Going to the error handler middleware
    next(error);
  }
});

//ROUTE 6: Getting all the testdetails (GET:"/tests")
router.get("/tests", async (req, res, next) => {
  try {
    const testData = await userService.testData();

    if (testData) {
      res
        .status(200)
        .json(testData)
    }
    else {
      res
        .status(404)
        .json({ "message": "No test found" })
    }

  } catch (error) {
    res
      .status(400)
      .json("Something went wrong")
    //Going to the error handler middleware
    next(error);
  }
})

//ROUTE 7: Student submitted the exam (PUT:"/examsubmit")
router.put('/examsubmit', async (req, res, next) => {
  try {
    const { userAnswers, testId, name, submitterId } = req.body;
    let addexamData = await userService.inserExamtData({ userAnswers, testId, name, submitterId});
 
    if (addexamData) {
      res
        .status(200)
        .json(addexamData);
    }

  } catch (error) {
    res
      .status(400)
      .json("Something went wrong")
    //Going to the error handler middleware
    next(error);
  }
});

//ROUTE 8: Student will get the result table
router.get('/resulttable',verifyJWT,async (req,res,next)=>{
  try {
    let userId=req.userId
   
    const userData = await userService.getUserResult(userId);

    if (userData) {
      res
        .status(200)
        .json(userData);
    }
    else {
      res
        .status(404)
        .json({ "message": "No data is availble for this user" })
    }

  } catch (error) {
    res
      .status(400)
      .json("Something went wrong")
    //Going to the error handler middleware
    next(error);
  }
})

//ROUTE 9: Getting the category based data (GET:"/tests/:category")
router.get('/tests/:category',async (req,res,next)=>{
  try {
    let category=req.params.category;
    const data = await userService.getDatausingCategory(category);
    if (data) {
      res
        .status(200)
        .json(data);
    }
    else {
      res
        .status(404)
        .json({ "message": "No data is availble for this user" })
    }

  } catch (error) {
    res
      .status(400)
      .json("Something went wrong")
    //Going to the error handler middleware
    next(error);
  }
});

//ROUTE 10: Teacher get submitted by details from database(GET:"/testDetails")
router.get('/teachercreatedtest',verifyJWT, async (req,res,next)=>{
  try {
    //this is the teacher Id we are using for getting the data from the database
    let userId=req.userId
    const userData = await userService.teacherTestData(userId);
    if (userData) {
      res
        .status(200)
        .json(userData);
    }
    else {
      res
        .status(404)
        .json({ "message": "No data is availble for this user" })
    }

  } catch (error) {
    res
      .status(400)
      .json("Something went wrong")
    //Going to the error handler middleware
    next(error);
  }
})

//ROUTE 11: For deleting the test. (PUT:"/deletetest")
router.put('/deletetest',async (req,res,next)=>{
  try {
    testId=req.body.testId
    const userData = await userService.deleteTestData(testId);
    if (userData) {
      res
        .status(200)
        .json(userData);
    }
    else {
      res
        .status(404)
        .json({ "message": "No data is availble for this user" })
    }

  } catch (error) {
    res
      .status(400)
      .json("Something went wrong"+error.message)
    //Going to the error handler middleware
  
  }
});

//ROUTE 12: Used for undo the deletedTests
router.put("/undodeletedtests",async (req,res,next)=>{
  try {
   const testId=req.body.testId
  
    let addexamData = await userService.undoDeletedExam( testId);
 
    if (addexamData) {
      res
        .status(200)
        .json(addexamData);
    }

  } catch (error) {
    res
      .status(400)
      .json("Something went wrong")
    //Going to the error handler middleware
   
  }
})

//ROUTE 13: For getting the bin data (GET:"trashdata")
router.get("/trashdata",verifyJWT,async(req,res,next)=>{
  try{
  let userId=req.userId;  
  const userData = await userService.binTestData(userId);
  if (userData) {
    res
      .status(200)
      .json(userData);
  }
  else {
    res
      .status(404)
      .json({ "message": "No data is availble for this user" })
  }

} catch (error) {
  res
    .status(400)
    .json("Something went wrong")
  //Going to the error handler middleware
  next(error);
}
});

//ROUTE 11: DELETE Test Data Permanently
router.delete('/deletetestpermanently/:testId',async (req,res,next)=>{
  try {
    testId=req.params.testId
    const userData = await userService.deleteTestDataPermanently(testId);
    if (userData) {
      res
        .status(200)
        .json(userData);
    }
    else {
      res
        .status(404)
        .json({ "message": "No data is availble for this user" })
    }

  } catch (error) {
    res
      .status(400)
      .json("Something went wrong"+error.message)
    //Going to the error handler middleware
   
  }
});





//ROUTE 13: For getting techer subscriber count from examid
router.get("/subcount/:testId/:studentId",async(req,res,next)=>{
  try{
    const testId = req.params.testId;
    const studentId = req.params.studentId
    const getsubscribers = await userService.getadminsubcribers(testId,studentId);
    if (getsubscribers) {
      res
        .status(200)
        .json(getsubscribers);
    }
    else {
      res
        .status(404)
        .json({ "message": "No data teacher found" })
    }

} catch (error) {
  res
    .status(400)
    .json("Something went wrong")
  //Going to the error handler middleware

}
});



router.post('/subscribeToTeacher',verifyJWT, async (req, res, next) => {
  try {
    const { teacherId } = req.body;
    let studentId=req.userId
    let addsubcriber = await userService.insertsubcriber({ teacherId, studentId });
 
    if (addsubcriber) {
      res
        .status(200)
        .json(addsubcriber);
    }

  } catch (error) {
    res
      .status(400)
      .json("Something went wrong")
    //Going to the error handler middleware

  }
});





router.post('/unsubscribetoTeacher',verifyJWT, async (req, res, next) => {
  try {
    const { teacherId } = req.body;
    let studentId=req.userId
    
    let removeSubscriber = await userService.removeSubscriber({ teacherId, studentId });
 
    if (removeSubscriber) {
      res
        .status(200)
        .json(removeSubscriber);
    }

  } catch (error) {
    res
      .status(400)
      .json("Something went wrong")
    //Going to the error handler middleware
   
  }
});




router.get("/studentsubcriptions", verifyJWT, async (req, res, next) => {
  try {
    const userId = req.userId
    const subcriptionData = await userService.studentsubcriptions(userId);

    if (subcriptionData) {
      res
        .status(200)
        .json(subcriptionData);
    }
    else {
      res
        .status(404)
        .json({ "message": "No data is availble for this user" })
    }

  } catch (error) {
    res
      .status(400)
      .json("Something went wrong")
    //Going to the error handler middleware
   
  }
})

router.get("/allcreater", verifyJWT, async (req, res, next) => {
  try {
    const userId = req.userId

    const allcreater = await userService.allcretares(userId);

    if (allcreater) {
      res
        .status(200)
        .json(allcreater)
    }
    else {
      res
        .status(404)
        .json({ "message": "No test found" })
    }

  } catch (error) {
    res
      .status(400)
      .json("Something went wrong")
    //Going to the error handler middleware

  }
})



router.put('/updateprofile', upload.single('image'), async (req, res, next) => {
  try {
    if (req.file) {
      const multerimage = req.file.path;
      const cloudimage = await uploadOnCloudinary(multerimage);
      const imagepath = cloudimage.url;
      const { name, email, password, mobileNumber, role, dateOfBirth, gender, address, id } = req.body;
      const updateuser = await userService.updateData({name, email, password, mobileNumber, role, dateOfBirth, gender, address, id , imagepath });
      if (updateuser) {
        res.status(200).json({ 'message': "Successfully Update Data" });
      }
    } else {
      // If no image is uploaded, handle text data update
      const { name, email, password, mobileNumber, role, dateOfBirth, gender, address, id } = req.body;
      const updateuser = await userService.updateData({ name, email, password, mobileNumber, role, dateOfBirth, gender, address, id });
      if (updateuser) {
        res.status(200).json({ 'message': "Successfully Update Data" });
      }
    }

  
  } catch (error) {
    res
      .status(400)
      .json("Something went wrong");

  }
});



router.post('/generateopt',async (req,res)=>{
  try {
    const {email,isStudent,newuser} = req.body;
    const generatedOtp = await userService.generatedOtp(email,isStudent,newuser);
    if (generatedOtp) {
      res
        .status(200)
        .json(generatedOtp)
    }
    else {
      res
        .status(404)
        .json({ "message": "No test found" })
    }

  } catch (error) {
    // console.log(error.message)
    res
      .status(400)
      .json(`Something went wrong ${error.message}`);
}
});


router.post('/varifyopt', async (req,res)=>{
  try {
    
    const {email,otp} = req.body;
    const varifyopt = await userService.vairfyOTP(email,otp);
    if (varifyopt) {
      res
        .status(200)
        .json(varifyopt)
    }
    else {
      res
        .status(404)
        .json({ "message": "No test found" })
    }

  } catch (error) {
    res
      .status(400)
      .json(`Something went wrong ${error.message}`);
}
})


router.post('/reset',async(req,res)=>{
  try {
    const {email,isStudent, password} = req.body;
    const resetPassword = await userService.resetPassword(email,isStudent,password);
    if (resetPassword) {
      res
        .status(200)
        .json(resetPassword)
    }
    else {
      res
        .status(404)
        .json({ "message": "No test found" })
    }

  } catch (error) {
    // console.log(error.message)
    res
      .status(400)
      .json(`Something went wrong ${error.message}`);
}
})



router.get("/allcreaterforhomepage", async (req, res, next) => {
  try {

    const allcreaterforhomepage = await userService.allcretaresforhomepage();

    if (allcreaterforhomepage) {
      res
        .status(200)
        .json(allcreaterforhomepage)
    }
    else {
      res
        .status(404)
        .json({ "message": "No test found" })
    }

  } catch (error) {
    res
      .status(400)
      .json("Something went wrong")
    //Going to the error handler middleware

  }
})



// phot ke liye doodho
module.exports = router;
