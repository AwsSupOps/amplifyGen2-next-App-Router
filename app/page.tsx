import { revalidatePath } from "next/cache";
import { cookiesClient } from "@/utils/amplify-utils";

async function App() {
  const { data: todos } = await cookiesClient.models.Todo.list();

  async function addTodo(data: FormData) {
    "use server";
    const title = data.get("title") as string;
    await cookiesClient.models.Todo.create({
      content: title,
      done: false,
      priority: "medium",
    });
    revalidatePath("/");
  }
// delete data 
 async function deleteTodo(id: string) {
    "use server";
    await cookiesClient.models.Todo.delete({ id });
    revalidatePath("/");
  }


  return (
    <>
      <h1>Hello, Amplify 👋</h1>
      <form action={addTodo}>
        <input type="text" name="title" />
        <button type="submit">Add Todo</button>
      </form>

     
      <ul>
        {todos && todos.map((todo) => <li key={todo.id}>{todo.content}</li>)}

        <form action={() => deleteTodo(todo.id)} style={{ display: "inline" }}>
                <button type="submit">Delete</button>
        </form>
      </ul>
       
    </>
  );
}

export default App;
