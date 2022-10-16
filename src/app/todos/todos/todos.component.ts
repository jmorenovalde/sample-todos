import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Todo } from '../../core/models/todo.model';
import { TodoComponent } from '../todo/todo.component';
import { TodosService } from '@core/services/todos.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-todos',
  standalone: true,
  imports: [CommonModule, TodoComponent],
  templateUrl: './todos.component.html',
  styleUrls: ['./todos.component.scss']
})
export class TodosComponent implements OnInit, OnDestroy {

  todos: Todo[] = [];
  todoSelected: Todo | null = null;
  dataLoading = true;

  /**
   * This varible is used to unsuscribe the subscriptions on the ngOnDestroy method.
   */
  private unsubscribe$: Subject<void> = new Subject<void>();

  //#region Life cycle hook methods.
  /**
   * @ignore
   * The constructor of the component.
   */
  constructor(private todoService: TodosService) { }

  /**
   * @ignore
   * The init method of the component life cycle hook.
   */
  ngOnInit(): void {
    this.getTodos()
  }

  /**
   * @ignore
   * Component lifecycle that runs when the component is going to destroy.
   */
  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.unsubscribe();
  }
  //#endregion

  onEditTodo(todo: Todo): void {
    // TODO change to edit mode
  }

  onDuplicateTodo(todo: Todo): void {
    const { title, body, status, dueDate } = todo;
    const newTodo = Object.assign(new Todo(), { title: title + ' [Duplicate]', body, status, dueDate });
    this.todoService.createTodo(newTodo)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (todo) => {
          this.todoSelected = todo;
          this.getTodos();
        },
      });
  }

  onChangeStateTodo(todo: Todo): void {
    if (todo) {
      if (todo.status === 'started') {
        todo.status = 'done';
      } else if (todo.status === 'none') {
        todo.status = 'started';
      }
      this.updateTodo(todo);
    }
  }

  onDeleteTodo(todoId: string): void {
    // TODO: open a confirmation windows.
    if (todoId) {
      this.todoService.deleteTodo(todoId)
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe({
          next: () => {
            this.todoSelected = null;
            this.getTodos();
          },
        });
    }
  }

  getTodo() {
    if (this.todos?.length && this.todos[0].id) {
      this.todoService.getTodo(this.todos[0].id)
        .subscribe({
          next: (todo) => this.todoSelected = todo,
        });
    }
  }

  private getTodos() {
    this.dataLoading = true;
    this.todoService.getTodos()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (todos) => {
          this.todos = todos;
          this.dataLoading = false;
        },
      });
  }

  private updateTodo(todo: Todo) {
    if (todo) {
      const todoToUpdate = Object.assign(new Todo(), todo);
      this.todoService.updateTodo(todoToUpdate)
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe({
          next: (todo) => {
            this.getTodos();
          },
        });
    }
  }
}
