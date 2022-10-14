export class Todo {
  id?: string;
  title: string;
  body: string;
  status: 'none' | 'started' | 'done';
  created: Date;
  updated: Date;
  dueDate?: Date;
}
