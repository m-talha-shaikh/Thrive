//env File Require
require('dotenv').config()

//External Imports
const express = require('express');
const helmet = require('helmet');
const cors = require(`cors`);
const cookieParser = require('cookie-parser');
const multer  = require('multer')

//Database Connection
const attachDB = require('./server/utils/dbMiddleware');

//Routers
const AuthRoutes = require("./server/routes/Auth")

//Profiles
const personRouter = require('./server/routes/personRoutes')
const instituteRouter = require('./server/routes/instituteRoutes')
const organizationRouter = require('./server/routes/organizationRoutes')
const ConnectionRoutes = require("./server/routes/ConnectionRoutes")

//Social Media Interaction
const PostRoutes = require("./server/routes/posts");
const CommentRoutes = require("./server/routes/comments");
const likeRoutes = require("./server/routes/likes")

//Jobs Section
const jobRouter = require('./server/routes/jobRoutes');

//Search Functionality
const UserRoutes = require('./server/routes/user')

//Not Functional Now
const ChatRoutes = require("./server/routes/Chat")

//Starting app
const app = express();
app.use(cookieParser());


//MIDDLEWARES

app.use(cors({
    origin: ["http://192.168.100.7:5173","http://192.168.100.3"],
    credentials: true,
}));
    
app.use(helmet());

app.use(express.json())

app.use((req,res,next)=>
{
    res.header("Access-Control-Allow-Credentials",true)
    next();
})


//Mutler Function for Storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './client/public/uploads')
    },
    filename: function (req, file, cb) {
   
      cb(null, Date.now()+file.originalname )
    }
  })
  
  const upload = multer({ storage: storage })
app.post("/api/v1/upload",upload.single("file"),(req,res)=>
{
    const file =req.file;
    console.log(req.file);
    res.status(200).json(file.filename)
})


// Attach the database connection to all routes under '/api/v1'
app.use('/api/v1', attachDB);

//Routing Middlewares
app.use('/api/v1/persons', personRouter);
app.use('/api/v1/institutes', instituteRouter);
app.use('/api/v1/organizations', organizationRouter);
app.use("/api/v1/Auth",AuthRoutes);
app.use("/api/v1/Posts",PostRoutes);
app.use('/api/v1/Jobs', jobRouter);
app.use('/api/v1/Comments', CommentRoutes);
app.use('/api/v1/Likes', likeRoutes);
app.use('/api/v1/Connection',ConnectionRoutes);
app.use('/api/v1/Chat',ChatRoutes);
app.use('/api/v1/users', UserRoutes);

//404
app.all('*', (req, res, next) => {
    res.send("Error 404");
})

module.exports = app;

