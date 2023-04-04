import React, { useEffect } from "react";
import "./styles.css";
import TodoList from "./todo/TodoList";
import Context from "./context";
import Modal from "./modal/Modal";
import Loader from "./loader";

const AddTodo = React.lazy(
  () =>
    new Promise((resolve) => {
      setTimeout(() => {
        resolve(import("./todo/AddTodo"));
      }, 3000);
    })
);

export default function App() {
  const [todos, setTodos] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/todos?_limit=5")
      .then((response) => response.json())
      .then((todos) => {
        setTimeout(() => {
          setTodos(todos);
          setLoading(false);
        }, 2000);
      });
  }, []);

  function toggleTodo(id) {
    setTodos(
      todos.map((todo) => {
        if (todo.id === id) {
          todo.completed = !todo.completed;
        }

        return todo;
      })
    );
  }

  function removeTodo(id) {
    setTodos(todos.filter((todo) => todo.id !== id));
  }

  function addTodo(title) {
    setTodos(
      todos.concat([
        {
          title,
          id: Date.now(),
          complit: false
        }
      ])
    );
  }

  return (
    <Context.Provider value={{ removeTodo }}>
      <div className="wraper">
        <h1>React tutorial</h1>
        <Modal />
        <React.Suspense fallback={<p>Loading.....</p>}>
          <AddTodo onCreate={addTodo} />
        </React.Suspense>

        {loading && <Loader />}
        {todos.length ? (
          <TodoList todos={todos} onToggle={toggleTodo} />
        ) : loading ? null : (
          <p> No todos ! </p>
        )}
      </div>
    </Context.Provider>
  );
}
