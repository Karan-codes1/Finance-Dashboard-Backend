#  Finance Dashboard Backend

##  Overview

This project is a backend system for a **Finance Dashboard** that manages financial records with **role-based access control** and provides **summary analytics**.

It is designed to demonstrate backend fundamentals such as:

* API design
* Data modeling
* Access control
* Aggregation logic
* Clean architecture

---

##  Roles & Permissions

The system supports three roles:

###  Viewer

* Can view **only their own records**
* Can access **their own summary, category-wise, and monthly data**

---

###  Analyst

* Can view **all records**
* Can access **global summary, category-wise, and monthly analytics**
* Cannot modify data

---

###  Admin

* Full access:

  * Create records
  * Update records
  * Delete records
* Can view **all records and analytics**

---

## Tech Stack

* **Node.js**
* **Express.js**
* **MongoDB + Mongoose**
* **JWT Authentication**
* **bcrypt (password hashing)**

---

##  Data Models

### User

```json
{
  "name": "string",
  "email": "string",
  "password": "string",
  "role": "viewer | analyst | admin",
  "isActive": "boolean"
}
```

---

### Record

```json
{
  "user": "ObjectId (owner of record)",
  "createdBy": "ObjectId (admin who created it)",
  "amount": "number",
  "type": "income | expense",
  "category": "string",
  "date": "Date",
  "note": "string"
}
```

---

##  Authentication

Uses **JWT-based authentication**

### Register

```http
POST /api/auth/register
```
<p align="center">
  <img src="./screenshots/records.png" alt="Records API" width="600"/>
</p>

### Login

```http
POST /api/auth/login
```

Returns:

```json
{
  "token": "...",
  "user": { ... }
}
```

---

##  API Endpoints

###  Records

#### Create Record (Admin only)

```http
POST /api/records
Authorization: Bearer TOKEN
```

---

#### Get Records

```http
GET /api/records
```



* Viewer → only own records
* Analyst/Admin → all records

Supports filters:

* `type`
 <p align="center">
  <img src="./screenshots/Filter_records_based_on_type.png" alt="Records API" width="600"/>
</p>

* `category`
* `type & category`

---

#### Update Record (Admin only)

```http
PATCH /api/records/:id
```

---

#### Delete Record (Admin only)

```http
DELETE /api/records/:id
```

---

##  Dashboard APIs

### Summary

```http
GET /api/dashboard/summary
```

<p align="center">
  <img src="./screenshots/Dashboard_summary.png" alt="Records API" width="600"/>
</p>


Returns:

```json
{
  "totalIncome": 50000
  "totalExpense": 29200,
  "netBalance": 20800
}
```

---

### Category-wise

```http
GET /api/dashboard/category
```
<p align="center">
  <img src="./screenshots/Category_wise_summary.png" alt="Records API" width="600"/>
</p>



Example:

```json
{
  "rent":20000
  "travel":8000
  "food": 1200,
  "salary": 50000
}
```

---

### Monthly Trends

```http
GET /api/dashboard/monthly
```

Example:

```json
{
  "2026-03": -800,
  "2026-04": 5000
}
```

---

##  Access Control Logic

* Implemented using middleware:

  * `verifyToken`
  * `allowRoles`

* Role-based filtering ensures:

  * Data privacy for viewers
  * Full visibility for analysts/admins
  * Restricted modifications

---

##  Key Design Decisions

* **Separation of concerns** (routes, controllers, models, middleware)
* **Role-based data filtering** instead of multiple APIs
* **Records linked to users** for ownership
* **Admin-controlled data creation**
* Simple and scalable API design

---

##  Performance Optimization

Added a compound index:

```js
recordSchema.index({ user: 1, date: -1 });
```

This improves performance for:

* User-specific queries
* Sorting records by date

---

##  Testing

* All APIs tested using **Postman**
* Verified:

  * Role-based access control
  * Data filtering
  * Dashboard calculations
  * CRUD operations

---

##  Project Structure

```
/models
/controllers
/routes
/middleware
```

---

## Setup Instructions

```bash
git clone <repo>
cd project
npm install
```

Create `.env` file:

```
MONGO_URI=your_mongo_url
JWT_SECRET=your_secret
```

Run server:

```bash
npm start
```

---

##  Notes

* Designed for clarity and maintainability
* Focused on backend architecture rather than UI
* Demonstrates real-world API design patterns

---

##  Conclusion

This project showcases:

* Clean backend architecture
* Role-based access control
* Data aggregation logic
* Scalable API design

---
