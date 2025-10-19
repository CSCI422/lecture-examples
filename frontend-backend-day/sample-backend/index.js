// Simple Node.js + Express Backend for User Management
const express = require("express");
const app = express();
const PORT = 3000;

app.use(express.json());

// In-memory user storage (mock database)
let users = [
  { id: 1, name: "Alice Johnson", email: "alice@example.com", age: 28, role: "Designer" },
  { id: 2, name: "Bob Smith", email: "bob@example.com", age: 34, role: "Developer" },
  { id: 3, name: "Charlie Kim", email: "charlie@example.com", age: 41, role: "Manager" },
  { id: 4, name: "Diana Lee", email: "diana@example.com", age: 25, role: "Engineer" },
  { id: 5, name: "Ethan Brown", email: "ethan@example.com", age: 30, role: "Support" },
  { id: 6, name: "Fiona Davis", email: "fiona@example.com", age: 27, role: "HR" },
  { id: 7, name: "George Harris", email: "george@example.com", age: 38, role: "Architect" },
  { id: 8, name: "Hannah White", email: "hannah@example.com", age: 32, role: "Product Owner" },
  { id: 9, name: "Ian Black", email: "ian@example.com", age: 29, role: "QA" },
  { id: 10, name: "Julia Green", email: "julia@example.com", age: 35, role: "Marketing" },
];

// GET /users - get all users
app.get("/users", (req, res) => {
  res.json(users);
});

// GET /users/:id - get user by ID
app.get("/users/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const user = users.find((u) => u.id === id);
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json(user);
});

// POST /users - create new user
app.post("/users", (req, res) => {
  const { name, email, age, role } = req.body;
  if (!name || !email) {
    return res.status(400).json({ message: "Name and email are required" });
  }
  const newUser = {
    id: users.length ? Math.max(...users.map((u) => u.id)) + 1 : 1,
    name,
    email,
    age: age || null,
    role: role || "User",
  };
  users.push(newUser);
  res.status(201).json(newUser);
});

// UPDATE /users/:id - update existing user
app.put("/users/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const user = users.find((u) => u.id === id);
  if (!user) return res.status(404).json({ message: "User not found" });

  const { name, email, age, role } = req.body;
  if (name) user.name = name;
  if (email) user.email = email;
  if (age) user.age = age;
  if (role) user.role = role;

  res.json(user);
});

// DELETE /users/:id - delete user by ID
app.delete("/users/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const index = users.findIndex((u) => u.id === id);
  if (index === -1) return res.status(404).json({ message: "User not found" });

  const deleted = users.splice(index, 1);
  res.json({ message: "User deleted", user: deleted[0] });
});

// Start the server
app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));
