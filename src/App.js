import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { jwtDecode } from "jwt-decode";
import { login, logout, isAuthenticated, getToken } from "./services/authService";

const API_URL = "http://localhost:3001/cars";

function App() {
  const [cars, setCars] = useState([]);
  const [newCar, setNewCar] = useState({ brand: "", model: "", year: "", price: "" });
  const [user, setUser] = useState(null);
  const [loginData, setLoginData] = useState({ username: "", password: "" });

  useEffect(() => {
    fetchCars();
    checkAuth();
  }, []);

  const fetchCars = async () => {
    try {
        const res = await fetch(API_URL, {
            headers: { Authorization: `Bearer ${getToken()}` },
        });
        const data = await res.json();
        setCars(data);
    } catch (error) {
        console.error("Ошибка загрузки:", error);
    }
};


  const checkAuth = () => {
    if (isAuthenticated()) {
      const token = getToken();
      const decoded = jwtDecode(token);
      console.log("Декодированный токен:", decoded); // <-- смотри, какая роль
      setUser({ role: decoded.role });
    }
  };
  

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const data = await login(loginData.username, loginData.password);
      setUser({ role: data.role });
      checkAuth(); // Добавляем этот вызов, чтобы сразу обновить интерфейс
    } catch (error) {
      alert("Ошибка авторизации");
    }
  };
  

  const handleLogout = () => {
    logout();
    setUser(null);
  };

  const addCar = async (e) => {
    e.preventDefault();
    if (!newCar.brand || !newCar.model || !newCar.year || !newCar.price) {
      alert("Заполните все поля!");
      return;
    }
    console.log("Токен перед отправкой:", getToken());

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` },
        body: JSON.stringify(newCar),
      });
      const data = await res.json();
      setCars([...cars, data]);
      setNewCar({ brand: "", model: "", year: "", price: "" });
    } catch (error) {
      console.error("Ошибка добавления:", error);
    }
  };

  const deleteCar = async (id) => {
    if (!window.confirm("Вы уверены, что хотите удалить?")) return;
    try {
      await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      setCars(cars.filter((car) => car._id !== id));
    } catch (error) {
      console.error("Ошибка удаления:", error);
    }
  };

  const editCar = async (id) => {
    const newBrand = prompt("Введите новую марку:");
    const newModel = prompt("Введите новую модель:");
    const newYear = prompt("Введите новый год:");
    const newPrice = prompt("Введите новую цену:");
    if (!newBrand || !newModel || !newYear || !newPrice) {
      alert("Заполните все поля!");
      return;
    }
    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` },
        body: JSON.stringify({ brand: newBrand, model: newModel, year: newYear, price: newPrice }),
      });
      const updatedCar = await res.json();
      setCars(cars.map((car) => (car._id === id ? updatedCar : car)));
    } catch (error) {
      console.error("Ошибка обновления:", error);
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center">Автомобильный салон</h2>
      {!user ? (
        <form onSubmit={handleLogin} className="mb-4">
          <div className="input-group">
            <input type="text" className="form-control" placeholder="Логин" value={loginData.username} onChange={(e) => setLoginData({ ...loginData, username: e.target.value })} required />
            <input type="password" className="form-control" placeholder="Пароль" value={loginData.password} onChange={(e) => setLoginData({ ...loginData, password: e.target.value })} required />
            <button type="submit" className="btn btn-primary">Войти</button>
          </div>
        </form>
      ) : (
        <div className="text-end mb-3">
          <strong>Вы вошли как: {user.role}</strong>
          <button className="btn btn-danger ms-3" onClick={handleLogout}>Выйти</button>
        </div>
      )}
      {user?.role === "admin" && (
        <form onSubmit={addCar} className="mb-4">
          <div className="input-group">
            <input type="text" className="form-control" placeholder="Марка" value={newCar.brand} onChange={(e) => setNewCar({ ...newCar, brand: e.target.value })} required />
            <input type="text" className="form-control" placeholder="Модель" value={newCar.model} onChange={(e) => setNewCar({ ...newCar, model: e.target.value })} required />
            <input type="number" className="form-control" placeholder="Год" value={newCar.year} onChange={(e) => setNewCar({ ...newCar, year: e.target.value })} required />
            <input type="number" className="form-control" placeholder="Цена" value={newCar.price} onChange={(e) => setNewCar({ ...newCar, price: e.target.value })} required />
            <button type="submit" className="btn btn-primary">Добавить</button>
          </div>
        </form>
      )}
      <ul className="list-group">
        {cars.map((car) => (
          <li key={car._id} className="list-group-item d-flex justify-content-between align-items-center">
            <span>{car.brand} {car.model} ({car.year}) - ${car.price}</span>
            {user?.role === "admin" && (
              <div>
                <button className="btn btn-warning btn-sm mx-2" onClick={() => editCar(car._id)}>Редактировать</button>
                <button className="btn btn-danger btn-sm" onClick={() => deleteCar(car._id)}>Удалить</button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
export default App;
