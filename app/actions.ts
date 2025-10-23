"use server";

import { db } from "@/scripts/db_conn";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { z } from "zod";

const signUpSchema = z.object({
  username: z
    .string()
    .min(2, "Username must be at least 2 characters")
    .max(20, "Username must be at most 20 characters"),
  email: z.string().email("Invalid email address"),
});

export async function addTask(data) {
  const CookieMonster = await cookies();
  const userId = CookieMonster.get("userId")?.value;
  if (!userId) {
    return { error: "Not authenticated" };
  }

  await db("todos").insert({ ...data, userId: Number(userId) });
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
  const CookieMonster = await cookies();
  const userId = CookieMonster.get("userId")?.value;

  if (!userId) {
    return [];
  }

  return await db("todos")
    .select("todos.*", "categories.name as categoryName")
    .leftJoin("categories", "todos.categoryId", "categories.id")
    .where("todos.userId", Number(userId))
    .orderBy("todos.categoryId", "asc")
    .orderBy("todos.createdAt", "desc");
}

export async function getCategories() {
  const CookieMonster = await cookies();
  const userId = CookieMonster.get("userId")?.value;

  if (!userId) {
    return [];
  }

  return await db("categories")
    .select("*")
    .where("userId", Number(userId))
    .orderBy("name", "asc");
}

export async function addCategory(data) {
  const CookieMonster = await cookies();
  const userId = CookieMonster.get("userId")?.value;
  if (!userId) {
    return { error: "Not authenticated" };
  }

  await db("categories").insert({ ...data, userId: Number(userId) });
  revalidatePath("/");
}

export async function updateTaskCategory(taskId: number, categoryId: number) {
  await db("todos").where("id", taskId).update({ categoryId });
  revalidatePath("/");
}

export async function signUp(data: any) {
  const validation = signUpSchema.safeParse(data);
  if (!validation.success) {
    return { error: validation.error.issues[0].message };
  }

  const existing = await db("users").where("email", data.email).first();
  if (existing) {
    return { error: "Email already exists" };
  }

  const [userId]: any = await db("users").insert(data).returning("id");
  const CookieMonster = await cookies();
  CookieMonster.set("userId", String(userId.id), { maxAge: 60 * 60 * 24 * 30 });

  revalidatePath("/");
  return { success: true, userId: userId.id };
}

export async function signIn(email: string) {
  const user = await db("users").where("email", email).first();
  if (!user) {
    return { error: "User not found" };
  }

  const CookieMonster = await cookies();
  CookieMonster.set("userId", String(user.id), { maxAge: 60 * 60 * 24 * 30 });

  revalidatePath("/");
  return { success: true, userId: user.id };
}

export async function getCurrentUser() {
  const CookieMonster = await cookies();
  const userId = CookieMonster.get("userId")?.value;

  if (!userId) {
    return null;
  }

  return await db("users").where("id", Number(userId)).first();
}

export async function signOut() {
  const CookieMonster = await cookies();
  CookieMonster.delete("userId");
  revalidatePath("/");
}
