import axios from "axios";
import { useEffect, useState } from "react";
import type { User } from "./types/User";

const API_BASE_URL = "http://localhost:3000";

export default function UserList() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        console.log("Fetching users from backend...");
        const response = await axios.get<User[]>(`${API_BASE_URL}/users`);
        setUsers(response.data);
        console.log("Users fetched successfully:", response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) return <p>Loading users...</p>;

  return (
    <div>
      <h2>All Users</h2>
      {users.length === 0 ? (
        <p>No users found.</p>
      ) : (
        <ul>
          {users.map((user) => (
            <li key={user.id}>
              <strong>{user.name}</strong> — {user.email} ({user.role})
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
