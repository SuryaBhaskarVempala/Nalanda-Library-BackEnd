# 📚 Nalanda Library Backend API

## Overview

The **Nalanda Library Backend** is a RESTful API built with **Node.js** and **Express.js**, designed to manage library operations such as book management, member registration, borrowing, and returning of books. It utilizes **MongoDB** for data storage and employs **JWT (JSON Web Tokens)** for secure authentication and authorization.

---

## 🚀 Features

- **Book Management**: Add, update, delete, and list books.
- **Member Management**: Register and authenticate members.
- **Borrowing System**: Borrow and return books with transaction tracking.
- **Admin Reports**: View library statistics and activity reports.
- **Role-Based Access Control**: Differentiate access levels for admins and members.

---

## 🛠️ Technologies Used

- **Backend Framework**: [Express.js]
- **Database**: [MongoDB]
- **Authentication**: [JWT]
- **Environment Variables**: [dotenv]

---


## 🔐 Authentication

- All protected routes require a JWT token. To obtain a token:
- Register a new member via the /signup endpoint.
- Login using the /login endpoint to receive a token.
- Include the token in the Authorization header as a Bearer token for subsequent requests.


## 📌 API Endpoints

---

### 1️⃣ Authentication

| Method | Endpoint | Headers | Body | Description | Response |
|--------|----------|---------|------|-------------|----------|
| POST | `/signup` | None | `{ "name": "John Doe", "email": "john@example.com", "password": "password123" }` | Register a new member | `{ "user": { "id": "...", "name": "...", "email": "...", "role": "Member" }, "token": "jwt_token_here" }` |
| POST | `/login` | None | `{ "email": "john@example.com", "password": "password123" }` | Authenticate a member and receive JWT | `{ "user": { "id": "...", "name": "...", "email": "...", "role": "Member" }, "token": "jwt_token_here" }` |

---

### 2️⃣ Book Management (Admin Only)

| Method | Endpoint | Headers | Body / Query Params | Description | Response |
|--------|----------|---------|-------------------|-------------|----------|
| POST | `/books` | `Authorization: Bearer <token>` | `{ "title": "Book Title", "author": "Author Name", "genre": "Genre", "copies": 5 }` | Add a new book | `{ "message": "Book added successfully" }` |
| GET | `/books` | None | `?title=Book&author=Author&genre=Genre&sort=asc|desc&page=1&limit=10` | List all books with optional filters, sorting & pagination | `{ "total": 100, "page": 1, "pages": 10, "books": [ ... ] }` |
| PUT | `/books` | `Authorization: Bearer <token>` | `{ "id": "book_id", "title": "...", "author": "...", "genre": "...", "copies": 10 }` | Update an existing book | `{ "message": "Book updated successfully", "book": { ... } }` |
| DELETE | `/books/:id` | `Authorization: Bearer <token>` | None | Delete a book by ID | `{ "message": "Book deleted successfully", "book": { ... } }` |

---

### 3️⃣ Borrowing System

| Method | Endpoint | Headers | Body / Params | Description | Response |
|--------|----------|---------|---------------|-------------|----------|
| POST | `/borrowBookById` | `Authorization: Bearer <token>` | `{ "userEmail": "john@example.com", "bookId": "book_id_here" }` | Borrow a book by ID | `{ "message": "Book borrowed successfully", "borrow": { ... } }` |
| POST | `/returnBookById/:borrowId` | `Authorization: Bearer <token>` | Path param: `borrowId` | Return a borrowed book by borrow ID | `{ "message": "Book returned successfully" }` |
| GET | `/borrowsByMember` | `Authorization: Bearer <token>` | None | List all borrowed books by the authenticated member | `[ { "book": { ... }, "borrowDate": "date_here" }, ... ]` |

---

### 4️⃣ Admin Reports

| Method | Endpoint | Headers | Body | Description | Response |
|--------|----------|---------|------|-------------|----------|
| POST | `/admin` | `Authorization: Bearer <token>` | `{}` | View library statistics, most borrowed books, and active members | `{ "bookStats": { "total": 120, "borrowed": 55, "available": 65 }, "borrowedBooks": [ { "title": "Book One", "count": 35 }, ... ], "activeMembers": [ { "name": "Alice", "count": 18 }, ... ] }` |

---

> **Note:**  
> - All protected routes require JWT in the `Authorization` header.  
> - `borrowBookById` and `returnBookById` are restricted to `Admin` and `Member`.  
> - `Admin` routes like `/books` and `/admin` require the user to have `Admin` role.
