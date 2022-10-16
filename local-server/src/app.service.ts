import { Injectable, NotFoundException } from '@nestjs/common';
import { NotFoundError } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';
import { Todo } from './todo.model';

@Injectable()
export class AppService {
  private today = new Date();
  private todayDate = new Date(
    this.today.getFullYear(),
    this.today.getMonth(),
    this.today.getDate(),
    0,
    0,
    0,
  );
  private todos: Todo[] = [
    {
      title: 'one title',
      body: 'one body.',
      status: 'started',
      id: '821b99f6-eecf-414a-afa7-e656f775cec2',
      created: new Date(
        new Date(this.todayDate).setDate(this.todayDate.getDate() - 5),
      ),
      updated: new Date(
        new Date(this.todayDate).setDate(this.todayDate.getDate() - 2),
      ),
      dueDate: new Date(
        new Date(this.todayDate).setDate(this.todayDate.getDate() - 1),
      ),
    },
    {
      title: 'two title',
      body: 'two body',
      status: 'none',
      id: 'ab799f4b-5041-43cf-aae2-69cf228ba686',
      created: new Date(
        new Date(this.todayDate).setDate(this.todayDate.getDate() - 4),
      ),
      updated: new Date(),
    },
    {
      title: 'three title',
      body: 'three body',
      status: 'done',
      id: 'eab65002-5446-4fcb-a170-9ac32b64b404',
      created: new Date(
        new Date(this.todayDate).setDate(this.todayDate.getDate() - 4),
      ),
      updated: new Date(
        new Date(this.todayDate).setDate(this.todayDate.getDate() - 2),
      ),
    },
    {
      title: 'four title',
      body: 'four body',
      status: 'none',
      id: '7ed03ff4-1c64-4586-b568-30d9876253da',
      created: new Date(
        new Date(this.todayDate).setDate(this.todayDate.getDate() - 3),
      ),
      updated: new Date(
        new Date(this.todayDate).setDate(this.todayDate.getDate() - 2),
      ),
      dueDate: new Date(
        new Date(this.todayDate).setDate(this.todayDate.getDate() + 5),
      ),
    },
  ];

  getTodos(): Todo[] {
    return this.todos;
  }

  getTodo(id: string): Todo {
    const findedTodo = this.todos.find((todo) => todo.id === id);
    if (!findedTodo) {
      throw new NotFoundException({
        message: 'There is not a todo with this ID',
      });
    }
    return findedTodo;
  }

  createTodo(todo: Todo): Todo {
    const id = uuidv4();
    todo.id = id;
    todo.status = 'none';
    todo.created = new Date();
    todo.updated = new Date();
    this.todos.push(todo);
    return todo;
  }

  updateTodo(id: string, todo: Todo): Todo {
    const todoIndex = this.todos.findIndex((item) => item.id === id);

    if (todoIndex >= 0) {
      this.todos[todoIndex] = { ...todo, id };
      return this.todos[todoIndex];
    }
    throw new NotFoundException({
      message: 'There is not a todo with this ID',
    });
  }

  deleteTodo(id): void {
    this.getTodo(id); // if not exist return 404
    this.todos = this.todos.filter((item) => item.id !== id);
  }
}
