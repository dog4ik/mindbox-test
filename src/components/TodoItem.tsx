import { useCallback, useState } from "react";

import { useTodoContext, TodoType } from "../context/TodoContext";

export default function TodoItem({ todo }: { todo: TodoType }) {
  const { deleteTodo, setLabel, toggleDone } = useTodoContext();

  const [editing, setEditing] = useState(false);

  const onDelete = useCallback(() => deleteTodo(todo.id), [todo.id]);
  const onDone = useCallback(() => toggleDone(todo.id), [todo.id]);

  const finishedCallback = () => {
    setEditing(false);
    if (todo.label.trim() === "") {
      deleteTodo(todo.id);
    } else {
      setLabel(todo.id, todo.label.trim());
    }
  };

  return (
    <li
      onDoubleClick={() => {
        setEditing(true);
      }}
      className={`${editing ? "editing" : ""} ${todo.done ? "completed" : ""}`}
    >
      <div className="view">
        <input
          type="checkbox"
          className="toggle"
          checked={todo.done}
          onChange={onDone}
          autoFocus={true}
        />
        <label>{todo.label}</label>
        <button className="destroy" onClick={onDelete} />
      </div>
      {editing && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            finishedCallback();
          }}
        >
          <input
            autoFocus
            className="edit"
            value={todo.label}
            onChange={(e) => setLabel(todo.id, e.target.value)}
            onBlur={finishedCallback}
          />
        </form>
      )}
    </li>
  );
}
