const express = require("express");
const fs = require("node:fs");
const cors = require("cors");
const app = express();
// const mongoes = require("mongoose");
// mongoes
//   .connect("mongodb://localhost:27017/sandhyadb", {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   })
//   .then(() => console.log("connected to mongodb"))
//   .catch((err) => console.error("connection error:", err));

app.listen(5000);
app.use(cors());
app.use(express.json());

function readTodos() {
  const res = fs.readFileSync("todos.json");
  const todos = JSON.parse(res);
  return todos;
}

function writeTodos(todos) {
  return fs.writeFileSync("todos.json", JSON.stringify(todos, null, 2));
}

// GET ALL TODOS
app.get("/todos", (req, res) => {
  res.send(readTodos());
});

// ADD A TODO
app.post("/todos", (req, res) => {
  const todos = readTodos();
  const date = new Date();
  const currentDate = date.toDateString();

  const data = {
    id: crypto.randomUUID(),
    name: req.body.name,
    description: req.body.description,
    completed: false,
    createdAt: currentDate,
  };
  todos.push(data);
  writeTodos(todos);

  res.json(data);
});

app
  .route("/todos/:id")
  // GET A TODO WITH ID
  .get((req, res) => {
    const id = req.params.id;
    const todos = readTodos();
    const todo = todos.find((todo) => todo.id == id);
    res.json(todo);
  })
  // UPDATE A TODO WITH ID
  .put((req, res) => {
    const id = req.params.id;
    const todos = readTodos();
    const todo = todos.find((todo) => todo.id == id);
    todo.name = req.body.name;
    todo.description = req.body.description;
    writeTodos(todos);
    res.json(todo);
  })
  // DELETE A TODO WITH ID
  .delete((req, res) => {
    const id = req.params.id;
    const todos = readTodos();
    const index = todos.findIndex((todo) => todo.id == id);
    if (index !== -1) {
      todos.splice(index, 1);
    }
    writeTodos(todos);
    res.send("deleted the todos");
  });
