const express = require('express');
const router = express.Router();
const userService = require('../service/userService');
const jwt = require('jsonwebtoken');
const verifyJWT = require('../midalware/auth.midalware');
const dotenv   = require('dotenv')


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
    console.log("call");
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
    const { teacherId, testName, totalMinutes, category, questions, correctAnswers, totalMarks } = req.body;
    let addtest = await userService.InsertTest({ teacherId, testName, totalMinutes, category, questions, correctAnswers, totalMarks });

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


// phot ke liye doodho
module.exports = router;
