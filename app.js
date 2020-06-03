const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const authRouter = require('./routes/auth');
const userRouter = require('./routes/user');
const categoryRouter = require('./routes/category');
const productRouter = require('./routes/product');
require('./db/mongoose');
// To use env varialbles
require('dotenv').config();

const app = express();

//----- middlewares -----
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(cookieParser());

//----- routes middleware
app.use("/api", authRouter);
app.use("/api", userRouter);
app.use("/api", categoryRouter);
app.use("/api", productRouter);

const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log('Server is running is on port ' + port)
});