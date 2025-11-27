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

  // --------------------
  // Admin Password / Login
  // --------------------
  setPassword: (password) => ipcRenderer.invoke("set-password", password),
  login: (password) => ipcRenderer.invoke("login", password)
});
