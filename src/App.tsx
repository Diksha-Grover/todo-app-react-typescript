import React, { useState } from "react";
import "./App.css";
import InputField from "./components/InputField";
import TodoList from "./components/TodoList";
import { DragDropContext, DropResult } from "react-beautiful-dnd";
// Beautiful and accessible drag and drop for lists with React.
import { Todo } from "./models/models";

const App: React.FC = () => {
  const [todo, setTodo] = useState<string>("");
  // when using the useState hook with Typescript, you would need to explicitly specify the type of state you're defining.
  // If you don't do this, Typescript will try to just guess what value you're expecting. That's why it will fill the blanks for you and "translate" useState() to useState<undefined>().
  const [todos, setTodos] = useState<Array<Todo>>([]);
  // Todo is an interface and todos state is an array of Todo
  const [CompletedTodos, setCompletedTodos] = useState<Array<Todo>>([]);

  const handleAdd = (e: React.FormEvent) => {
    // if we don't specify the type of e then it will throw us an error that is why we have given type of React.FormEvent 
    e.preventDefault();

    if (todo) {
      setTodos([...todos, { id: Date.now(), todo, isDone: false }]);
      setTodo("");
    }
  };

  const onDragEnd = (result: DropResult) => {
  // result will tell us two things destination, source
    const { destination, source } = result;
    // this destination tells us where we have droppes the todo itwm
    // this source will tell us where todo item was initially placed
    // so here we are taking destination, source from the result

    console.log(result);

    if (!destination) {
      return;
      // if destination is null or does not exist then return it to the original position means to the source
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
      // id source and destination are same then also we will return as it is
    ) {
      return;
    }

    let add;
    let active = todos;
    let complete = CompletedTodos;

    // in source Logic we are grabing the item
    if (source.droppableId === "TodosList") {
      add = active[source.index];
      // so here if source.droppableId === "TodosList" means the item is taken from active tasks then we are having that item in our add variable. 
      active.splice(source.index, 1);
      // here we are removing 1 item 
      // splice() method changes the contents of an array by removing or replacing existing elements
    } else {
      add = complete[source.index];
      complete.splice(source.index, 1);
    }

    // in destination Logic we are dropping the item
    if (destination.droppableId === "TodosList") {
      active.splice(destination.index, 0, add);
      // in destination we adding the item we got from source
      // 0 is taken because we are not removing anything
    } else {
      complete.splice(destination.index, 0, add);
    }

    setCompletedTodos(complete);
    setTodos(active);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
    {/* <DragDropContext /> - Wraps the part of your application you want to have drag and drop enabled for */}
      <div className="App">
        <span className="heading">Todo</span>
        <InputField todo={todo} setTodo={setTodo} handleAdd={handleAdd} />
        <TodoList
          todos={todos}
          setTodos={setTodos}
          CompletedTodos={CompletedTodos}
          setCompletedTodos={setCompletedTodos}
        />
      </div>
    </DragDropContext>
  );
};

export default App;
