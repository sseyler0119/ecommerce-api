require('dotenv').config();
require('express-async-errors');

const express = require('express');
const app = express();
// other packages
// cookie-parser gives us access to req.cookies
const cookieParser = require('cookie-parser');
const fileUpload = require('express-fileupload');
const rateLimiter = require('express-rate-limit');
const helmet = require("helmet");
const xss = require('xss-clean');
const cors = require('cors');
const mongoSanitize = require("express-mongo-sanitize");

// database
const connectDB = require('./db/connect');
// middleware
const notFoundMiddleware  = require('./middleware/not-found')
const errorHandlerMiddleware  = require('./middleware/error-handler');
// router
const authRouter = require('./routes/authRoutes');
const userRouter = require('./routes/userRoutes');
const productRouter = require('./routes/productRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const orderRouter = require('./routes/orderRoutes');

// middleware
app.set('trust proxy', 1);
app.use(rateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 60
}));
app.use(helmet());
app.use(cors());
app.use(xss());
app.use(mongoSanitize());

app.use(express.json()); //this allows us to access json data in req.body
app.use(cookieParser(process.env.JWT_SECRET)); // sign cookie
app.use(express.static('./public'));
app.use(fileUpload());


// routes
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/products', productRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/orders', orderRouter);

app.use(notFoundMiddleware); // 404 must come before error-handler
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 5000;
const start = async () => {
    try {
        await connectDB(process.env.MONGO_URI)
        app.listen(port, () => {
            console.log(`server listening on port: ${port}...`)
        })
    } catch (error) {
        console.log(error)
    }
}

start();