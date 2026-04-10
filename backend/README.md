# PAWKIESS Backend API

Node.js + Express backend for the PAWKIESS pet care platform.

## Features

- User authentication with JWT
- RESTful API endpoints
- MongoDB database with Mongoose
- Password hashing with bcrypt
- Role-based access control
- Error handling middleware

## Setup Instructions

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the backend directory with the following:

```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/pawkiess
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRE=30d
FRONTEND_URL=http://localhost:5173
```

### 3. Install and Run MongoDB

**Option A: Local MongoDB**
```bash
# Install MongoDB and start the service
mongod
```

**Option B: MongoDB Atlas (Cloud)**
1. Create account at mongodb.com/cloud/atlas
2. Create a cluster
3. Get connection string
4. Update MONGODB_URI in .env

### 4. Start Server

**Development mode:**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

Server will run on `http://localhost:5000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (Protected)

### Pets
- `GET /api/pets` - Get all user pets (Protected)
- `POST /api/pets` - Create new pet (Protected)
- `GET /api/pets/:id` - Get single pet (Protected)
- `PUT /api/pets/:id` - Update pet (Protected)
- `DELETE /api/pets/:id` - Delete pet (Protected)

## Testing with Postman/Thunder Client

### 1. Register User
```
POST http://localhost:5000/api/auth/register
Body: {
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "pet_owner"
}
```

### 2. Login
```
POST http://localhost:5000/api/auth/login
Body: {
  "email": "john@example.com",
  "password": "password123"
}

Response: { "token": "..." }
```

### 3. Create Pet (use token from login)
```
POST http://localhost:5000/api/pets
Headers: { "Authorization": "Bearer YOUR_TOKEN_HERE" }
Body: {
  "name": "Max",
  "species": "dog",
  "breed": "Golden Retriever",
  "age": 3
}
```

## Project Structure

```
backend/
├── src/
│   ├── config/
│   │   └── database.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Pet.js
│   │   └── Booking.js
│   ├── controllers/
│   │   ├── authController.js
│   │   └── petController.js
│   ├── middleware/
│   │   ├── auth.js
│   │   └── errorHandler.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   └── petRoutes.js
│   └── server.js
├── .env
├── .gitignore
└── package.json
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| NODE_ENV | Environment mode | development |
| PORT | Server port | 5000 |
| MONGODB_URI | MongoDB connection string | mongodb://localhost:27017/pawkiess |
| JWT_SECRET | Secret for JWT tokens | (required) |
| JWT_EXPIRE | Token expiration | 30d |
| FRONTEND_URL | Frontend URL for CORS | http://localhost:5173 |

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB  
- **ODM**: Mongoose
- **Authentication**: JWT + bcrypt
- **Validation**: express-validator
- **Dev Tools**: nodemon, morgan
