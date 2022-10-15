export class Todo {
  id?: string;
  title!: string;
  body!: string;
  status?: 'none' | 'started' | 'done';
  created?: Date;
  updated?: Date;
  dueDate?: Date;

  isDone(): boolean {
    return this.status === 'done';
  }

  isOvertime(): boolean {
    if (!this.dueDate) {
      return false;
    }
    return (this.getToday().getTime() - this.dueDate.getTime()) < 0
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
    return ms * 1000 * 60 * 60 * 24;
  }
}
