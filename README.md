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


.

## 📌 API Endpoints
## 1.Authentication

POST /signup: Register a new member.

Body: { "name": "John Doe", "email": "john@example.com", "password": "password123" }

Response: { "user": { ... }, "token": "jwt_token_here" }

POST /login: Authenticate a member and receive a token.

Body: { "email": "john@example.com", "password": "password123" }

Response: { "user": { ... }, "token": "jwt_token_here" }

Book Management (Admin Only)

POST /books: Add a new book.

Body: { "title": "Book Title", "author": "Author Name", "genre": "Genre", "copies": 5 }

Response: { "message": "Book added successfully" }

GET /books: List all books with optional filters.

Query Params: title, author, genre, sort (asc/desc)

Response: { "total": 100, "books": [ ... ] }

PUT /books: Update an existing book.

Body: { "id": "book_id", "title": "Updated Title", "author": "Updated Author", "genre": "Updated Genre", "copies": 10 }

Response: { "message": "Book updated successfully" }

DELETE /books/:id: Delete a book by ID.

Response: { "message": "Book deleted successfully" }

Borrowing System

POST /borrowBookById: Borrow a book by ID.

Body: { "userEmail": "john@example.com", "bookId": "book_id_here" }

Response: { "message": "Book borrowed successfully" }

POST /returnBookById/:borrowId: Return a borrowed book by borrow ID.

Response: { "message": "Book returned successfully" }

GET /borrowsByMember: List all borrowed books by the authenticated member.

Response: [ { "book": { ... }, "borrowDate": "date_here" }, ... ]

Admin Reports

POST /admin: View library statistics and activity reports.

Body: {} (No body required)

Response: { "bookStats": { ... }, "borrowedBooks": [ ... ], "activeMembers": [ ... ] }
