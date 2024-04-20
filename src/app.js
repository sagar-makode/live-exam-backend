const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const requestLogger = require('./utilities/RequestLogger');
const errorLogger = require('./utilities/ErrorLogger');
const userRouter = require('./routes/userRoutes');
const app = express();

const connectDB = require("./db/connection")

//Port
const port = process.env.PORT || 5000;

app.use(cors({
  origin: ["http://localhost:3000"],
  methods: ["GET", "POST","PUT","DELETE"],
  credentials: true
}));

// Middleware
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//routeMiddleware, request and error log handler
app.use(requestLogger);
app.use('/', userRouter);
app.use(errorLogger);

//Backend started
// app.listen(port, () =>console.log(`Listening on http://localhost:${port}`));
// connectDB().then(
// app.listen(port, () =>console.log(`Listening on http://localhost:${port}`))
// ).catch(
//   console.log("Connection Fail")
// )
connectDB()
.then(() =>{

  app.listen(port, () =>console.log(`Listening on http://localhost:${port}`))

}).catch((error) =>{
    console.log(`mongoDB connection failed `, error);
});
