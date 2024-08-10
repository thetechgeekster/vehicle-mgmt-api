// app.js
const express = require('express');
const multer = require('multer');
const crypto = require('crypto');
const db = require('./database');

const app = express();
const port = 3000;

// Middleware to parse JSON
app.use(express.json());

// Configure multer for file uploads
const upload = multer({ storage: multer.memoryStorage() });

// Helper function to hash passwords
const hashPassword = (password) => {
  const hash = crypto.createHash('sha512');
  hash.update(password);
  return hash.digest('hex');
};

// Register a new user
app.post('/users', (req, res) => {
  const { username, email, password, settings } = req.body;
  const hashedPassword = hashPassword(password);
  const sql = `INSERT INTO Users (username, email, password, settings)
               VALUES (?, ?, ?, ?)`;
  const params = [username, email, hashedPassword, JSON.stringify(settings)];

  db.run(sql, params, function (err) {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    res.status(201).json({ id: this.lastID });
  });
});

// Authenticate user (simple demonstration)
app.post('/login', (req, res) => {
  const { email, password } = req.body;
  const hashedPassword = hashPassword(password);
  
  const sql = `SELECT id FROM Users WHERE email = ? AND password = ?`;
  db.get(sql, [email, hashedPassword], (err, row) => {
    if (err || !row) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }
    res.status(200).json({ userId: row.id });
  });
});

// Get all vehicles of a user
app.get('/users/:userId/vehicles', (req, res) => {
  const { userId } = req.params;
  
  const sql = `SELECT * FROM Vehicles WHERE user_id = ?`;
  db.all(sql, [userId], (err, rows) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    res.json({ vehicles: rows });
  });
});

// Add a vehicle
app.post('/vehicles', upload.single('photo'), (req, res) => {
  const { userId, vin, make, model, date_of_manufacture, date_of_purchase, mileage_on_purchase } = req.body;
  const photo = req.file ? req.file.buffer : null;

  const sql = `INSERT INTO Vehicles (user_id, vin, make, model, date_of_manufacture, date_of_purchase, mileage_on_purchase, photo)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
  const params = [userId, vin, make, model, date_of_manufacture, date_of_purchase, mileage_on_purchase, photo];

  db.run(sql, params, function (err) {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    res.status(201).json({ id: this.lastID });
  });
});

// Add a service record
app.post('/vehicles/:vehicleId/services', (req, res) => {
  const { vehicleId } = req.params;
  const { date_of_service, procedures, cost } = req.body;
  const document_index = Math.floor(Math.random() * 100000); // Generate random document index

  const sql = `INSERT INTO Services (vehicle_id, date_of_service, procedures, cost, document_index)
               VALUES (?, ?, ?, ?, ?)`;
  const params = [vehicleId, date_of_service, procedures, cost, document_index];

  db.run(sql, params, function (err) {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    res.status(201).json({ id: this.lastID });
  });
});

// Add a fix record
app.post('/vehicles/:vehicleId/fixes', (req, res) => {
  const { vehicleId } = req.params;
  const { date_of_fix, procedures, cost } = req.body;
  const document_index = Math.floor(Math.random() * 100000); // Generate random document index

  const sql = `INSERT INTO Fixes (vehicle_id, date_of_fix, procedures, cost, document_index)
               VALUES (?, ?, ?, ?, ?)`;
  const params = [vehicleId, date_of_fix, procedures, cost, document_index];

  db.run(sql, params, function (err) {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    res.status(201).json({ id: this.lastID });
  });
});

// Add an enhancement record
app.post('/vehicles/:vehicleId/enhancements', (req, res) => {
  const { vehicleId } = req.params;
  const { date_of_procedure, procedures, cost } = req.body;
  const document_index = Math.floor(Math.random() * 100000); // Generate random document index

  const sql = `INSERT INTO Enhancements (vehicle_id, date_of_procedure, procedures, cost, document_index)
               VALUES (?, ?, ?, ?, ?)`;
  const params = [vehicleId, date_of_procedure, procedures, cost, document_index];

  db.run(sql, params, function (err) {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    res.status(201).json({ id: this.lastID });
  });
});

// Get all services, fixes, enhancements by user
app.get('/users/:userId/records', (req, res) => {
  const { userId } = req.params;

  const sql = `
    SELECT 'service' AS type, s.id, s.vehicle_id, s.date_of_service AS date, s.procedures, s.cost, s.document_index 
    FROM Services s
    INNER JOIN Vehicles v ON s.vehicle_id = v.id
    WHERE v.user_id = ?
    UNION
    SELECT 'fix' AS type, f.id, f.vehicle_id, f.date_of_fix AS date, f.procedures, f.cost, f.document_index 
    FROM Fixes f
    INNER JOIN Vehicles v ON f.vehicle_id = v.id
    WHERE v.user_id = ?
    UNION
    SELECT 'enhancement' AS type, e.id, e.vehicle_id, e.date_of_procedure AS date, e.procedures, e.cost, e.document_index 
    FROM Enhancements e
    INNER JOIN Vehicles v ON e.vehicle_id = v.id
    WHERE v.user_id = ?
  `;

  const params = [userId, userId, userId];

  db.all(sql, params, (err, rows) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    res.json({ records: rows });
  });
});

// Edit a service
app.put('/services/:serviceId', (req, res) => {
  const { serviceId } = req.params;
  const { date_of_service, procedures, cost, document_index } = req.body;

  const sql = `UPDATE Services SET date_of_service = ?, procedures = ?, cost = ?, document_index = ? WHERE id = ?`;
  const params = [date_of_service, procedures, cost, document_index, serviceId];

  db.run(sql, params, function (err) {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    res.json({ message: 'Service updated successfully' });
  });
});

// Edit a fix
app.put('/fixes/:fixId', (req, res) => {
  const { fixId } = req.params;
  const { date_of_fix, procedures, cost, document_index } = req.body;

  const sql = `UPDATE Fixes SET date_of_fix = ?, procedures = ?, cost = ?, document_index = ? WHERE id = ?`;
  const params = [date_of_fix, procedures, cost, document_index, fixId];

  db.run(sql, params, function (err) {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    res.json({ message: 'Fix updated successfully' });
  });
});

// Edit an enhancement
app.put('/enhancements/:enhancementId', (req, res) => {
  const { enhancementId } = req.params;
  const { date_of_procedure, procedures, cost, document_index } = req.body;

  const sql = `UPDATE Enhancements SET date_of_procedure = ?, procedures = ?, cost = ?, document_index = ? WHERE id = ?`;
  const params = [date_of_procedure, procedures, cost, document_index, enhancementId];

  db.run(sql, params, function (err) {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    res.json({ message: 'Enhancement updated successfully' });
  });
});

// Add a scheduled service
app.post('/vehicles/:vehicleId/scheduled-services', (req, res) => {
  const { vehicleId } = req.params;
  const { scheduled_date, description } = req.body;

  const sql = `INSERT INTO ScheduledServices (vehicle_id, scheduled_date, description)
               VALUES (?, ?, ?)`;
  const params = [vehicleId, scheduled_date, description];

  db.run(sql, params, function (err) {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    res.status(201).json({ id: this.lastID });
  });
});

// Convert a scheduled service to a service record
app.post('/vehicles/:vehicleId/convert-scheduled-service/:scheduledServiceId', (req, res) => {
  const { vehicleId, scheduledServiceId } = req.params;
  const { procedures, cost } = req.body;
  const document_index = Math.floor(Math.random() * 100000); // Generate random document index

  // Get scheduled service details
  const getScheduledServiceSql = `SELECT * FROM ScheduledServices WHERE id = ? AND vehicle_id = ?`;
  db.get(getScheduledServiceSql, [scheduledServiceId, vehicleId], (err, row) => {
    if (err || !row) {
      return res.status(400).json({ error: 'Scheduled service not found' });
    }

    const { scheduled_date } = row;

    // Insert into Services table
    const insertServiceSql = `INSERT INTO Services (vehicle_id, date_of_service, procedures, cost, document_index)
                              VALUES (?, ?, ?, ?, ?)`;
    const insertServiceParams = [vehicleId, scheduled_date, procedures, cost, document_index];

    db.run(insertServiceSql, insertServiceParams, function (err) {
      if (err) {
        return res.status(400).json({ error: err.message });
      }

      // Delete from ScheduledServices table
      const deleteScheduledServiceSql = `DELETE FROM ScheduledServices WHERE id = ?`;
      db.run(deleteScheduledServiceSql, [scheduledServiceId], function (err) {
        if (err) {
          return res.status(400).json({ error: err.message });
        }
        res.status(200).json({ message: 'Scheduled service converted to service record', serviceId: this.lastID });
      });
    });
  });
});

// Add a scheduled fix
app.post('/vehicles/:vehicleId/scheduled-fixes', (req, res) => {
  const { vehicleId } = req.params;
  const { scheduled_date, description } = req.body;

  const sql = `INSERT INTO ScheduledFixes (vehicle_id, scheduled_date, description)
               VALUES (?, ?, ?)`;
  const params = [vehicleId, scheduled_date, description];

  db.run(sql, params, function (err) {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    res.status(201).json({ id: this.lastID });
  });
});

// Convert a scheduled fix to a fix record
app.post('/vehicles/:vehicleId/convert-scheduled-fix/:scheduledFixId', (req, res) => {
  const { vehicleId, scheduledFixId } = req.params;
  const { procedures, cost } = req.body;
  const document_index = Math.floor(Math.random() * 100000); // Generate random document index

  // Get scheduled fix details
  const getScheduledFixSql = `SELECT * FROM ScheduledFixes WHERE id = ? AND vehicle_id = ?`;
  db.get(getScheduledFixSql, [scheduledFixId, vehicleId], (err, row) => {
    if (err || !row) {
      return res.status(400).json({ error: 'Scheduled fix not found' });
    }

    const { scheduled_date } = row;

    // Insert into Fixes table
    const insertFixSql = `INSERT INTO Fixes (vehicle_id, date_of_fix, procedures, cost, document_index)
                          VALUES (?, ?, ?, ?, ?)`;
    const insertFixParams = [vehicleId, scheduled_date, procedures, cost, document_index];

    db.run(insertFixSql, insertFixParams, function (err) {
      if (err) {
        return res.status(400).json({ error: err.message });
      }

      // Delete from ScheduledFixes table
      const deleteScheduledFixSql = `DELETE FROM ScheduledFixes WHERE id = ?`;
      db.run(deleteScheduledFixSql, [scheduledFixId], function (err) {
        if (err) {
          return res.status(400).json({ error: err.message });
        }
        res.status(200).json({ message: 'Scheduled fix converted to fix record', fixId: this.lastID });
      });
    });
  });
});

// Add a scheduled enhancement
app.post('/vehicles/:vehicleId/scheduled-enhancements', (req, res) => {
  const { vehicleId } = req.params;
  const { scheduled_date, description } = req.body;

  const sql = `INSERT INTO ScheduledEnhancements (vehicle_id, scheduled_date, description)
               VALUES (?, ?, ?)`;
  const params = [vehicleId, scheduled_date, description];

  db.run(sql, params, function (err) {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    res.status(201).json({ id: this.lastID });
  });
});

// Convert a scheduled enhancement to an enhancement record
app.post('/vehicles/:vehicleId/convert-scheduled-enhancement/:scheduledEnhancementId', (req, res) => {
  const { vehicleId, scheduledEnhancementId } = req.params;
  const { procedures, cost } = req.body;
  const document_index = Math.floor(Math.random() * 100000); // Generate random document index

  // Get scheduled enhancement details
  const getScheduledEnhancementSql = `SELECT * FROM ScheduledEnhancements WHERE id = ? AND vehicle_id = ?`;
  db.get(getScheduledEnhancementSql, [scheduledEnhancementId, vehicleId], (err, row) => {
    if (err || !row) {
      return res.status(400).json({ error: 'Scheduled enhancement not found' });
    }

    const { scheduled_date } = row;

    // Insert into Enhancements table
    const insertEnhancementSql = `INSERT INTO Enhancements (vehicle_id, date_of_procedure, procedures, cost, document_index)
                                  VALUES (?, ?, ?, ?, ?)`;
    const insertEnhancementParams = [vehicleId, scheduled_date, procedures, cost, document_index];

    db.run(insertEnhancementSql, insertEnhancementParams, function (err) {
      if (err) {
        return res.status(400).json({ error: err.message });
      }

      // Delete from ScheduledEnhancements table
      const deleteScheduledEnhancementSql = `DELETE FROM ScheduledEnhancements WHERE id = ?`;
      db.run(deleteScheduledEnhancementSql, [scheduledEnhancementId], function (err) {
        if (err) {
          return res.status(400).json({ error: err.message });
        }
        res.status(200).json({ message: 'Scheduled enhancement converted to enhancement record', enhancementId: this.lastID });
      });
    });
  });
});

// Search records by vehicle and date
app.get('/vehicles/:vehicleId/records', (req, res) => {
  const { vehicleId } = req.params;
  const { startDate, endDate } = req.query;

  const sql = `
    SELECT 'service' AS type, date_of_service AS date, procedures, cost, document_index FROM Services WHERE vehicle_id = ? AND date_of_service BETWEEN ? AND ?
    UNION
    SELECT 'fix' AS type, date_of_fix AS date, procedures, cost, document_index FROM Fixes WHERE vehicle_id = ? AND date_of_fix BETWEEN ? AND ?
    UNION
    SELECT 'enhancement' AS type, date_of_procedure AS date, procedures, cost, document_index FROM Enhancements WHERE vehicle_id = ? AND date_of_procedure BETWEEN ? AND ?
  `;

  const params = [vehicleId, startDate, endDate, vehicleId, startDate, endDate, vehicleId, startDate, endDate];

  db.all(sql, params, (err, rows) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    res.json({ records: rows });
  });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

