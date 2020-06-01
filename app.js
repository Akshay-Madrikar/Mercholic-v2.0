const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const userRouter = require('./routes/user');
require('./db/mongoose');
// To use env varialbles
require('dotenv').config();

const app = express();

//----- middlewares -----
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(cookieParser());

//----- routes middleware
app.use("/api", userRouter);

const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log('Server is running is on port ' + port)
});