import { render, screen, fireEvent } from '@testing-library/angular';
import { TodoComponent } from './todo.component';
import { Todo } from '../../core/models/todo.model';
import { getDateOffset, getDateString } from '../../core/utils-tests';

describe('TodoComponent', () => {
  const todo = Object.assign(new Todo(), {
    title: 'Test title',
    body: 'Test body',
    id: '123456',
    created: getDateOffset(-3),
    updated: getDateOffset(-2),
    status: 'none',
  });

  describe('Todo status is `none`', () => {
    it('should render Todo', async () => {
      const { container } = await render(TodoComponent, {
        componentProperties: { todo },
      });

      expect(screen.getByText('Test title')).toBeTruthy();
      expect(screen.getByText('Test body')).toBeTruthy();

      const cardDoneElement = container.querySelector('.card.border-success');
      expect(cardDoneElement).toBeFalsy();
      const cardOvertimeElement = container.querySelector('.card.border-danger');
      expect(cardOvertimeElement).toBeFalsy();

      const duplicateButton = container.querySelector('[data-test-id="button-duplicate"]');
      expect(duplicateButton).toBeTruthy();
      expect(duplicateButton?.getAttribute('disabled')).toBe(null);
      const editButton = container.querySelector('[data-test-id="button-edit"]');
      expect(editButton).toBeTruthy();
      expect(editButton?.getAttribute('disabled')).toBe(null);
      const deleteButton = container.querySelector('[data-test-id="button-delete"]');
      expect(deleteButton).toBeTruthy();
      expect(deleteButton?.getAttribute('disabled')).toBe(null);
      const statusButton = container.querySelector('[data-test-id="button-status"]');
      expect(statusButton).toBeTruthy();
      expect(statusButton?.getAttribute('disabled')).toBe(null);
    });

    it('should show a overtime todo', async () => {
      const dateOvertime = getDateOffset(-1);
      const dateOvertimeText = getDateString(dateOvertime) as string;
      const todoOvertime = Object.assign(new Todo(), { ...todo, dueDate: dateOvertime });
      const { container } = await render(TodoComponent, {
        componentProperties: { todo: todoOvertime },
      });
      expect(screen.getByText(dateOvertimeText)).toBeTruthy();
      const cardDoneElement = container.querySelector('.card.border-success');
      expect(cardDoneElement).toBeFalsy();
      const cardOvertimeElement = container.querySelector('.card.border-danger');
      expect(cardOvertimeElement).toBeTruthy();

      const duplicateButton = container.querySelector('[data-test-id="button-duplicate"]');
      expect(duplicateButton).toBeTruthy();
      expect(duplicateButton?.getAttribute('disabled')).toBe(null);
      const editButton = container.querySelector('[data-test-id="button-edit"]');
      expect(editButton).toBeTruthy();
      expect(editButton?.getAttribute('disabled')).toBe(null);
      const deleteButton = container.querySelector('[data-test-id="button-delete"]');
      expect(deleteButton).toBeTruthy();
      expect(deleteButton?.getAttribute('disabled')).toBe(null);
      const statusButton = container.querySelector('[data-test-id="button-status"]');
      expect(statusButton).toBeTruthy();
      expect(statusButton?.getAttribute('disabled')).toBe(null);
    });
  });

  describe('Todo status is `stared`', () => {
    it('should show a started todo', async () => {
      const todoStarted = Object.assign(new Todo(), { ...todo, status: 'started' });
      const { container } = await render(TodoComponent, {
        componentProperties: { todo: todoStarted },
      });
      const cardDoneElement = container.querySelector('.card.border-success');
      expect(cardDoneElement).toBeFalsy();
      const cardOvertimeElement = container.querySelector('.card.border-danger');
      expect(cardOvertimeElement).toBeFalsy();

      const duplicateButton = container.querySelector('[data-test-id="button-duplicate"]');
      expect(duplicateButton).toBeTruthy();
      expect(duplicateButton?.getAttribute('disabled')).toBe('');
      const editButton = container.querySelector('[data-test-id="button-edit"]');
      expect(editButton).toBeTruthy();
      expect(editButton?.getAttribute('disabled')).toBe('');
      const deleteButton = container.querySelector('[data-test-id="button-delete"]');
      expect(deleteButton).toBeTruthy();
      expect(deleteButton?.getAttribute('disabled')).toBe(null);
      const statusButton = container.querySelector('[data-test-id="button-status"]');
      expect(statusButton).toBeTruthy();
    });

    it('should show a overtime todo', async () => {
      const dateOvertime = getDateOffset(-1);
      const dateOvertimeText = getDateString(dateOvertime) as string;
      const todoOvertime = Object.assign(new Todo(), { ...todo, status: 'started', dueDate: dateOvertime });
      const { container } = await render(TodoComponent, {
        componentProperties: { todo: todoOvertime },
      });
      expect(screen.getByText(dateOvertimeText)).toBeTruthy();
      const cardDoneElement = container.querySelector('.card.border-success');
      expect(cardDoneElement).toBeFalsy();
      const cardOvertimeElement = container.querySelector('.card.border-danger');
      expect(cardOvertimeElement).toBeTruthy();

      const duplicateButton = container.querySelector('[data-test-id="button-duplicate"]');
      expect(duplicateButton).toBeTruthy();
      expect(duplicateButton?.getAttribute('disabled')).toBe('');
      const editButton = container.querySelector('[data-test-id="button-edit"]');
      expect(editButton).toBeTruthy();
      expect(editButton?.getAttribute('disabled')).toBe('');
      const deleteButton = container.querySelector('[data-test-id="button-delete"]');
      expect(deleteButton).toBeTruthy();
      expect(deleteButton?.getAttribute('disabled')).toBe(null);
      const statusButton = container.querySelector('[data-test-id="button-status"]');
      expect(statusButton).toBeTruthy();
    });
  });

  describe('Todo status is `done`', () => {
    it('should show a done todo', async () => {
      const todoDone = Object.assign(new Todo(), { ...todo, status: 'done' });
      const { container } = await render(TodoComponent, {
        componentProperties: { todo: todoDone },
      });
      const cardDoneElement = container.querySelector('.card.border-success');
      expect(cardDoneElement).toBeTruthy();
      const cardOvertimeElement = container.querySelector('.card.border-danger');
      expect(cardOvertimeElement).toBeFalsy();

      const duplicateButton = container.querySelector('[data-test-id="button-duplicate"]');
      expect(duplicateButton).toBeTruthy();
      expect(duplicateButton?.getAttribute('disabled')).toBe('');
      const editButton = container.querySelector('[data-test-id="button-edit"]');
      expect(editButton).toBeTruthy();
      expect(editButton?.getAttribute('disabled')).toBe('');
      const deleteButton = container.querySelector('[data-test-id="button-delete"]');
      expect(deleteButton).toBeTruthy();
      expect(deleteButton?.getAttribute('disabled')).toBe(null);
      const statusButton = container.querySelector('[data-test-id="button-status"]');
      expect(statusButton).toBeFalsy();
    });

    it('should show a done todo with dueDate passed', async () => {
      const dateOvertime = getDateOffset(-1);
      const dateOvertimeText = getDateString(dateOvertime) as string;
      const todoDone = Object.assign(new Todo(), { ...todo, status: 'done', dueDate: dateOvertime });
      const { container } = await render(TodoComponent, {
        componentProperties: { todo: todoDone },
      });

      expect(screen.getByText(dateOvertimeText)).toBeTruthy();
      const cardDoneElement = container.querySelector('.card.border-success');
      expect(cardDoneElement).toBeTruthy();
      const cardOvertimeElement = container.querySelector('.card.border-danger');
      expect(cardOvertimeElement).toBeFalsy();

      const duplicateButton = container.querySelector('[data-test-id="button-duplicate"]');
      expect(duplicateButton).toBeTruthy();
      expect(duplicateButton?.getAttribute('disabled')).toBe('');
      const editButton = container.querySelector('[data-test-id="button-edit"]');
      expect(editButton).toBeTruthy();
      expect(editButton?.getAttribute('disabled')).toBe('');
      const deleteButton = container.querySelector('[data-test-id="button-delete"]');
      expect(deleteButton).toBeTruthy();
      expect(deleteButton?.getAttribute('disabled')).toBe(null);
      const statusButton = container.querySelector('[data-test-id="button-status"]');
      expect(statusButton).toBeFalsy();
    });

  });

  describe('check outputs', () => {
    it('duplicate button is clicked', async () => {
      const duplicateTodoSpy = jest.fn();
      await render(TodoComponent, {
        componentProperties: {
          todo,
          duplicateTodo: { emit: duplicateTodoSpy } as any,
        },
      });

      const duplicateButton = screen.getByTestId('button-duplicate');
      expect(duplicateButton).toBeTruthy();
      fireEvent.click(duplicateButton);

      expect(duplicateTodoSpy).toHaveBeenCalled()
    });

    it('edit button is clicked', async () => {
      const editTodoSpy = jest.fn();
      await render(TodoComponent, {
        componentProperties: {
          todo,
          editTodo: { emit: editTodoSpy } as any,
        },
      });

      const editButton = screen.getByTestId('button-edit');
      expect(editButton).toBeTruthy();
      fireEvent.click(editButton);

      expect(editTodoSpy).toHaveBeenCalled()
    });

    it('delete button is clicked', async () => {
      const deleteTodoSpy = jest.fn();
      await render(TodoComponent, {
        componentProperties: {
          todo,
          deleteTodo: { emit: deleteTodoSpy } as any,
        },
      });

      const deleteButton = screen.getByTestId('button-delete');
      expect(deleteButton).toBeTruthy();
      fireEvent.click(deleteButton);

      expect(deleteTodoSpy).toHaveBeenCalled()
    });

    it('change status button is clicked', async () => {
      const changeStateTodoSpy = jest.fn();
      await render(TodoComponent, {
        componentProperties: {
          todo,
          changeStateTodo: { emit: changeStateTodoSpy } as any,
        },
      });

      const changeStatusButton = screen.getByTestId('button-status');
      expect(changeStatusButton).toBeTruthy();
      fireEvent.click(changeStatusButton);

      expect(changeStateTodoSpy).toHaveBeenCalled()
    });
  });
});
