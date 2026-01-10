# Project Name : Bite Share server
Share your bite (food) with others

## Overview
**Bite Share Server** is the backend for the Bite Share web application. It provides RESTful APIs to manage user authentication, product sharing, and data storage. Built with Node.js, Express, and MongoDB, it supports secure and smooth interactions for the frontend application.

## Features
- User authentication via Firebase Auth, track user in database
- CRUD operations for shared "vite" (products/food experiences)
- API endpoints for frontend consumption

## Technologies
- Firebase Auth
- Node JS
- Express Js
- MongoDB (mongoose)

## Tools / Dependencies
- cors
- dotenv
- firebase-admin


## API Documentation

---

### Authentication
Used Firebase for authentication mainly. Database just keep track of registerred user, get role, and profile

| Method | Endpoint | Description | Auth |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/user` | Create new User | Yes |
| `POST` | `/api/user/role` | Get User Role | Yes |
| `GET` | `/api/auth/profile` | Get User Profile | Yes |


### API Endpoints

| Method | Endpoint | Description | Auth |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/food` | Get All Food | No |
| `GET` | `/api/food/featured` | Top 6 foods by quantity | No |
| `GET` | `/api/food/:id` | Get single food by ID | No |
| `GET` | `/api/food/my` | Get Food added by User | Yes |
| `POST` | `/api/food` | Create a Food | Yes |
| `PATCH` | `/api/food/:id` | Update a Food | Yes |
| `DELETE` | `/api/food/:id` | Delete a Food | Yes |


## Project Timeline
- created on 10 Nov 2025
- completed on 13 Nov 2025
- last updated on 11 Jan 2025

## Installation / Running Locally
1. Clone the repository:
   ```bash
   git clone https://github.com/nayem-ahmedz/bite-share-server.git
   ```
2. Navigate to the project folder:
   ```bash
   cd bite-share-server
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the development server:
   ```bash
   node server.js
   ```

## live link
- [Front-end](https://bite-sharee.vercel.app/)
- [Server](https://bite-share-server.vercel.app/)

Feel free to contact for any query!
