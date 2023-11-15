const userRoute = require("./userRoute");
const authRoute = require("./authRoute");
const taskRoute = require("./taskRoute");
const subtaskRoute = require("./subtaskRoute");
const calendertaskRoute = require("./calenderRoute");

const mountRoute=(app)=>{
    app.use("/users", userRoute);
    app.use("/auth", authRoute);
    app.use("/task", taskRoute);
    app.use("/subtask", subtaskRoute);
    app.use("/calender", calendertaskRoute);
}

module.exports=mountRoute;