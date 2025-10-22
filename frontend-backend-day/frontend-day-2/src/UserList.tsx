import type { User } from "./types/User";

const API_BASE_URL = "http://localhost:3000"; // Your Node.js backend URL

import { useQuery } from '@tanstack/react-query';

async function fetchUsers() {
  const res = await fetch(`${API_BASE_URL}/users`);
  return await res.json();
}

export default function Users() {
  const { data, error, isLoading } = useQuery<User[]>({
    queryKey: ['users'],
    queryFn: fetchUsers,
  });

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error loading users 😢</p>;

  return (
    <ul className="user-list">
      {data?.map((user) => (
        <li key={user.id} className="user-item">
          {user.name}
        </li>
      ))}
    </ul>
  );
}