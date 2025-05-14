import EnrollmentModel from "../models/Enrollment.js";
import LessonModel from "../models/Lesson.js";

const checkEnrollment = async (req, res, next) => {
  try {
    const userId = req.userId;
    let courseId = req.params.courseId;

    if (!courseId && req.params.id) {
      const lesson = await LessonModel.findById(req.params.id).select("course");
      if (!lesson) {
        return res.status(404).json({
          message: "Урок не знайдено!",
        });
      }
      courseId = lesson.course.toString();
    };

    const existingEnrollment = await EnrollmentModel.findOne({
      user: userId,
      course: courseId,
    });

    if (req.method === "POST") {
      if (existingEnrollment) {
        return res.status(400).json({
          message: "Ви вже записані на цей курс!",
        });
      }
    } else {
      if (!existingEnrollment) {
        return res.status(403).json({
          message: "Ви не записані на цей курс!",
        });
      }
    }

    next();
  } catch (err) {
    console.error("Помилка в checkEnrollment:", err);
    res.status(500).json({
      message: "Помилка перевірки запису на курс!",
    });
  }
};

export default checkEnrollment;
