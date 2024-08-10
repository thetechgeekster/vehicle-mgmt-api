// database.js
const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./vehicles.db', (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to the SQLite database.');
    // Create tables
    db.serialize(() => {
      // Create Users table
      db.run(`CREATE TABLE IF NOT EXISTS Users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL UNIQUE,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL, -- Hashed with SHA-512
        settings TEXT
      )`);

      // Create Vehicles table
      db.run(`CREATE TABLE IF NOT EXISTS Vehicles (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        vin TEXT NOT NULL UNIQUE,
        make TEXT NOT NULL,
        model TEXT NOT NULL,
        date_of_manufacture DATE,
        date_of_purchase DATE,
        mileage_on_purchase INTEGER,
        photo BLOB,
        FOREIGN KEY(user_id) REFERENCES Users(id)
      )`);

      // Create Services table
      db.run(`CREATE TABLE IF NOT EXISTS Services (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        vehicle_id INTEGER,
        date_of_service DATE,
        procedures TEXT,
        cost REAL,
        document_index INTEGER,
        FOREIGN KEY(vehicle_id) REFERENCES Vehicles(id)
      )`);

      // Create Fixes table
      db.run(`CREATE TABLE IF NOT EXISTS Fixes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        vehicle_id INTEGER,
        date_of_fix DATE,
        procedures TEXT,
        cost REAL,
        document_index INTEGER,
        FOREIGN KEY(vehicle_id) REFERENCES Vehicles(id)
      )`);

      // Create Enhancements table
      db.run(`CREATE TABLE IF NOT EXISTS Enhancements (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        vehicle_id INTEGER,
        date_of_procedure DATE,
        procedures TEXT,
        cost REAL,
        document_index INTEGER,
        FOREIGN KEY(vehicle_id) REFERENCES Vehicles(id)
      )`);

      // Create Scheduled Services table
      db.run(`CREATE TABLE IF NOT EXISTS ScheduledServices (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        vehicle_id INTEGER,
        scheduled_date DATE,
        description TEXT,
        FOREIGN KEY(vehicle_id) REFERENCES Vehicles(id)
      )`);

      // Create Scheduled Fixes table
      db.run(`CREATE TABLE IF NOT EXISTS ScheduledFixes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        vehicle_id INTEGER,
        scheduled_date DATE,
        description TEXT,
        FOREIGN KEY(vehicle_id) REFERENCES Vehicles(id)
      )`);

      // Create Scheduled Enhancements table
      db.run(`CREATE TABLE IF NOT EXISTS ScheduledEnhancements (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        vehicle_id INTEGER,
        scheduled_date DATE,
        description TEXT,
        FOREIGN KEY(vehicle_id) REFERENCES Vehicles(id)
      )`);
    });
  }
});

module.exports = db;

