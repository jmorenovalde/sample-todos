import { Pipe, PipeTransform } from '@angular/core';
import { Todo } from '@core/models/todo.model';

@Pipe({
  name: 'status',
  standalone: true,
})
export class StatusPipe implements PipeTransform {

  transform(value: Todo): string {
    if (value.isDone()) {
      return 'border-success';
    }

    if (value.isOvertime()) {
      return 'border-danger';
    }
    return '';
  }
}
