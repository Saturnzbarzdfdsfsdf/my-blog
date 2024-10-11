import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

import { validationResult } from 'express-validator'

import UserModel from '../models/User.mjs'

// Проверяем auth регистр
export const register = async (request, response) => {
	try {
		const errors = validationResult(request)
		// проверка на ошибку
		if (!errors.isEmpty()) {
			return response.status(400).json(errors.array())
		}

		// Шифрование пароля
		const password = request.body.password
		const salt = await bcrypt.genSalt(10)
		const hash = await bcrypt.hash(password, salt)

		// Описали юзера
		const doc = new UserModel({
			email: request.body.email,
			fullName: request.body.fullName,
			avatarUrl: request.body.avatarUrl,
			passwordHash: hash,
		})

		// Создали юзера в базе данных
		const user = await doc.save()

		// Создали новый токен (всегда разный)
		const token = jwt.sign(
			{
				_id: user._id,
			},
			'secret123',
			{
				// Срок жизни токена
				expiresIn: '30d',
			}
		)
		// Возвращаем юзера
		const { passwordHash, ...userData } = user._doc

		response.json({
			...userData,
			token,
		})
	} catch (error) {
		console.log(error)
		response.status(500).json({
			massage: 'Не удалось зарегистрироваться',
		})
	}
}

export const login = async (request, response) => {
	try {
		// Ищем пользователя в базе данных
		// Проверяем email
		const user = await UserModel.findOne({ email: request.body.email })
		// Если не найден пользователь, останавливаем код
		if (!user) {
			return response.status(404).json({
				massage: 'Пользователь не найден',
			})
		}
		// Проверяем password
		const isValidPassword = await bcrypt.compare(
			request.body.password,
			user._doc.passwordHash
		)
		// Если не найден пароль, останавливаем код
		if (!isValidPassword) {
			return response.status(404).json({
				massage: 'Не верный логин или пароль',
			})
		}
		// Создали новый токен
		const token = jwt.sign(
			{
				_id: user._id,
			},
			'secret123',
			{
				// Срок жизни токена
				expiresIn: '30d',
			}
		)

		const { passwordHash, ...userData } = user._doc

		response.json({
			...userData,
			token,
		})
	} catch (error) {
		console.log(error)
		response.status(500).json({
			massage: 'Не удалось авторизоваться',
		})
	}
}

// Проверка аутентификации (проверка токена)
export const getMe = async (request, response) => {
	try {
		// Найти пользователя
		const user = await UserModel.findById(request.userId)

		if (!user) {
			return response.status(404).json({
				massage: 'Пользователь не найден',
			})
		}
		// Возвращаем юзера
		const { passwordHash, ...userData } = user._doc

		response.json(userData)
	} catch (error) {
		console.log(error)
		response.status(500).json({
			massage: 'Нет Доступа',
		})
	}
}
