import { useCallback, useMemo, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";

import TodoItem from "./TodoItem";
import { useTodoContext } from "../context/TodoContext";

export default function TodoList() {
  const location = useLocation();

  const path = location.pathname.replace("/", "");

  const { todos, addTodo, deleteTodo, setDone } = useTodoContext();

  const left = useMemo(
    () => todos.reduce((p, c) => p + (c.done ? 0 : 1), 0),
    [todos]
  );

  const visibleTodos = useMemo(
    () =>
      path
        ? todos.filter((i) => (path === "active" ? !i.done : i.done))
        : todos,
    [todos, path]
  );

  const anyDone = useMemo(() => todos.some((i) => i.done), [todos]);
  const allSelected = useMemo(
    () => visibleTodos.every((i) => i.done),
    [visibleTodos]
  );

  const onToggleAll = useCallback(() => {
    visibleTodos.forEach((i) => setDone(i.id, !allSelected));
  }, [visibleTodos, allSelected]);

  const onClearCompleted = useCallback(() => {
    todos.forEach((i) => {
      if (i.done) {
        deleteTodo(i.id);
      }
    });
  }, [todos]);

  const [input, setInput] = useState("");
  const onAddTodo = () => {
    if (input.trim()) {
      addTodo(input);
      setInput("");
    }
  };

  return (
    <>
      <header className="header">
        <h1>todos</h1>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onAddTodo();
          }}
        >
          <input
            className="new-todo"
            placeholder="What needs to be done?"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
        </form>
      </header>

      <section className="main">
        <input
          id="toggle-all"
          type="checkbox"
          className="toggle-all"
          checked={allSelected}
          onChange={onToggleAll}
        />
        <label htmlFor="toggle-all" />
        <ul className="todo-list">
          {visibleTodos.map((todo) => (
            <TodoItem key={todo.id} todo={todo} />
          ))}
        </ul>
      </section>

      <footer className="footer">
        <span className="todo-count">
          <strong>{left}</strong> items left
        </span>
        <ul className="filters">
          <li>
            <NavLink
              to="/"
              className={({ isActive }) => (isActive ? "selected" : "")}
            >
              All
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/active"
              className={({ isActive }) => (isActive ? "selected" : "")}
            >
              Active
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/completed"
              className={({ isActive }) => (isActive ? "selected" : "")}
            >
              Completed
            </NavLink>
          </li>
        </ul>
        {anyDone && (
          <button className="clear-completed" onClick={onClearCompleted}>
            Clear completed
          </button>
        )}
      </footer>
    </>
  );
}
