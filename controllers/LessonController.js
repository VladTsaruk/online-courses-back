import LessonModels from "../models/Lesson.js";

export const getLessonsByCourse = async (req, res) => {
  try {
    const courseId = req.params.id;

    const lessons = await LessonModels.find({ course: courseId })
      .sort({
        order: 1,
      })
      .select("_id title description order");

    if (!lessons.length) {
      return res.status(404).json({
        message: "Уроків на цьму курсі не знайдено",
      });
    }

    res.json({
      success: true,
      lessons,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Не вдалося отримати уроки курсу!",
    });
  }
};

export const getLesson = async (req, res) => {
  try {
    const lessonId = req.params.id;

    const lesson = await LessonModels.findById(lessonId);

    if (!lesson) {
      return res.status(404).json({
        message: "Урок не знайдено",
      });
    }

    res.json({
      success: true,
      lesson,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Не вдалося отримати урок!",
    });
  }
};

export const createLesson = async (req, res) => {
  try {
    if (!req.body.courseId) {
      return res.status(400).json({
        message: "ID курсу є обов'язковим",
      });
    }

    if (
      req.body.type === "quiz" &&
      (!req.body.quiz || req.body.quiz.length === 0)
    ) {
      return res.status(400).json({
        message: 'Для типу "quiz" необхідно додати хоча б одне питання',
      });
    }

    if (req.body.type === "video" && !req.body.content) {
      return res.status(400).json({
        message: 'Для типу "video" необхідно вказати URL відео',
      });
    }

    if (req.body.type === "text" && !req.body.content) {
      return res.status(400).json({
        message: 'Для типу "text" необхідно вказати текст уроку',
      });
    }

    const lastLesson = await LessonModels.findOne({
      course: req.body.courseId,
    }).sort({ order: -1 });
    const order = lastLesson ? lastLesson.order + 1 : 1;

    const doc = new LessonModels({
      title: req.body.title,
      description: req.body.description,
      type: req.body.type,
      content: req.body.content,
      quiz: req.body.quiz || [],
      course: req.body.courseId,
      order: order,
      draft: true,
    });

    const lesson = await doc.save();

    res.json({
      success: true,
      lessonId: lesson._id,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Не вийшло створити урок!",
    });
  }
};

export const removeLesson = async (req, res) => {
  try {
    const lessonId = req.params.id;

    const lessonToRemove = await LessonModels.findById(lessonId);

    if (!lessonToRemove) {
      return res.status(404)({
        message: "Урок не знайдено!",
      });
    }

    await LessonModels.findByIdAndDelete(lessonId);

    await LessonModels.updateMany(
      { course: lessonToRemove.course, order: { $gt: lessonToRemove.order } },
      { $inc: { order: -1 } }
    );

    res.json({
      success: true,
      message: "Урок успішно видалений!",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Не вийшло видалити урок!",
    });
  }
};

export const updateLesson = async (req, res) => {
  try {
    const lessonId = req.params.id;

    const lessonToUpdate = await LessonModels.findById(lessonId);

    if (!lessonToUpdate) {
      return res.status(404).json({
        message: "Урок не знайдено!",
      });
    }

    const updatedLesson = await LessonModels.findByIdAndUpdate(
      lessonId,
      {
        title: req.body.title || lessonToUpdate.title,
        description: req.body.description || lessonToUpdate.description,
        type: req.body.type || lessonToUpdate.type,
        content: req.body.content || lessonToUpdate.content,
        quiz: req.body.quiz || lessonToUpdate.quiz,
        draft:
          req.body.draft !== undefined ? req.body.draft : lessonToUpdate.draft,
      },
      { new: true }
    );

    res.json({
      success: true,
      message: "Урок оновлено!",
      lesson: updatedLesson,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Не вийшло видалити урок!",
    });
  }
};
