import { Component, Input, OnInit, Output, EventEmitter, OnDestroy, OnChanges, SimpleChanges } from '@angular/core';
import { ReactiveFormsModule, FormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { Todo } from '../../core/models/todo.model';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-todo-form',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './todo-form.component.html',
  styleUrls: ['./todo-form.component.scss']
})
export class TodoFormComponent implements OnChanges, OnInit, OnDestroy {
  @Input() todo: Todo | null = null;

  @Output() cancel = new EventEmitter<void>();
  @Output() summit = new EventEmitter<Todo>();

  canSaveTodo = false;
  todoForm!: FormGroup;

  /**
   * This varible is used to unsuscribe the subscriptions on the ngOnDestroy method.
   */
  private unsubscribe$: Subject<void> = new Subject<void>();

  //#region lifecycle hooks

  /**
   * @ignore
   * The OnChanges method of the component life cycle hook.
   */
  ngOnChanges(changes: SimpleChanges): void {
    const { todo } = changes;
    if (todo?.currentValue) {
      this.initTodo(todo.currentValue as Todo);
    }
  }

  /**
   * @ignore
   * The init method of the component life cycle hook.
   */
  ngOnInit(): void {
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

  onSubmmit(): void {
    if (this.todoForm.valid) {
      const id = this.todoForm.get('todoId')?.value
      const title = this.todoForm.get('todoTitle')?.value;
      const body = this.todoForm.get('todoBody')?.value;
      const dueDate = this.todoForm.get('todoDueDate')?.value;
      if (id) {
        const editTodo = Object.assign(new Todo(), this.todo);
        editTodo.title = title;
        editTodo.body = body;
        editTodo.dueDate = dueDate ? dueDate : undefined;
        this.summit.next(editTodo);
      } else {
        const newTodo = Object.assign(new Todo(), { title, body, dueDate });
        this.summit.next(newTodo);
      }
      this.clearForm();
    }
  }

  onCancelClick(): void {
    this.clearForm();
    this.cancel.emit();
  }

  private clearForm(): void {
    this.todo = null;
    this.todoForm.reset();
  }

  private initForm() {
    if (this.todoForm) {
      return;
    }
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

  private initTodo(todo: Todo): void {
    if (!this.todoForm) {
      this.initForm();
    }
    if (todo) {
      if (todo.id) {
        this.todoForm.get('todoId')?.setValue(todo.id);
      }
      this.todoForm.get('todoTitle')?.setValue(todo.title);
      this.todoForm.get('todoBody')?.setValue(todo.body);
      this.todoForm.get('todoDueDate')?.setValue(this.getDate(todo.dueDate));
    } else {
      this.clearForm();
    }
  }

  private getDate(date: Date | undefined): string | undefined {
    if (!date) {
      return undefined;
    }
    const newDueDate = new Date(date);
    return `${newDueDate.getFullYear()}-${this.addZeroToDate((newDueDate.getMonth() + 1).toString())
      }-${this.addZeroToDate(newDueDate.getDate().toString())
      }`;
  }

  private addZeroToDate(date: string): string {
    return (('0' + date) as string).slice(-2);
  }
}
