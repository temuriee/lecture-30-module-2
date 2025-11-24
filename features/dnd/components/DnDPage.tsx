"use client";

import { CreateTask, fetchTasks, updateTask } from "../api/api";
import { COLUMNS } from "../data/data";
import { Task } from "../types";
import Column from "./Column";
import { DndContext, DragEndEvent } from "@dnd-kit/core";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const DndPage = () => {
  const queryClient = useQueryClient();

  const {
    data: tasks = [],
    error,
    isLoading,
  } = useQuery({
    queryKey: ["tasks"],
    queryFn: fetchTasks,
  });

  const mutation = useMutation({
    mutationFn: (updatedTask: Task) => updateTask(updatedTask.id, updatedTask),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over) return;

    const taskId = active.id as string;

    const newStatus = over.id as Task["status"];

    const task = tasks.find((eachElement) => eachElement.id === taskId);
    if (!task || task.status === newStatus) return;

    const updatedTask = { ...task, status: newStatus };

    mutation.mutate(updatedTask);
  }

  const createTaskMutation = useMutation({
    mutationFn: CreateTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });

  function handleCreateTask(newTask: Omit<Task, "id">) {
    createTaskMutation.mutate(newTask);
  }

  if (isLoading) return <p>Loading..</p>;

  return (
    <div className="p-4">
      <div className="flex gap-8">
        <DndContext onDragEnd={handleDragEnd}>
          {COLUMNS.map((column) => (
            <Column
              key={column.id}
              column={column}
              tasks={tasks.filter((task) => task.status === column.id)}
              onCreateTask={handleCreateTask}
            />
          ))}
        </DndContext>
      </div>
    </div>
  );
};

export default DndPage;
