import { TodoDbo } from './todo.dbo';

export class Todo implements TodoDbo {
  id?: string | undefined;
  title!: string;
  body!: string;
  status?: 'done' | 'none' | 'started' | undefined;
  created?: Date | undefined;
  updated?: Date | undefined;
  dueDate?: Date | undefined;


  isDone(): boolean {
    return this.status === 'done';
  }

  isOvertime(): boolean {
    if (!this.dueDate) {
      return false;
    }
    return (new Date(this.dueDate).getTime() - this.getToday().getTime()) < 0
  }

  daysToDue(): number | null {
    if (!this.dueDate) {
      return null;
    }
    const diff = this.dueDate.getTime() - this.getToday().getTime();
    if (diff > 0) {
      return this.msToDays(diff);
    } else {
      return null;
    }
  }

  private getToday(): Date {
    const today = new Date();
    return new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
      0,
      0,
      0,
    );
  }

  private msToDays(ms: number): number {
    const msOnADay = 1000 * 60 * 60 * 24;
    return Math.floor(ms / msOnADay);
  }
}
