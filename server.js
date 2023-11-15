const path=require('path');
const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const morgan = require("morgan");
const cors = require("cors");
const compression = require('compression')
const http= require("http");
const { format } = require('date-fns');

dotenv.config({ path: "config.env" });
const mountRoutes=require("./route/index");
const ApiError = require("./utils/apiError");
const globalerror = require("./middelwares/errorMiddelWare");
const DBConnection = require("./config/database");
const {RealTimeDB} = require("./config/realtimeso");


DBConnection();
const app = express();


app.use(cors());
app.options('*',cors());
app.use(compression());
// midelware
app.use(express.json());
app.use(express.static(path.join(__dirname,'uploads')));
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));
const serverr=http.createServer(app);
const io =require('socket.io')(serverr);

if(process.env.NODE_ENV =="development"){
app.use(morgan("dev"));
console.log(`mode dev ${process.env.NODE_ENV}`);
}
mountRoutes(app);
RealTimeDB(app,io),
app.all("*", (req, res, next) => {
  next(new ApiError(`Cant find this route:${req.originalUrl}`, 400));
});

app.use(globalerror);
const PORT=process.env.PORT || 5000;
const server= serverr.listen(PORT,()=>{
    console.log(`App Running ${PORT}`);
});



process.on("unhandledRejection", (err) => {
    console.error(`UnhandledRejection Errors: ${err.name} | ${err.message}`);
    server.close(() => {
      console.error(`Shutting down....`);
      process.exit(1);
    });
  });