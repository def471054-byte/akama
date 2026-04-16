# Akama Mobile API Documentation

This document provides technical details for the mobile application's backend integration. All endpoints are relative to your base application URL.

**Base URL**: `https://your-domain.com/api/mobile`

---

## 🔒 Authentication

### 1. Login
Authenticate a user and retrieve their profile.

- **URL**: `/login`
- **Method**: `POST`
- **Content-Type**: `application/json`

**Request Body**:
```json
{
  "email": "admin@akama.com",
  "password": "yourpassword"
}
```

**Response (Success - 200 OK)**:
```json
{
  "message": "Login successful",
  "user": {
    "id": "64f1...",
    "email": "admin@akama.com",
    "role": "ADMIN"
  }
}
```

---

## 📊 Dashboard

### 1. Overview Statistics
Retrieve high-level statistics and recent registrations for the mobile dashboard.

- **URL**: `/dashboard`
- **Method**: `GET`

**Response (Success - 200 OK)**:
```json
{
  "stats": [
    { "label": "Verified Employees", "value": 152 },
    { "label": "System Status", "value": "Green" },
    { "label": "Current Cycle", "value": "Hajj 1447H" }
  ],
  "recentRegistrations": [
    {
      "id": "67b...",
      "name": "John Doe",
      "idNumber": "277...",
      "createdAt": "2026-04-15T...",
      "photo": "https://your-domain.com/api/uploads/image_name.jpg"
    }
  ]
}
```

---

## 👥 Employees

### 1. List Employees (Paginated)
Fetch an alphabetically sorted list of employees with search and pagination support.

- **URL**: `/employees`
- **Method**: `GET`
- **Query Parameters**:
  - `page` (optional): The page number (default: 1)
  - `limit` (optional): Items per page (default: 10)
  - `search` (optional): Filter by name or ID number

**Example Request**: `/api/mobile/employees?page=1&limit=5&search=Ahmed`

**Response (Success - 200 OK)**:
```json
{
  "employees": [
    {
      "id": "67b...",
      "name": "Ahmed Al-Farsi",
      "idNumber": "236...",
      "photo": "https://your-domain.com/api/uploads/image_name.jpg",
      "designation": "Manager",
      "department": "IT",
      "permitNumber": "208"
    }
  ],
  "metadata": {
    "total": 152,
    "page": 1,
    "limit": 5,
    "totalPages": 31
  }
}
```

### 2. Get Employee Details
Fetch the full profile of a single employee.

- **URL**: `/employees/:id`
- **Method**: `GET`

**Response (Success - 200 OK)**:
```json
{
  "id": "67b...",
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+966...",
  "idNumber": "277...",
  "photo": "https://your-domain.com/api/uploads/image_name.jpg",
  "nationality": "Saudi",
  "gender": "Male",
  "company": "Akama Solutions",
  "permitNumber": "P-123",
  "issueDate": "2025-01-01T...",
  "expiryDate": "2026-01-01T...",
  "verificationToken": "xyz..."
}
```

---

## ⚠️ Error Handling

All endpoints use standard HTTP status codes:
- **400 Bad Request**: Missing required parameters.
- **401 Unauthorized**: Invalid credentials.
- **404 Not Found**: Resource (e.g., employee) doesn't exist.
- **500 Internal Server Error**: Unexpected server-side issue.

**Error Response Format**:
```json
{
  "error": "Short description of the error"
}
```
