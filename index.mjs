import express from 'express'
import mongoose from 'mongoose'

import { registerValidation } from './validations/auth.mjs'

import checkAuth from './utils/checkAuth.mjs'
import { register, login, getMe } from './controllers/UserController.mjs'

// Подключили библиотеку mongodb
mongoose
	.connect(
		'mongodb+srv://admin:wwwwww@cluster0.p4kjl.mongodb.net/blog?retryWrites=true&w=majority&appName=Cluster0'
	)
	.then(() => console.log('DB is work'))
	.catch(error => console.log('DB error', error))

// app приложение работы с express
const app = express()
app.use(express.json())

app.post('/auth/register', registerValidation, register)

app.post('/auth/login', login)

app.get('/auth/me', checkAuth, getMe)

// Проверка на сервера на работу
app.listen(4444, error => {
	if (error) {
		return console.log(error)
	}
	console.log('Server work')
})
