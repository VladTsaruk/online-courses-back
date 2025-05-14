import { body } from "express-validator";

export const loginValidation = [
    body('email', 'Невірна почта').isEmail(),
    body('password', 'Некоректний пароль').isLength({min: 7}),
];

export const registerValidation = [
    body('email', 'Невірна почта').isEmail(),
    body('password', 'Некоректний пароль').isLength({min: 7}),
    body('fullName', 'Імя може бути мінімум з 3 букв').isLength({min: 3}),
    body('avatar').optional().isURL(),
    body('bio').optional().isLength({ min: 50 }),
];

export const courseCreatValidation = [
    body('title', 'Введіть назву курса').isLength({ min: 5 }).isString(),
    body('description', 'Введіть опис курсу').isLength({min: 20}).isString(),
    body('tags', 'Невіринй формат тегів').optional().isArray(),
    body('imageUrl', "Фото курсу обов'язкове").isString(),
];

export const lessonCreatValidation = [
    body('title', 'Введіть назву уроку').isLength({ min: 5 }).isString(),
    body('description', 'Введіть опис уроку').isLength({ min: 20 }).isString(),
    body('type', 'Оберіть тип уроку').isIn(['text', 'video', 'quiz']),
    body('content')
        .if(body('type').equals('text'))
        .notEmpty()
        .withMessage('Введіть текст уроку')
        .isLength({ min: 10 })
        .withMessage('Текст уроку має бути мінімум 10 символів'),
    body('content')
        .if(body('type').equals('video'))
        .notEmpty()
        .withMessage('Введіть URL відео')
        .isURL()
        .withMessage('Невірний формат URL для відео'),
    body('quiz')
        .if(body('type').equals('quiz'))
        .isArray({ min: 1 })
        .withMessage('Створіть хоча б одне питання для тесту'),
    body('quiz.*.question', 'Кожне питання має містити текст').isString().notEmpty(),
    body('quiz.*.options', 'Кожне питання має містити варіанти відповідей').isArray({ min: 2 }),
    body('quiz.*.options.*.text', 'Кожен варіант відповіді має містити текст').isString().notEmpty(),
    body('quiz.*.options.*.isCorrect', 'Кожен варіант відповіді має містити поле isCorrect').isBoolean(),
];

export const enrollmentValidation = [
    body("courseId", "ID курсу є обов'язковим!").isMongoId(),
];