# Job Hunt Tracker API

Production-ready serverless backend built using:

- Azure Functions
- Node.js
- PostgreSQL (Neon)
- JWT Authentication

---

# Base URL
Removed for security purposes.

# Overview: Authentication Architecture

React
 ↓
POST /api/auth/login
 ↓
Azure Functions
 ↓
Verify user in Neon
 ↓
Return JWT
 ↓
React stores JWT
 ↓
JWT sent with future API calls

# Production SaaS authentication flow

Register
 ↓
Login
 ↓
Receive JWT
 ↓
Access protected APIs

# Next upgrade

Need to implement / upgrade / add: Role-based access control (RBAC) and Refresh tokens, to make it enterprise-level auth


---

# Authentication Endpoints

## Register

POST /api/auth/register

Body:

{
  "email": "test@email.com",
  "password": "password",
  "first_name": "John",
  "last_name": "Doe"
}

---

## Login

POST /api/auth/login

Returns JWT token.

---

# Applications Endpoints

## Get Applications

GET /api/applications

Header:

Authorization: Bearer TOKEN

---

## Create Application

POST /api/applications

---

# Environment Variables

Required:

DATABASE_URL

JWT_SECRET

---

# Tech Architecture

React Frontend  
Azure Functions Backend  
Neon PostgreSQL Database  

---

# Author

Quyen K

Production SaaS Portfolio Project