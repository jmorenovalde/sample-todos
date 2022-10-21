import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Todo } from '../../core/models/todo.model';
import { TodoComponent } from '../todo/todo.component';
import { TodosService } from '@core/services/todos.service';
import { Subject, takeUntil } from 'rxjs';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-todos',
  standalone: true,
  imports: [CommonModule, TodoComponent, FormsModule, ReactiveFormsModule],
  templateUrl: './todos.component.html',
  styleUrls: ['./todos.component.scss']
})
export class TodosComponent implements OnInit, OnDestroy {

  todos: Todo[] = [];
  todoSelected: Todo | null = null;
  dataLoading = true;

  showForm = false;
  canSaveTodo = false;

  public todoForm!: FormGroup;

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
    this.initForm();
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
    this.todoForm.reset();
    if (todo) {
      this.todoForm.get('todoTitle')?.setValue(duplicate ? todo.title + ' [Duplicate]' : todo.title);
      this.todoForm.get('todoBody')?.setValue(todo.title);
      this.todoForm.get('todoDueDate')?.setValue(todo.dueDate ? todo.dueDate : undefined);
      if (!duplicate) {
        this.todoForm.get('todoId')?.setValue(todo.id);
      }
    }
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

  private initForm() {
    this.todoForm = new FormGroup({
      todoId: new FormControl(''),
      todoTitle: new FormControl('', [Validators.required]),
      todoBody: new FormControl('', [Validators.required]),
      todoDueDate: new FormControl(''),
    });

    this.todoForm.valueChanges
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(() => {
        this.checkForm();
      });
  }

  private checkForm() {
    this.canSaveTodo = this.todoForm.valid;
  }

  public onSubmmit() {
    if (this.todoForm.valid) {
      const id = this.todoForm.get('todoId')?.value
      const title = this.todoForm.get('todoTitle')?.value;
      const body = this.todoForm.get('todoBody')?.value;
      const dueDate = this.todoForm.get('todoDueDate')?.value;

      if (id) {
        const todo = this.todos.find(item => item.id === id);
        if (todo) {
          todo.title = title;
          todo.body = body;
          todo.dueDate = dueDate;
          this.updateTodo(todo);
        }
      } else {
        const todo = new Todo();
        todo.title = title;
        todo.body = body;
        if (dueDate) {
          todo.dueDate = new Date(dueDate);
        }
        this.createTodo(todo);
      }
    }
  }

  private updateTodo(todo: Todo): void {
    this.todoService.updateTodo(todo)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (todo) => {
          this.onCancelClick();
          this.getTodos();
        }
      });
  }

  private createTodo(todo: Todo): void {
    this.todoService.createTodo(todo)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (todo) => {
          this.onCancelClick();
          this.getTodos();
        }
      });
  }

  onAddTodoClick(): void {
    this.showForm = true;
  }

  onCancelClick(): void {
    this.showForm = false;
    this.todoForm.reset();
  }
}
