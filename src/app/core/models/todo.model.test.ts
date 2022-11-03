import { getDateOffset } from '../utils-tests';
import { Todo } from './todo.model';

describe('Todo', () => {
  it('should be created', () => {
    const object = new Todo();
    expect(object).toBeTruthy();
  });

  describe('isDone', () => {
    it('should return false isDone is object is empty', () => {
      const object = new Todo();
      expect(object.isDone()).toBeFalsy();
    });

    it('should return false is status is distint of `done`', () => {
      const object = new Todo();
      object.title = 'Title Todo Test';
      object.body = 'Body Todo Test';
      object.status = 'none';
      expect(object.isDone()).toBeFalsy();
      object.status = 'started';
      expect(object.isDone()).toBeFalsy();
    });

    it('should return true is status is `done`', () => {
      const object = new Todo();
      object.title = 'Title Todo Test';
      object.body = 'Body Todo Test';
      object.status = 'done';
      expect(object.isDone()).toBeTruthy();
    });
  });

  describe('isOvertime', () => {
    it('should return false isOvertime is object is empty', () => {
      const object = new Todo();
      expect(object.isOvertime()).toBeFalsy();
    });

    it('should return false is dueDate is after today', () => {
      const object = new Todo();
      object.title = 'Title Todo Test';
      object.body = 'Body Todo Test';
      object.status = 'none';
      object.dueDate = getDateOffset(1);
      expect(object.isOvertime()).toBeFalsy();
    });

    it('should return true is dueDate is before today', () => {
      const object = new Todo();
      object.title = 'Title Todo Test';
      object.body = 'Body Todo Test';
      object.status = 'none';
      object.dueDate = getDateOffset(-1);
      expect(object.isOvertime()).toBeTruthy();
    });

    it('should return false is dueDate is today', () => {
      const object = new Todo();
      object.title = 'Title Todo Test';
      object.body = 'Body Todo Test';
      object.status = 'none';
      object.dueDate = getDateOffset(0);
      expect(object.isOvertime()).toBeFalsy();
    });

  });

  describe('daysToDue', () => {
    it('should return null daysToDue is object is empty', () => {
      const object = new Todo();
      expect(object.daysToDue()).toBe(null);
    });

    it('should return null daysToDue is dueDate is before today', () => {
      const object = new Todo();
      object.title = 'Title Todo Test';
      object.body = 'Body Todo Test';
      object.status = 'none';
      object.dueDate = getDateOffset(-1);
      expect(object.daysToDue()).toBe(null);
    });

    it('should return 1 daysToDue is dueDate is tomorro', () => {
      const object = new Todo();
      object.title = 'Title Todo Test';
      object.body = 'Body Todo Test';
      object.status = 'none';
      object.dueDate = getDateOffset(1);
      expect(object.daysToDue()).toBe(1);
    });
  });
});
