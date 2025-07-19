/*
  "use client";

import { useState, useEffect } from "react";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";
import "./../app/app.css";
import { Amplify } from "aws-amplify";
import outputs from "@/amplify_outputs.json";
import "@aws-amplify/ui-react/styles.css";

Amplify.configure(outputs);

const client = generateClient<Schema>();

export default function App() {
  const [todos, setTodos] = useState<Array<Schema["Todo"]["type"]>>([]);

  function listTodos() {
    client.models.Todo.observeQuery().subscribe({
      next: (data) => setTodos([...data.items]),
    });
  }

  useEffect(() => {
    listTodos();
  }, []);

  function createTodo() {
    client.models.Todo.create({
      content: window.prompt("Todo content"),
    });
  }

  return (
    <main>
      <h1>My todos</h1>
      <button onClick={createTodo}>+ new</button>
      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>{todo.content}</li>
        ))}
      </ul>
      <div>
        🥳 App successfully hosted. Try creating a new todo.
        <br />
        <a href="https://docs.amplify.aws/nextjs/start/quickstart/nextjs-app-router-client-components/">
          Review next steps of this tutorial.
        </a>
      </div>
    </main>
  );
}

*/

// app/page.tsx

import { revalidatePath } from "next/cache";

import { AuthGetCurrentUserServer, cookiesClient } from "@/utils/amplify-utils";

//import Logout from "@/components/Logout";

async function App() {
  const user = await AuthGetCurrentUserServer();
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

  return (
    <>
      <h1>Hello, Amplify 👋</h1>
      
      <!-- {user && <Logout />}  -->
      <form action={addTodo}>
        <input type="text" name="title" />
        <button type="submit">Add Todo</button>
      </form>

      <ul>
        {todos && todos.map((todo) => <li key={todo.id}>{todo.content}</li>)}
      </ul>
    </>
  );
}

export default App;
