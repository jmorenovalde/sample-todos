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

  /**
   * Show the TodoFormComponent to edit a Todo element.
   * @param todo to edit.
   */
  onEditTodo(todo: Todo): void {
    this.initTodoForm(todo);
    this.showForm = true;
  }

  /**
   * Open the TodoFromComponent to duplicate a Todo element.
   * @param todo element to duplicate.
   */
  onDuplicateTodo(todo: Todo): void {
    this.initTodoForm(todo, true);
    this.showForm = true;
  }

  /**
   * This method is called to change the state of the Todo. Always change moving as the following:
   *  * none => started
   *  * started => done
   * Finally update the todo.
   * @param todo the element to change the status.
   */
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

  /**
   * This method delete the todo that has the id that it is passed by parameter.
   * @param todoId the Todo Id to delte.
   */
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

  /**
   * This method is called when TodoFromComponent fired the submit event. This method add or edit a todo.
   * @param todo the element that is modified on the TodoFromComponent.
   */
  onSubmit(todo: Todo) {
    if (todo?.id) {
      this.updateTodo(todo);
    } else {
      this.createTodo(todo);
    }
  }

  /**
   * This method is called when TodoFromComponent fired the submit event, and close the TodoFromComponent and
   * clear the todoSelected todo.
   */
  onAddTodoClick(): void {
    this.todoSelected = null;
    this.showForm = true;
  }

  /**
   * This method is called
   */
  onCancelForm(): void {
    this.showForm = false;
    this.todoSelected = null;
  }

  /**
   * This method put on the todoSelected the Todo element to edit or duplicate.
   * @param todo element to edit or duplicate.
   * @param duplicate if we want to duplicate the todo element.
   */
  private initTodoForm(todo: Todo, duplicate = false): void {
    const newTodo = Object.assign(new Todo(), todo);
    if (duplicate) {
      newTodo.title = newTodo.title + ' [Duplicated]';
      delete newTodo.id;
    }
    this.todoSelected = newTodo;
  }

  /**
   * This method call to the backend to get all todo elements (no pagination).
   */
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

  /**
   * This method update the Todo that it is passed by param.
   * @param todo element to update.
   */
  private updateTodo(todo: Todo): void {
    this.todoService.updateTodo(todo)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (todo) => {
          this.showForm = false;
          this.todoSelected = null;
          this.getTodos();
        }
      });
  }

  /**
   * This method create the Todo that it is passed by param.
   * @param todo element to create.
   */
  private createTodo(todo: Todo): void {
    this.todoService.createTodo(todo)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (todo) => {
          this.showForm = false;
          this.todoSelected = null;
          this.getTodos();
        }
      });
  }
}
