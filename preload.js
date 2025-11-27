// preload.js
const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("api", {
  // --------------------
  // Customers
  // --------------------
  addCustomer: (customer) => ipcRenderer.invoke("add-customer", customer),
  getCustomers: () => ipcRenderer.invoke("get-customers"),

  // --------------------
  // Jobs
  // --------------------
  addJob: (job) => ipcRenderer.invoke("add-job", job),
  getJobs: () => ipcRenderer.invoke("get-jobs"),
  updateJobStatus: (data) => ipcRenderer.invoke("update-job-status", data),
  deleteJob: (id) => ipcRenderer.invoke("delete-job", id),

  // --------------------
  // Admin Password / Login
  // --------------------
  setPassword: (password) => ipcRenderer.invoke("set-password", password),
  login: (password) => ipcRenderer.invoke("login", password)
});
