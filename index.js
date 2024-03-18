const express = require('express');
const morgan = require('morgan');
const app = express();
const dotenv = require('dotenv');
const DBConnection = require('./config/db');
const ApiError = require('./utils/ApiError');
const globalError = require('./middlewares/errorMiddleware')
const cors = require('cors')
const babyRoute = require('./routes/BabyRoute');
const doctorRoute=require('./routes/DoctorRoute');

dotenv.config({ path: "config.env" });
app.use(cors());
app.use(express.json());
if (process.env.NODE_ENV === "development") {
    app.use(morgan('dev'));
    console.log(`mode ${process.env.NODE_ENV}`);
}

// DBConnection() will be called here to establish the database connection
DBConnection();
app.use('/api/v1/doctor', doctorRoute);
app.use('/api/v1/baby', babyRoute);


app.all('*', (req, res, next) => {
    next(new ApiError(`Can't find this route: ${req.originalUrl}`, 400));
  });


//global.error handler
app.use(globalError)
const port = process.env.PORT || 9000;
app.listen(port, () => console.log(`Server running on port ${port}`));

// Handle rejection outside express
process.on('unhandledRejection', (err) => {
  console.error(`UnhandledRejection Errors: ${err.name} | ${err.message}`);
  server.close(() => {
    console.error(`Shutting down....`);
    process.exit(1);
  });
});