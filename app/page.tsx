import TodosComp from "@/components/todo";
import { getTodos, getCategories, getCurrentUser } from "@/app/actions";

export default async function Home() {
  const currentUser = await getCurrentUser();
  const todos = await getTodos();
  const categories = await getCategories();

  return (
    <div>
      <TodosComp
        todos={todos}
        categories={categories}
        currentUser={currentUser}
      />
    </div>
  );
}
