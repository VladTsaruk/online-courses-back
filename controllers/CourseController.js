import CourseModel from "../models/Course.js";
import LessonModel from "../models/Lesson.js"

import mongoose from "mongoose";

export const createCourse = async (req, res) => {
  try {
    const doc = new CourseModel({
      title: req.body.title,
      description: req.body.description,
      tags: req.body.tags,
      user: req.userId,
      imageUrl: req.body.imageUrl,
    });

    const lessons = await LessonModel.find({ course: req.body.courseId });
    const allPublished = lessons.every((lesson) => !lesson.draft);

    await CourseModel.findByIdAndUpdate(req.body.courseId, {
      draft: !allPublished,
    });

    const course = await doc.save();

    res.json({
      success: true,
      courseId: course._id
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Не вийшло створити курс!",
    });
  }
};

export const publishCourse = async (req, res) => {
  try {
    const courseId = new mongoose.Types.ObjectId(req.params.id);

    const lessons = await LessonModel.find({ draft: true, course: courseId });
    if (!lessons.length) {
      return res.status(404).json({
        success: false,
        message: 'Немає чернеток для публікації!',
      });
    }

    await LessonModel.updateMany(
      { draft: true, course: courseId },
      { draft: false }
    );

    await CourseModel.findByIdAndUpdate(courseId, {
      draft: false,
    });

    res.json({
      success: true,
      message: 'Курс успішно опублікований!',
    });
  } catch (err) {
    console.error('Помилка оновлення:', err);
    res.status(500).json({
      message: 'Не вдалося виставити курс!',
    });
  };
};

export const getAll = async (req, res) => {
  try {
    const course = await CourseModel.find().populate("user").exec();

    res.json(course);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Не вийшло знайти курси!",
    });
  }
};

export const getById = async (req, res) => {
  try {
    const courseId = req.params.courseId;

    const doc = await CourseModel.findOneAndUpdate(
      { _id: courseId },
      { $inc: { viewsCounter: 1 } },
      { returnDocument: "after" }
    )
      .populate("user")
      .exec();

    if (!doc) {
      return res.status(404).json({
        message: "Курс не знайдений",
      });
    }

    res.json(doc);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Не вийшло знайти курс!",
    });
  }
};

export const removeCourse = async (req, res) => {
  try {
    const courseId = req.params.id;

    const doc = await CourseModel.findOneAndDelete({ _id: courseId });

    if (!doc) {
      return res.status(404).json({
        message: "Курс не знайдено!",
      });
    }

    await LessonModel.deleteMany({ course: courseId });

    res.json({
      success: true,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Не вийшло видалити курс!",
    });
  }
};

export const updateCourse = async (req, res) => {
  try {
    const courseId = req.params.id;

    await CourseModel.findByIdAndUpdate(
        courseId,
        {
            title: req.body.title,
            description: req.body.description,
            tags: req.body.tags,
            imageUrl: req.body.imageUrl,
            user: req.userId,
        },
        { new: true }
    );

    res.json({
      success: true,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Не вийшло оновити курс!",
    });
  }
};
