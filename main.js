const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const Database = require("better-sqlite3");
const bcrypt = require("bcryptjs");

// VirtualBox GPU fix
app.disableHardwareAcceleration();

// Connect to SQLite database
const db = new Database("./database/techdesk.db");

// Create Customers table
db.prepare(`
  CREATE TABLE IF NOT EXISTS customers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    first_name TEXT,
    last_name TEXT,
    email TEXT,
    phone TEXT
  )
`).run();

// Create Jobs table
db.prepare(`
  CREATE TABLE IF NOT EXISTS jobs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    customer_id INTEGER,
    description TEXT,
    status TEXT DEFAULT 'pending',
    notes TEXT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`).run();

// Create Settings table for admin password
db.prepare(`
  CREATE TABLE IF NOT EXISTS settings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    admin_password TEXT
  )
`).run();

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, "preload.js")
    }
  });

  // Load Vite frontend
  win.loadURL("http://localhost:5173");
}

// =============================
// IPC HANDLERS
// =============================

// Add Customer
ipcMain.handle("add-customer", (event, cust) => {
  const stmt = db.prepare(`
    INSERT INTO customers (first_name, last_name, email, phone)
    VALUES (@first_name, @last_name, @email, @phone)
  `);
  stmt.run(cust);
  return { success: true };
});

// Get all customers
ipcMain.handle("get-customers", () => {
  return db.prepare("SELECT * FROM customers").all();
});

// Add Job
ipcMain.handle("add-job", (event, job) => {
  const stmt = db.prepare(`
    INSERT INTO jobs (customer_id, description, status, notes)
    VALUES (@customer_id, @description, @status, @notes)
  `);
  stmt.run(job);
  return { success: true };
});

// Get all jobs
ipcMain.handle("get-jobs", () => {
  return db.prepare("SELECT * FROM jobs").all();
});


// Update job status
ipcMain.handle("update-job-status", (event, data) => {
  const stmt = db.prepare(`
    UPDATE jobs SET status = @status WHERE id = @id
  `);
  stmt.run(data);
  return { success: true };
});

// Delete job
ipcMain.handle("delete-job", (event, id) => {
  const stmt = db.prepare(`DELETE FROM jobs WHERE id = ?`);
  stmt.run(id);
  return { success: true };
});

// Set admin password (first time setup)
ipcMain.handle("set-password", (event, password) => {
  const hashed = bcrypt.hashSync(password, 10);
  db.prepare("INSERT INTO settings (admin_password) VALUES (?)").run(hashed);
  return { success: true };
});

// Login check
ipcMain.handle("login", (event, password) => {
  const row = db.prepare("SELECT admin_password FROM settings LIMIT 1").get();
  
  if (!row) {
    return { error: "NO_PASSWORD_SET" };
  }

  const matches = bcrypt.compareSync(password, row.admin_password);
  return { success: matches };
});

// Fetch all customers
ipcMain.handle("getCustomers", async () => {
  try {
    const stmt = db.prepare("SELECT * FROM customers ORDER BY id DESC");
    const rows = stmt.all();
    return rows;
  } catch (error) {
    console.error("DB Fetch Error:", error);
    return [];
  }
});


app.whenReady().then(createWindow);
