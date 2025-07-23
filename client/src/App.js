import React, { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [userInput, setUserInput] = useState("");
  const [todosList, setTodosList] = useState([]);
  // const [hasSubmitted, setHasSubmitted] = useState(false);
  const [error, setError] = useState(null);
  const [editTodoId, setEditTodoId] = useState(null);

  //getting data through api
  useEffect(() => {
    fetch("http://localhost:5000/todos")
      .then((res) => res.json())
      .then((data) => setTodosList(data))
      .catch((err) => setError(err));
  }, []);
  //adding todos
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (userInput.trim() === "") return;
    //updating the value of name
    if (editTodoId) {
      const updateTodo = { name: userInput };
      try {
        const res = await fetch(`http://localhost:5000/todos/${editTodoId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updateTodo),
        });
        const data = await res.json();
        setTodosList((prev) =>
          prev.map((todo) => (todo.id === editTodoId ? data : todo))
        );
        setEditTodoId(null);
        setUserInput("");
      } catch (error) {
        console.log("error updating todo name", error);
      }
    } else {
      //adding new todo
      const newTodo = { name: userInput };
      try {
        const res = await fetch("http://localhost:5000/todos", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newTodo),
        });
        const data = await res.json();
        alert("todo added");
        setTodosList((prev) => [...prev, data]);
        console.log(data);
        setUserInput("");
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleChange = (e) => {
    setUserInput(e.target.value);
  };

  //deleting the item in todos
  const handleDelete = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/todos/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setTodosList((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
        console.log("deleted successfullt");
      } else {
        console.log("error deleting");
      }
    } catch (error) {
      console.log("error");
    }
  };

  //updating the todo
  const handleUpdate = (todo) => {
    setEditTodoId(todo.id);
    setUserInput(todo.name);
  };

  return (
    <div className="todoApp">
      <h1>Todo App</h1>
      {/* user input  */}
      <div>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={userInput}
            onChange={handleChange}
            placeholder="Type something to add task"
          />
          <button type="submit" value="submit">
            {editTodoId ? "Save Changes" : "Add Todo"}
          </button>
        </form>
      </div>

      {/* showing todos */}
      {error && <h1>{error.nessage}</h1>}
      {/* {hasSubmitted && */}
      {todosList.length > 0 &&
        todosList.map((todo) => (
          <ul key={todo.id}>
            <div className="listofTodos">
              <li>
                {todo.createdAt} - {todo.name}
              </li>
              <button className="delete" onClick={() => handleDelete(todo.id)}>
                {" "}
                ❌
              </button>
              <button className="update" onClick={() => handleUpdate(todo)}>
                {" "}
                ✏️ Edit
              </button>
            </div>
          </ul>
        ))}
    </div>
  );
}

export default App;
