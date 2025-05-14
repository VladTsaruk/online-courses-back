import mongoose from "mongoose";
import express from "express";
import multer from "multer";
import cors from "cors";

import { registerValidation, loginValidation, courseCreatValidation } from "./validations.js";
import { UserController, CourseController, LessonController, EnrollmentController } from './controllers/index.js'
import { checkAuth, checkRole, checkEnrollment, handleValidationErrors } from "./utils/index.js";

//==============================================

mongoose
  .connect(
    "** MongoDB Connect **"
  )
  .then(() => console.log("DB Ok!"))
  .catch((err) => console.log("Error", err));

const app = express();

const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    cb(null, 'uploads');
  },
  filename: (_, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

app.use(express.json());
app.use('/uploads', express.static('uploads'))

app.use(cors({ origin: '* Your cors *' }));

// Auth Controll
app.post('/auth/login', loginValidation, handleValidationErrors, UserController.login);
app.post('/auth/register',  registerValidation, handleValidationErrors, UserController.register);
app.get('/auth/me', checkAuth, UserController.getMe);
//==============================================


app.post('/uploads', checkAuth, upload.single('image'), (req, res) => {
  res.json({
    url: `/uploads/${req.file.originalname}`
  });
});

// Cours Controll
app.get('/course', CourseController.getAll);
app.get('/course/:courseId', checkAuth, CourseController.getById);
app.post('/course', checkAuth, checkRole(['author', 'admin']), courseCreatValidation, handleValidationErrors, CourseController.createCourse);
app.post('/publish/:id', checkAuth, checkRole(['author', 'admin']), handleValidationErrors, CourseController.publishCourse);
app.delete('/remove/:id', checkAuth, checkRole(['author', 'admin']), CourseController.removeCourse);
app.patch('/course/:id', checkAuth, checkRole(['author', 'admin']), courseCreatValidation, handleValidationErrors, CourseController.updateCourse);
//==============================================


// Lesson Controll
app.get('/lesson/:id', checkAuth, checkEnrollment, LessonController.getLesson);
app.get('/course/:id/lessons', LessonController.getLessonsByCourse);
app.post('/lesson', checkAuth, checkRole(['author', 'admin']), LessonController.createLesson);
app.delete('/lesson/:id', checkAuth, checkRole(['author', 'admin']), LessonController.removeLesson);
app.patch('/lesson/:id', checkAuth, checkRole(['author', 'admin']), LessonController.updateLesson);
//==============================================


//Enrollment Controller
app.post('/enroll/:id', checkAuth, checkEnrollment, EnrollmentController.enrollInCourse);



app.listen(3000, (err) => {
  if (err) {
    return console.log(err);
  }

  console.log("Server OK!");
});
