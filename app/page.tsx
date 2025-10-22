import TodosComp from "@/components/todo";
import { getTodos, getCategories } from "@/app/actions";

export default async function Home() {
  const todos = await getTodos();
  const categories = await getCategories();
  return (
    <div>
      <TodosComp todos={todos} categories={categories} />
    </div>
  );
}
