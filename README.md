# Car Dealership Management System

This project is a web application for managing a car dealership, built using React, Node.js, and MongoDB. The system allows administrators to manage car listings (add, edit, delete) and users to view available cars.

## Features

- Authentication & Authorization
  - Secure login/logout system
  - Role-based access control (Admin, User)
- Car Management
  - Add new cars (Admin only)
  - Edit or delete existing cars (Admin only)
  - View available cars (All users)
- Database
  - MongoDB with proper indexing for optimized queries
  - RESTful API for CRUD operations

## Technologies Used

- Frontend: React, Bootstrap
- Backend: Node.js, Express.js
- Database: MongoDB (NoSQL)
- Authentication: JWT (JSON Web Tokens)

## Installation & Setup

### 1. Clone the Repository

git clone https://github.com/Urchellox/Car-Dealership.git
cd your-repository


### 2. Install Dependencies

npm install


### 3. Start the Development Server

npm start

- The frontend will be available at [http://localhost:3000](http://localhost:3000).

### 4. Backend Setup

cd backend
npm install
node server.js

- The backend will run on [http://localhost:3001](http://localhost:3001).

### 5. MongoDB Setup
Ensure that MongoDB is running locally or use a cloud MongoDB provider (e.g., MongoDB Atlas). Update the connection string in backend/config/db.js:

const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/car_dealership', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});


## API Endpoints

- GET /cars - Fetch all available cars
- POST /cars - Add a new car (Admin only)
- PUT /cars/:id - Edit car details (Admin only)
- DELETE /cars/:id - Remove a car from the listing (Admin only)

## Deployment

To build the project for production, run:

npm run build

Then, deploy the build/ folder to a hosting service like Vercel, Netlify, or AWS.

## Screenshots

![image](https://github.com/user-attachments/assets/1262f13d-346a-45ee-9ee0-49c9638c1f22)
![image](https://github.com/user-attachments/assets/cb980685-4b87-46c8-a51a-aca9bc3a23be)


## Contributors
- Nurdaulet Nurbapa - Developer
- Yuriy Mikhnevich - Developer

## License
This project is licensed under the MIT License.
