import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
import { Todo } from '../../core/models/todo.model';
import { TodosService } from '../../core/services/todos.service';
import { TodoComponent } from '../todo/todo.component';
import { TodoFormComponent } from '../todo-form/todo-form.component';

@Component({
  selector: 'app-todos',
  standalone: true,
  imports: [CommonModule, TodoComponent, TodoFormComponent],
  templateUrl: './todos.component.html',
  styleUrls: ['./todos.component.scss']
})
export class TodosComponent implements OnInit, OnDestroy {

  todos: Todo[] = [];
  todoSelected: Todo | null = null;
  dataLoading = true;

  showForm = false;

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
    this.getTodos();
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
    this.initTodoForm(todo);
    this.showForm = true;
  }

  onDuplicateTodo(todo: Todo): void {
    this.initTodoForm(todo, true);
    this.showForm = true;
  }

  private initTodoForm(todo: Todo, duplicate = false): void {
    const newTodo = Object.assign(new Todo(), todo);
    if (duplicate) {
      newTodo.title = newTodo.title + ' [Duplicated]';
      delete newTodo.id;
    }
    this.todoSelected = newTodo;
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
          next: (todo) => this.todoSelected = Object.assign(new Todo(), todo),
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

  public onSubmmit(todo: Todo) {
    if (todo?.id) {
      this.updateTodo(todo);
    } else {
      this.createTodo(todo);
    }
  }

  private updateTodo(todo: Todo): void {
    this.todoService.updateTodo(todo)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (todo) => {
          this.showForm = false;
          this.getTodos();
        }
      });
  }

  private createTodo(todo: Todo): void {
    this.todoService.createTodo(todo)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (todo) => {
          this.showForm = false;
          this.getTodos();
        }
      });
  }

  onAddTodoClick(): void {
    this.showForm = true;
  }

  onCancelForm(): void {
    this.showForm = false;
  }
}
