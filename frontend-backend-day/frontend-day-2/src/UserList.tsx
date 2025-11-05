import { useState } from "react";
import {
  Card,
  List,
  Avatar,
  Text,
  Group,
  Loader,
  Center,
  Alert,
  Title,
  Button,
  Modal,
  TextInput,
  NumberInput,
  Select,
  Stack,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconAlertCircle, IconTrash, IconEdit, IconUserPlus } from "@tabler/icons-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { User } from "./types/User";

const API_BASE_URL = "http://localhost:3000";

// Strongly typed operation types
type CreateUserData = Omit<User, "id">;
type UpdateUserData = Omit<User, "id">;

// --- Fetch all users ---
async function fetchUsers(): Promise<User[]> {
  const res = await fetch(`${API_BASE_URL}/users`);
  if (!res.ok) throw new Error("Failed to fetch users");
  return res.json();
}

// --- Create user ---
async function createUser(newUser: CreateUserData): Promise<User> {
  const res = await fetch(`${API_BASE_URL}/users`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newUser),
  });
  if (!res.ok) throw new Error("Failed to create user");
  return res.json();
}

// --- Update user ---
async function updateUser(id: number, updatedUser: UpdateUserData): Promise<User> {
  const res = await fetch(`${API_BASE_URL}/users/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updatedUser),
  });
  if (!res.ok) throw new Error("Failed to update user");
  return res.json();
}

// --- Delete user ---
async function deleteUser(id: number): Promise<{ message: string; user: User }> {
  const res = await fetch(`${API_BASE_URL}/users/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete user");
  return res.json();
}

export default function UserList() {
  const queryClient = useQueryClient();

  // --- Fetch users ---
  const { data, error, isLoading } = useQuery<User[]>({
    queryKey: ["users"],
    queryFn: fetchUsers,
  });

  // --- Modal control ---
  const [opened, { open, close }] = useDisclosure(false);
  const [editUser, setEditUser] = useState<User | null>(null);

  // --- Form state ---
  const [form, setForm] = useState<CreateUserData>({
    name: "",
    email: "",
    age: null,
    role: "",
  });

  // --- Mutations ---
  const createMutation = useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      // ✅ Clear form and edit state
      setForm({ name: "", email: "", age: null, role: "" });
      setEditUser(null);
      close();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateUserData }) =>
      updateUser(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      // ✅ Clear form and edit state
      setForm({ name: "", email: "", age: null, role: "" });
      setEditUser(null);
      close();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["users"] }),
  });

  // --- Handlers ---
  const handleSubmit = () => {
    if (!form.name || !form.email) return;
    if (editUser) {
      updateMutation.mutate({ id: editUser.id, data: form });
    } else {
      createMutation.mutate(form);
    }
  };

  const handleEdit = (user: User) => {
    setEditUser(user);
    setForm({
      name: user.name,
      email: user.email,
      age: user.age ?? null,
      role: user.role ?? "",
    });
    open();
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this user?")) {
      deleteMutation.mutate(id);
    }
  };

  // --- Loading / Error states ---
  if (isLoading)
    return (
      <Center h="100vh">
        <Loader color="blue" size="lg" />
      </Center>
    );

  if (error)
    return (
      <Center h="100vh">
        <Alert
          icon={<IconAlertCircle size={20} />}
          title="Error loading users 😢"
          color="red"
          radius="md"
        >
          Could not fetch users from the server.
        </Alert>
      </Center>
    );

  // --- Render ---
  return (
    <>
      {/* Create/Edit Modal */}
      <Modal
        opened={opened}
        onClose={close}
        title={editUser ? "Edit User" : "Create New User"}
        centered
      >
        <Stack>
          <TextInput
            label="Name"
            placeholder="John Doe"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.currentTarget.value })}
            required
          />
          <TextInput
            label="Email"
            placeholder="john@example.com"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.currentTarget.value })}
            required
          />
          <NumberInput
            label="Age"
            placeholder="30"
            value={form.age ?? undefined}
            onChange={(value) => setForm({ ...form, age: value as number })}
          />
          <Select
            label="Role"
            placeholder="Select role"
            data={[
              "Developer",
              "Designer",
              "Manager",
              "Engineer",
              "Support",
              "HR",
              "Product Owner",
              "Architect",
              "Marketing",
            ]}
            value={form.role || ""}
            onChange={(value) => setForm({ ...form, role: value || "" })}
          />
          <Button onClick={handleSubmit}>
            {editUser ? "Update User" : "Create User"}
          </Button>
        </Stack>
      </Modal>

      {/* Main User List */}
      <Card shadow="sm" p="lg" radius="md" withBorder>
        <Group justify="space-between" mb="md">
          <Title order={3}>User List</Title>
          <Button
            leftSection={<IconUserPlus size={18} />}
            onClick={() => {
              setEditUser(null);
              setForm({ name: "", email: "", age: null, role: "" });
              open();
            }}
          >
            Add User
          </Button>
        </Group>

        <List spacing="sm">
          {data?.map((user) => (
            <List.Item
              key={user.id}
              icon={
                <Avatar color="blue" radius="xl">
                  {user.name.charAt(0).toUpperCase()}
                </Avatar>
              }
            >
              <Group justify="space-between" align="center" wrap="nowrap">
                <div style={{ flex: 1 }}>
                  <Text fw={500}>{user.name}</Text>
                  <Text size="sm" c="dimmed">
                    {user.email} — {user.role ?? "No role"}
                  </Text>
                </div>
                <Group gap="xs">
                  <Button
                    variant="subtle"
                    color="blue"
                    size="xs"
                    leftSection={<IconEdit size={16} />}
                    onClick={() => handleEdit(user)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="subtle"
                    color="red"
                    size="xs"
                    leftSection={<IconTrash size={16} />}
                    onClick={() => handleDelete(user.id)}
                  >
                    Delete
                  </Button>
                </Group>
              </Group>
            </List.Item>
          ))}
        </List>
      </Card>
    </>
  );
}
