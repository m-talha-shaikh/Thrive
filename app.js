const express = require('express');
const helmet = require('helmet');
const cors = require(`cors`);
const attachDb = require('./server/utils/dbMiddleware');
const cookieParser = require('cookie-parser'); // Import cookie-parser
//Rquired Routes
const personRouter = require('./server/routes/personRoutes')
const instituteRouter = require('./server/routes/instituteRoutes')
const organizationRouter = require('./server/routes/organizationRoutes')
const PostRoutes = require("./server/routes/posts");
const CommentRoutes = require("./server/routes/comments");
const AuthRoutes = require("./server/routes/Auth")
const likeRoutes = require("./server/routes/likes")
const multer  = require('multer')
const jobRouter = require('./server/routes/jobRoutes');
const ConnectionRoutes = require("./server/routes/ConnectionRoutes")


//Starting app
const app = express();
app.use(cookieParser());


//Middlewares
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}));
    

//Middlewares


app.use(helmet());
app.use(express.json())

app.use((req,res,next)=>
{
    res.header("Access-Control-Allow-Credentials",true)
    next();
})
app.use(helmet());
app.use(express.json())

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
app.use('/api/v1', attachDb);

//Routing Middlewares
app.use('/api/v1/persons', personRouter);
app.use('/api/v1/institutes', instituteRouter);
app.use('/api/v1/organizations', organizationRouter);
app.use("/api/v1/Auth",AuthRoutes);
app.use("/api/v1/Posts",PostRoutes);
app.use('/api/v1/jobs', jobRouter);
app.use('/api/v1/Comments', CommentRoutes);
app.use('/api/v1/Likes', likeRoutes);
app.use('/api/v1/Connection',ConnectionRoutes);
//404
app.all('*', (req, res, next) => {
    res.send("Error 404");
})

module.exports = app;

