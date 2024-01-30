const express = require('express');
const morgan = require('morgan');
const app = express();
const dotenv = require('dotenv');
const DBConnection = require('./config/db');
const ApiError = require('./utils/ApiError');
const globalError = require('./middlewares/errorMiddleware')
const babyGrowthRoute = require('./routes/BabyGrowthRoute');
const FoodsToGainHieghtRoute = require('./routes/FoodsToGainHieghtRoute');
const CausesOfDelayBabyGrowthRoute = require('./routes/CausesOfDelayBabyGrowthRoute');
const GastrointestinalDiseases = require('./routes/GastrointestinalDiseasesRoute');
const vaccination = require('./routes/VaccinesRoute');
const cors = require('cors')
const motherRoute = require('./routes/MotherRoute');
const doctorroute=require('./routes/DoctorRoute');
const babyRoute = require('./routes/BabyRoute');
const eductionalvideos = require('./routes/EducationalVideosRoute');

dotenv.config({ path: "config.env" });
app.use(cors());
app.use(express.json());
if (process.env.NODE_ENV === "development") {
    app.use(morgan('dev'));
    console.log(`mode ${process.env.NODE_ENV}`);
}

// DBConnection() will be called here to establish the database connection
DBConnection();
app.use('/api/v1/babygrowth', babyGrowthRoute);
app.use('/api/v1/foodstogainhieght', FoodsToGainHieghtRoute);
app.use('/api/v1/causesofdelaybabygrowth', CausesOfDelayBabyGrowthRoute);
app.use('/api/v1/vaccination', vaccination);
app.use('/api/v1/gastrointestinaldiseases', GastrointestinalDiseases);
app.use('/api/v1/mother', motherRoute);
app.use('/api/v1/doctor', doctorroute);
app.use('/api/v1/baby', babyRoute);
app.use('/api/v1/educationalvideos', eductionalvideos);

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