"use server";

import { db } from "@/scripts/db_conn";
import { revalidatePath } from "next/cache";

export async function addTask(data) {
  await db("todos").insert(data);
  revalidatePath("/");
}

export async function deleteTask(taskId: number) {
  await db("todos").where("id", taskId).del();
  revalidatePath("/");
}

export async function toggleCompleted(taskId: number, completed: boolean) {
  const updateData = {
    completed: !completed,
    completedAt: !completed ? db.fn.now() : null,
  };

  console.log("task completed");
  await db("todos").where("id", taskId).update(updateData);
  revalidatePath("/");
}

export async function getTodos() {
  return await db("todos")
    .select("todos.*", "categories.name as categoryName")
    .leftJoin("categories", "todos.categoryId", "categories.id")
    .orderBy("todos.categoryId", "asc")
    .orderBy("todos.createdAt", "desc");
}

export async function getCategories() {
  return await db("categories").select("*").orderBy("name", "asc");
}

export async function addCategory(data) {
  await db("categories").insert(data);
  revalidatePath("/");
}

export async function updateTaskCategory(taskId: number, categoryId: number) {
  await db("todos").where("id", taskId).update({ categoryId });
  revalidatePath("/");
}
