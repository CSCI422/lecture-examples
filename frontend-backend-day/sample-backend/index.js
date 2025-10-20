const express = require("express");
const app = express();
const PORT = 3000;

app.use(express.json());

// Middleware to log every request (optional, global)
app.use((req, res, next) => {
  console.log(`🔹 [${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

// In-memory user storage
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
  console.log("📥 GET /users - Returning all users");
  res.json(users);
});

// GET /users/:id - get user by ID
app.get("/users/:id", (req, res) => {
  const id = parseInt(req.params.id);
  console.log(`📥 GET /users/${id} - Request for user ID: ${id}`);
  const user = users.find((u) => u.id === id);
  if (!user) {
    console.log(`⚠️ User with ID ${id} not found`);
    return res.status(404).json({ message: "User not found" });
  }
  res.json(user);
});

// POST /users - create new user
app.post("/users", (req, res) => {
  console.log("📤 POST /users - Creating a new user");
  console.log("📝 Request body:", req.body);

  const { name, email, age, role } = req.body;
  if (!name || !email) {
    console.log("❌ Missing required fields: name or email");
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
  console.log(`✅ User created with ID ${newUser.id}`);
  res.status(201).json(newUser);
});

// PUT /users/:id - update existing user
app.put("/users/:id", (req, res) => {
  const id = parseInt(req.params.id);
  console.log(`🛠️ PUT /users/${id} - Updating user`);
  console.log("📝 Request body:", req.body);

  const user = users.find((u) => u.id === id);
  if (!user) {
    console.log(`⚠️ User with ID ${id} not found`);
    return res.status(404).json({ message: "User not found" });
  }

  const { name, email, age, role } = req.body;
  if (name) user.name = name;
  if (email) user.email = email;
  if (age) user.age = age;
  if (role) user.role = role;

  console.log(`✅ User with ID ${id} updated`);
  res.json(user);
});

// DELETE /users/:id - delete user by ID
app.delete("/users/:id", (req, res) => {
  const id = parseInt(req.params.id);
  console.log(`🗑️ DELETE /users/${id} - Deleting user`);

  const index = users.findIndex((u) => u.id === id);
  if (index === -1) {
    console.log(`⚠️ User with ID ${id} not found`);
    return res.status(404).json({ message: "User not found" });
  }

  const deleted = users.splice(index, 1);
  console.log(`✅ User with ID ${id} deleted`);
  res.json({ message: "User deleted", user: deleted[0] });
});

// Start server
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
