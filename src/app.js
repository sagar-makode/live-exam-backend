const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const requestLogger = require('./utilities/RequestLogger');
const errorLogger = require('./utilities/ErrorLogger');
const userRouter = require('./routes/userRoutes');
const app = express();
const dotenv   = require('dotenv')

dotenv.config({
  path: './.env'
})

//Port
const port = process.env.PORT || 5000;

app.use(cors(
  {
  origin: ["https://myonlinexam.netlify.app'"],
  methods: ["GET", "POST","PUT"],
  credentials: true
}

));

// Middleware
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//routeMiddleware, request and error log handler
app.use(requestLogger);
app.use('/', userRouter);
app.use(errorLogger);

//Backend started
app.listen(port, () =>console.log(`Listening on http://localhost:${port} `));