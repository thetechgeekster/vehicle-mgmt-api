# Vehicle Management API

## Overview

The Vehicle Management API is a RESTful API built with Node.js, Express, and SQLite. It allows users to manage their vehicles, including details such as make, model, VIN number, and various records such as services, fixes, and enhancements. The API also supports scheduling calendar events (servicea)

## Features

- **User Management**: Register and authenticate users.
- **Vehicle Management**: Add, edit, and view vehicles with their details.
- **Service Records**: Add, edit, and view service records for vehicles.
- **Fix Records**: Add, edit, and view fix records for vehicles.
- **Enhancement Records**: Add, edit, and view enhancement records for vehicles.
- **Scheduled Services**: Schedule services and convert them into service records.
- **User-Specific Data**: Manage vehicles and records linked to individual users.

## Installation

### Prerequisites

- Node.js (v18 or later recommended)
- npm (Node Package Manager)

### Steps

1. **Clone the Repository**

   ```bash
   git clone 
   cd vehicle-management-api
   ```

2. **Install Dependencies**

   ```bash
   npm install
   ```

3. **Set Up the Database**

   The application uses SQLite. The database schema will be created automatically when the app runs for the first time.

4. **Run the Application**

   ```bash
   npm start
   ```

   The server will start at `http://localhost:3000`.

## API Documentation

### User Management

- **Register User**

  ```http
  POST /users
  ```

  **Request Body:**

  ```json
  {
    "username": "string",
    "email": "string",
    "password": "string",
    "settings": ["string"]
  }
  ```

- **Authenticate User**

  ```http
  POST /login
  ```

  **Request Body:**

  ```json
  {
    "email": "string",
    "password": "string"
  }
  ```

### Vehicle Management

- **Add Vehicle**

  ```http
  POST /vehicles
  ```

  **Request Body:**

  ```json
  {
    "userId": "integer",
    "vin": "string",
    "make": "string",
    "model": "string",
    "date_of_manufacture": "string",
    "date_of_purchase": "string",
    "mileage_on_purchase": "integer",
    "photo": "binary"
  }
  ```

- **Get Vehicles by User**

  ```http
  GET /users/{userId}/vehicles
  ```

### Record Management

- **Add Service Record**

  ```http
  POST /vehicles/{vehicleId}/services
  ```

  **Request Body:**

  ```json
  {
    "date_of_service": "string",
    "procedures": "string",
    "cost": "number"
  }
  ```

- **Edit Service Record**

  ```http
  PUT /services/{serviceId}
  ```

  **Request Body:**

  ```json
  {
    "date_of_service": "string",
    "procedures": "string",
    "cost": "number",
    "document_index": "integer"
  }
  ```

- **Add Fix Record**

  ```http
  POST /vehicles/{vehicleId}/fixes
  ```

  **Request Body:**

  ```json
  {
    "date_of_fix": "string",
    "procedures": "string",
    "cost": "number"
  }
  ```

- **Edit Fix Record**

  ```http
  PUT /fixes/{fixId}
  ```

  **Request Body:**

  ```json
  {
    "date_of_fix": "string",
    "procedures": "string",
    "cost": "number",
    "document_index": "integer"
  }
  ```

- **Add Enhancement Record**

  ```http
  POST /vehicles/{vehicleId}/enhancements
  ```

  **Request Body:**

  ```json
  {
    "date_of_procedure": "string",
    "procedures": "string",
    "cost": "number"
  }
  ```

- **Edit Enhancement Record**

  ```http
  PUT /enhancements/{enhancementId}
  ```

  **Request Body:**

  ```json
  {
    "date_of_procedure": "string",
    "procedures": "string",
    "cost": "number",
    "document_index": "integer"
  }
  ```

### Scheduled Services

- **Schedule Service**

  ```http
  POST /scheduled_services
  ```

  **Request Body:**

  ```json
  {
    "vehicle_id": "integer",
    "date_of_service": "string",
    "procedures": "string",
    "cost": "number"
  }
  ```

- **Convert Scheduled Service to Service Record**

  ```http
  POST /scheduled_services/{scheduledServiceId}/convert
  ```

  **Request Body:**

  ```json
  {
    "date_of_service": "string",
    "procedures": "string",
    "cost": "number"
  }
  ```

## Contact

- **Manos Karadimos**: [manoskaradimos@outlook.com](mailto:manoskaradimos@outlook.com)
- **Manos Kounelakis**: [pkounelios@gmail.com](mailto:pkounelios@gmail.com)

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

