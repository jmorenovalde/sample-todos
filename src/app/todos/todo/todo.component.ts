import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Todo } from '../../core/models/todo.model';
import { StatusPipe } from '../../core/pipes/status.pipe';

@Component({
  selector: 'app-todo',
  standalone: true,
  imports: [CommonModule, StatusPipe],
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.scss']
})
export class TodoComponent implements OnChanges {
  /** The Todo object to show. */
  @Input() todo!: Todo;

  /** Send the Todo element for edit data. */
  @Output() editTodo = new EventEmitter<Todo>();

  /** Send the Todo element to duplicate on a new Todo. */
  @Output() duplicateTodo = new EventEmitter<Todo>();

  /** Send the ID of the Todo Element for delete todo. */
  @Output() deleteTodo = new EventEmitter<string>();

  /** Change the state of the Todo */
  @Output() changeStateTodo = new EventEmitter<Todo>();

  isDue = false;
  isDone = false;

  /**
   * @ignore
   * Component lifecycle that runs when the component changes its inputs.
   */
  ngOnChanges(changes: SimpleChanges): void {
    const { todo } = changes;
    if (todo?.currentValue) {
      const tempTodo = todo.currentValue as Todo;
      this.isDue = tempTodo.isOvertime() && !tempTodo.isDone();
      this.isDone = tempTodo.isDone();
    }
  }

  /**
   * This method returns the `editTodo` output when is called.
   */
  onClickEdit(): void {
    this.editTodo.next(this.todo);
  }

  /**
   * This method returns the `duplicateTodo` output when is called.
   */
  onClickDuplicate(): void {
    this.duplicateTodo.next(this.todo);
  }

  /**
   * This method returns the `deleteTodo` output when is called.
   */
  onClickDelete(): void {
    this.deleteTodo.next(this.todo.id as string);
  }

  /**
   * This method returns the `changeStateTodo` output when is called.
   */
  onClickChangeStatus(): void {
    this.changeStateTodo.next(this.todo);
  }
}
