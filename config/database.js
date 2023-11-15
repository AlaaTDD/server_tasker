const mongoose= require("mongoose");

const DBConnection=()=>{
    mongoose.connect(process.env.DB_URL,{
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }).then((conn)=>{
        console.log(`Database Connection ${conn.connection.host}`);
    });
};


module.exports = DBConnection;