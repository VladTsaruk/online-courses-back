import mongoose from "mongoose";

const LessonSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        enum: ['text', 'video', 'quiz'],
        required: true,
    },
    content: String,
    quiz: [
        {
            question: {
                type: String,
                required: true,
            },
            option: [
                {
                    text: {
                        type: String,
                        required: true,
                    },
                    isCorrect: {
                        type: Boolean,
                        default: false,
                    },
                },
            ],
        }
    ],
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true,
    },
    order: {
        type: Number,
        required: true,
    },
    draft: {
        type: Boolean,
        default: true,
    }
});

export default mongoose.model('Lesson', LessonSchema);