import { StatusPipe } from './status.pipe';
import { Todo } from '../models/todo.model';
import { getDateOffset } from '../utils';

describe('StatusPipe', () => {

  it('should be created', () => {
    const pipe = new StatusPipe();
    expect(pipe).toBeTruthy();
  });

  it('shold return empty if todo is not done or is not overtime', () => {
    const todo = new Todo();
    todo.title = 'Title test todo';
    todo.body = 'Title test todo';
    todo.status = 'none';

    const pipe = new StatusPipe();
    const value = pipe.transform(todo);

    expect(value).toEqual('');
  });

  it('shold return `border-success` if todo is done', () => {
    const todo = new Todo();
    todo.title = 'Title test todo';
    todo.body = 'Title test todo';
    todo.status = 'done';

    const pipe = new StatusPipe();
    const value = pipe.transform(todo);

    expect(value).toEqual('border-success');
  });

  it('shold return `border-danger` if todo is overtime', () => {
    const todo = new Todo();
    todo.title = 'Title test todo';
    todo.body = 'Title test todo';
    todo.status = 'started';
    todo.dueDate = getDateOffset(-1);

    const pipe = new StatusPipe();
    const value = pipe.transform(todo);

    expect(value).toEqual('border-danger');
  });

  it('shold return `border-success` if todo is done and overtime', () => {
    const todo = new Todo();
    todo.title = 'Title test todo';
    todo.body = 'Title test todo';
    todo.status = 'done';
    todo.dueDate = getDateOffset(-1);

    const pipe = new StatusPipe();
    const value = pipe.transform(todo);

    expect(value).toEqual('border-success');
  });
});
