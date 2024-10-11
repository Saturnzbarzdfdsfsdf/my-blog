import {body} from 'express-validator'

// Валидация регистрации
export const registerValidation = [
	body('email', 'Неверный формат почты').isEmail(),
	body('password', 'Пароль должен содержать не меньше 5 символов').isLength({
		min: 5,
	}),
	body('fullName', 'Укажите имя').isLength({ min: 3 }),
	body('avatarUrl', 'Не корректная ссылка').optional().isURL(),
]