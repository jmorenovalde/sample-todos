import { Component, Input, OnInit, Output, EventEmitter, OnDestroy, OnChanges, SimpleChanges } from '@angular/core';
import { ReactiveFormsModule, FormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Todo } from '../../core/models/todo.model';

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
  @Output() submit = new EventEmitter<Todo>();

  canSaveTodo = false;
  todoForm!: FormGroup;

  /**
   * This variable is used to unsubscribe the subscriptions on the ngOnDestroy method.
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

  /**
   * this method, check the values and send the `submit` event when is called.
   */
  onSubmit(): void {
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
        this.submit.next(editTodo);
      } else {
        const newTodo = Object.assign(new Todo(), { title, body, dueDate });
        this.submit.next(newTodo);
      }
      this.clearForm();
    }
  }

  /**
   * This method emit the `cancel` output and clear the todo item selected.
   */
  onCancelClick(): void {
    this.clearForm();
    this.cancel.emit();
  }

  /**
   * This method clear the form value and clear the todo item selected.
   */
  private clearForm(): void {
    this.todo = null;
    this.todoForm.reset();
  }

  /**
   * This method init the form and create a observable to get the data form changes.
   */
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

  /**
   * This method check if has the mandatory values to available the save button.
   */
  private checkForm() {
    this.canSaveTodo = this.todoForm.valid;
  }

  /**
   * Init the values of the form with the Todo item passed as parameter.
   * @param todo item to set values to the form.
   */
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

  /**
   * This method return a string with the date as input type="date" is required.
   * @param date the date to get the string.
   * @returns string to result. If returned `undefined` means that date is null or undefined.
   */
  private getDate(date: Date | undefined): string | undefined {
    if (!date) {
      return undefined;
    }
    const newDueDate = new Date(date);
    return `${newDueDate.getFullYear()}-${this.addZeroToDate((newDueDate.getMonth() + 1).toString())}-${this.addZeroToDate(newDueDate.getDate().toString())}`;
  }

  /**
   * This method add 0 before a number is this only has one character.
   * @param data number to set a 0 before.
   * @returns 0X or YX.
   */
  private addZeroToDate(data: string): string {
    return (('0' + data) as string).slice(-2);
  }
}
