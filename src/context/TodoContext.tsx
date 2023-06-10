import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useReducer,
} from "react";
import { v4 } from "uuid";

type ContextType = {
  todos: TodoType[];
  deleteTodo: (id: string) => void;
  addTodo: (label: string) => void;
  setDone: (id: string, done: boolean) => void;
  toggleDone: (id: string) => void;
  setLabel: (id: string, label: string) => void;
};

export type TodoType = {
  id: string;
  done: boolean;
  label: string;
};

export type Action =
  | { type: "DELETE_TODO"; payload: { id: string } }
  | { type: "ADD_TODO"; payload: TodoType }
  | { type: "SET_DONE"; payload: { id: string; done: boolean } }
  | { type: "SET_LABEL"; payload: { id: string; label: string } }
  | { type: "TOGGLE_DONE"; payload: { id: string } };

export const TodoContext = createContext<ContextType>({} as ContextType);

let initialState: TodoType[] = [];
if (typeof window !== "undefined")
  try {
    let todos = localStorage.getItem("todos");
    if (todos !== undefined) {
      initialState = JSON.parse(localStorage.getItem("todos") ?? "[]");
      if (
        initialState.some(
          (todo) =>
            todo.id === undefined ||
            todo.label === undefined ||
            todo.done === undefined
        )
      ) {
        throw Error("storage is corrupted");
      }
    }
  } catch {
    console.log("resetting corrupted storage");
    localStorage.setItem("todos", "[]");
    initialState = [];
  }

export const reducer = (state: TodoType[], action: Action) => {
  switch (action.type) {
    case "DELETE_TODO":
      return state.filter((todo) => todo.id !== action.payload.id);
    case "ADD_TODO":
      return [{ ...action.payload }, ...state];
    case "SET_DONE":
      return state.map((todo) =>
        todo.id === action.payload.id
          ? { ...todo, done: action.payload.done }
          : todo
      );
    case "SET_LABEL":
      return state.map((todo) =>
        todo.id === action.payload.id
          ? { ...todo, label: action.payload.label }
          : todo
      );
    case "TOGGLE_DONE":
      return state.map((todo) =>
        todo.id === action.payload.id ? { ...todo, done: !todo.done } : todo
      );
    default:
      return state;
  }
};

const TodoProvider = ({ children }: { children: ReactNode }) => {
  const [todos, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  const deleteTodo = (id: string) => {
    dispatch({ type: "DELETE_TODO", payload: { id } });
  };

  const addTodo = (label: string) => {
    dispatch({
      type: "ADD_TODO",
      payload: { done: false, label: (label || "").trim(), id: v4() },
    });
  };

  const setDone = (id: string, done: boolean) => {
    dispatch({ type: "SET_DONE", payload: { id, done } });
  };

  const setLabel = (id: string, label: string) => {
    dispatch({ type: "SET_LABEL", payload: { id, label } });
  };

  const toggleDone = (id: string) => {
    dispatch({ type: "TOGGLE_DONE", payload: { id } });
  };

  return (
    <TodoContext.Provider
      value={{ todos, deleteTodo, addTodo, setDone, setLabel, toggleDone }}
    >
      {children}
    </TodoContext.Provider>
  );
};

export const useTodoContext = () => useContext(TodoContext);
export default TodoProvider;
