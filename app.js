//env File Require
require('dotenv').config()

//External Imports
const express = require('express');
const helmet = require('helmet');
const cors = require(`cors`);
const cookieParser = require('cookie-parser');
const multer = require('multer');


const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;
const path = require('path');

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
cloudinary.config({
  cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
  api_key :process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET
})


// app.use(cors({
//     origin: ["http://192.168.100.7:5173","http://192.168.100.3"],
//     credentials: true,
// }));

app.use(cors({
    origin: ["http://localhost:5173"],
    credentials: true,
}));
    
app.use(helmet());

app.use(express.json())

app.use((req,res,next)=>
{
    res.header("Access-Control-Allow-Credentials",true)
    next();
})


// CODE FOR CLOUDINARY HERE

// CODE FOR CLOUDINARY END

// //Mutler Function for Storage
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
      folder:'Thrive', //folder name in your cloundinary account to store images
      allowedFormats:['jpeg','png','jpg']
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






// // Configure Cloudinary
// cloudinary.config({ 
//   cloud_name: 'dxndiu1hz', 
//   api_key: '937266898967345', 
//   api_secret: 'TMVVoo_962LdFFBUjKc4fA_Q_Rk' 
// });

// // Configure multer to use both Cloudinary and local storage
// const cloudinaryStorage = new CloudinaryStorage({
//   cloudinary: cloudinary,
//   params: {
//     folder: 'uploads', // specify the folder in your Cloudinary account
//     allowed_formats: ['jpg', 'jpeg', 'png', 'pdf'] // specify allowed file formats
//   }
// });

// const localDiskStorage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, './client/public/uploads') // local storage destination
//   },
//   filename: function (req, file, cb) {
//     cb(null, Date.now()+file.originalname )// local storage filename
//   }
// });

// const uploadCloudinary = multer({ storage: cloudinaryStorage });
// const uploadLocal = multer({ storage: localDiskStorage });

// app.post('/api/v1/upload', (req, res) => {
//   console.log("Trying to upload...");

//   // Using uploadLocal middleware to store file in local storage
//   uploadLocal.single('file')(req, res, function (err) {
//     if (err) {
//       console.error('Error uploading to local storage:', err);
//       return res.status(500).send({ message: 'Error uploading file to local storage' });
//     }

//     // Using uploadCloudinary middleware to store file in Cloudinary
//     uploadCloudinary.single('file')(req, res, function (err) {
//       if (err) {
//         console.error('Error uploading to Cloudinary:', err);
//         if (err.http_code === 400 && err.message.includes('The file size exceeds')) {
//           return res.status(400).send({ message: 'File size exceeds the limit' });
//         }
//         if (err.http_code === 400 && err.message.includes('Invalid file type')) {
//           return res.status(400).send({ message: 'Invalid file type' });
//         }
//         // Log detailed Cloudinary upload error
//         console.error('Cloudinary upload error:', err);
//         return res.status(500).send({ message: 'Error uploading file to Cloudinary' });
//       }

//       // Both uploads successful
//       console.log('File uploaded successfully to both local storage and Cloudinary');
//       return res.status(200).send({ message: 'File uploaded successfully to both local storage and Cloudinary' });
//     });
//   });
// });