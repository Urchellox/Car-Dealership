const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken'); // Для генерации токенов
const { authenticate, authorizeAdmin } = require('./middleware/auth');

const app = express();
const PORT = 3001;
const SECRET_KEY = 'your_secret_key';

app.use(express.json());
app.use(cors());

// Подключение к MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/car_dealership')
    .then(() => console.log('✅ Успешное подключение к MongoDB'))
    .catch(err => console.error('❌ Ошибка подключения к MongoDB:', err));

// Определение схемы и модели
const carSchema = new mongoose.Schema({
    brand: String,
    model: String,
    year: Number,
    price: Number,
});

const Car = mongoose.model('Car', carSchema);

// Фейковые пользователи (в реальном проекте надо хранить в БД)
const users = [
    { id: 1, username: 'admin', password: 'admin123', role: 'admin' },
];

// Эндпоинт для входа (логина)
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username && u.password === password);

    if (!user) {
        return res.status(401).json({ error: 'Неверный логин или пароль' });
    }

    const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, SECRET_KEY, { expiresIn: '1h' });

    res.json({ token });
});

// Получение всех машин (доступно всем)
app.get('/cars', async (req, res) => {
    try {
        const cars = await Car.find();
        res.json(cars);
    } catch (error) {
        res.status(500).json({ error: 'Ошибка при получении машин' });
    }
});

// Добавление новой машины (только для админа)
app.post('/cars', authenticate, authorizeAdmin, async (req, res) => {
    try {
        const newCar = new Car(req.body);
        await newCar.save();
        res.json(newCar);
    } catch (error) {
        res.status(500).json({ error: 'Ошибка при добавлении машины' });
    }
});


// Обновление машины (только для админа)
app.put('/cars/:id', authenticate, authorizeAdmin, async (req, res) => {
    try {
        const updatedCar = await Car.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedCar);
    } catch (error) {
        res.status(500).json({ error: 'Ошибка при обновлении машины' });
    }
});

// Удаление машины (только для админа)
app.delete('/cars/:id', authenticate, authorizeAdmin, async (req, res) => {
    try {
        await Car.findByIdAndDelete(req.params.id);
        res.json({ message: 'Машина удалена' });
    } catch (error) {
        res.status(500).json({ error: 'Ошибка при удалении машины' });
    }
});

// Запуск сервера
app.listen(PORT, () => console.log(`Сервер запущен на http://localhost:${PORT}`));
