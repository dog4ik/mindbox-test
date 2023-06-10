import { BrowserRouter } from "react-router-dom";

import TodoList from "./components/TodoList";
import TodoProvider from "./context/TodoContext";

export default function App() {
  return (
    <BrowserRouter>
      <TodoProvider>
        <div className="todoapp">
          <TodoList />
        </div>
      </TodoProvider>
    </BrowserRouter>
  );
}
