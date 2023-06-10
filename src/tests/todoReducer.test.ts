import { TodoType, Action, reducer } from "../context/TodoContext";
import { describe, expect, test } from "vitest";

describe("reducer", () => {
  test("should delete a todo", () => {
    const todoId = "1";
    const state: TodoType[] = [{ id: todoId, label: "Test Todo", done: false }];
    const action: Action = { type: "DELETE_TODO", payload: { id: todoId } };
    const updatedState = reducer(state, action);
    expect(updatedState).toEqual([]);
  });

  test("should add a todo", () => {
    const state: TodoType[] = [];
    const todo: TodoType = { id: "1", label: "Test Todo", done: false };
    const action: Action = { type: "ADD_TODO", payload: todo };
    const updatedState = reducer(state, action);
    expect(updatedState).toEqual([todo]);
  });

  test("should set the done status of a todo", () => {
    const todoId = "1";
    const state: TodoType[] = [{ id: todoId, label: "Test Todo", done: false }];
    const action: Action = {
      type: "SET_DONE",
      payload: { id: todoId, done: true },
    };
    const updatedState = reducer(state, action);
    expect(updatedState[0].done).toBe(true);
  });

  test("should set the label of a todo", () => {
    const todoId = "1";
    const state: TodoType[] = [{ id: todoId, label: "Test Todo", done: false }];
    const action: Action = {
      type: "SET_LABEL",
      payload: { id: todoId, label: "Updated Todo" },
    };
    const updatedState = reducer(state, action);
    expect(updatedState[0].label).toBe("Updated Todo");
  });

  test("should toggle the done status of a todo", () => {
    const todoId = "1";
    const state: TodoType[] = [{ id: todoId, label: "Test Todo", done: false }];
    const action: Action = { type: "TOGGLE_DONE", payload: { id: todoId } };
    const updatedState = reducer(state, action);
    expect(updatedState[0].done).toBe(true);
  });

  test("should return the initial state for unknown action types", () => {
    const state: TodoType[] = [];
    //@ts-ignore
    const action: Action = { type: "UNKNOWN_ACTION", payload: {} };
    const updatedState = reducer(state, action);
    expect(updatedState).toEqual(state);
  });
});
