import EnrollmentModel from "../models/Enrollment.js"
import CourseModel from "../models/Course.js"

export const enrollInCourse = async (req, res) => {
    try {
        const userId = req.userId;
        const courseId = req.params.id;

        const course = await CourseModel.findById(courseId);
        if (!course) {
            return res.status(404).json({
                message: "Курс не знайдено!",
            });
        };

        const enrollment = new EnrollmentModel({
            user: userId,
            course: courseId,
        });

        await enrollment.save();

        res.json({
            success: true,
            message: "Ви записалися на курс!",
        })
    }
    catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Не вдалося записатися на курс!"
        });
    };
};