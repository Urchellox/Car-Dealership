const API_URL = 'http://localhost:3001';

// Функция для входа (логина)
export const login = async (username, password) => {
    try {
        const response = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();
        if (response.ok) {
            localStorage.setItem('token', data.token); // Сохраняем токен
            return data;
        } else {
            throw new Error(data.error || 'Ошибка авторизации');
        }
    } catch (error) {
        console.error('Ошибка при входе:', error);
        throw error;
    }
};

// Функция для выхода (очистка токена)
export const logout = () => {
    localStorage.removeItem('token');
};

// Получение токена из localStorage
export const getToken = () => localStorage.getItem('token');

// Проверка авторизации пользователя
export const isAuthenticated = () => !!getToken();
