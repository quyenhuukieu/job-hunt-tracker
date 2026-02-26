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

# JWT Authentication Middleware

JWT middleware is the security gatekeeper of your API.

It automatically:
- Verifies the JWT is valid
- Extracts the user identity
- Blocks unauthorized access
- Ensures users only access their own data

Without it, your SaaS is completely insecure.

This is required in any production backend running on Microsoft Azure with a database like Neon.

Production Architecture Flow

Request
 ↓
JWT Middleware
 ↓
Verified User ID
 ↓
API Route
 ↓
Database query filtered by user

# Below is a complete production-ready JWT + Refresh Token system for your stack:

Backend: Microsoft Azure Functions
Database: Neon PostgreSQL
Frontend: React

This includes:

• Session table
• Secure login
• Access + Refresh tokens
• Refresh endpoint
• Logout endpoint
• Token rotation
• DB-backed session revocation

Architecture Overview (Enterprise Pattern)
Login
  ↓
Access Token (15m)
Refresh Token (30d, stored in DB)

Access expires
  ↓
POST /auth/refresh
  ↓
New Access Token
  ↓
Old refresh token rotated

Logout
  ↓
Delete refresh token from DB

This allows:
✅ Short access token lifetime
✅ Long-lived sessions
✅ Session revocation
✅ Multi-device logout
✅ Database-backed security

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