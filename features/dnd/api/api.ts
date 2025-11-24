import { Task } from "../types";

export async function fetchTasks(): Promise<Task[]> {
  const response = await fetch(
    "https://680ceb032ea307e081d56f4d.mockapi.io/myBlog"
  );

  if (!response.ok) throw new Error("Failed To Fetch");

  return response.json();
}

export async function updateTask(taskId: string, updates: Partial<Task>) {
  const response = await fetch(
    `https://680ceb032ea307e081d56f4d.mockapi.io/myBlog/${taskId}`,
    {
      method: "PUT",
      headers: { "Content-Type": "applications/json" },
      body: JSON.stringify(updates),
    }
  );

  if (!response.ok) throw new Error("Failed To Update Task");
  return response.json;
}

export async function CreateTask(newTask: Omit<Task, "id">): Promise<Task> {
  const response = await fetch(
    `https://680ceb032ea307e081d56f4d.mockapi.io/myBlog/`,
    {
      method: "POST",
      headers: { "Content-Type": "applications/json" },
      body: JSON.stringify(newTask),
    }
  );

  if (!response.ok) throw new Error("Failed To Create Task");
  return response.json();
}
