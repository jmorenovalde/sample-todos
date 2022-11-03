import { DebugElement, SimpleChange } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TodoComponent } from './todo.component';
import { StatusPipe } from '../../core/pipes/status.pipe';
import { click, getDateOffset } from '../../core/utils-tests';
import { Todo } from '../../core/models/todo.model';
import { By } from '@angular/platform-browser';

describe('TodoComponent', () => {
  let component: TodoComponent;
  let fixture: ComponentFixture<TodoComponent>;
  let el: DebugElement;
  let todo: Todo;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StatusPipe],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TodoComponent);
    component = fixture.componentInstance;
    todo = Object.assign(new Todo(), {
      title: 'Test title',
      body: 'Test body',
      id: '123456',
      created: getDateOffset(-3),
      updated: getDateOffset(-2),
      status: 'none',
    });
    el = fixture.debugElement;
    component.ngOnChanges({
      todo: new SimpleChange(null, todo, true),
    });
    component.todo = todo;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Input Todo', () => {
    describe('Todo status `none`', () => {
      it('add a Todo without dueDate and is not done', () => {
        expect(component.isDone).toBeFalsy();
        expect(component.isDue).toBeFalsy();
        const statusButton = el.query(By.css('[data-test-id="button-status"]'));
        expect(statusButton).toBeTruthy();

        const dueDate = el.query(By.css('.small.text-secondary'));
        expect(dueDate).toBeFalsy();

        const duplicateButton = el.query(By.css('[data-test-id="button-duplicate"]'));
        expect(duplicateButton).toBeTruthy();

        const editButton = el.query(By.css('[data-test-id="button-edit"]'));
        expect(editButton).toBeTruthy();

        const deleteButton = el.query(By.css('[data-test-id="button-delete"]'));
        expect(deleteButton).toBeTruthy();
      });

      it('add a Todo with dueDate but is not overtime and is not done', () => {
        const newTodo = Object.assign(new Todo(), { ...todo, dueDate: getDateOffset(3) });
        component.ngOnChanges({
          todo: new SimpleChange(todo, newTodo, false),
        });
        component.todo = newTodo;
        fixture.detectChanges();
        expect(component.isDone).toBeFalsy();
        expect(component.isDue).toBeFalsy();

        const statusButton = el.query(By.css('[data-test-id="button-status"]'));
        expect(statusButton).toBeTruthy();

        const dueDate = el.query(By.css('.small.text-secondary'));
        expect(dueDate).toBeTruthy();

        const duplicateButton = el.query(By.css('[data-test-id="button-duplicate"]'));
        expect(duplicateButton).toBeTruthy();

        const editButton = el.query(By.css('[data-test-id="button-edit"]'));
        expect(editButton).toBeTruthy();

        const deleteButton = el.query(By.css('[data-test-id="button-delete"]'));
        expect(deleteButton).toBeTruthy();
      });

      it('add a Todo with dueDate but is overtime and is not done', () => {
        const newTodo = Object.assign(new Todo(), { ...todo, dueDate: getDateOffset(-1) });
        component.ngOnChanges({
          todo: new SimpleChange(todo, newTodo, false),
        });
        component.todo = newTodo;
        fixture.detectChanges();
        expect(component.isDone).toBeFalsy();
        expect(component.isDue).toBeTruthy();

        const statusButton = el.query(By.css('[data-test-id="button-status"]'));
        expect(statusButton).toBeTruthy();

        const dueDate = el.query(By.css('.small.text-danger'));
        expect(dueDate).toBeTruthy();

        const duplicateButton = el.query(By.css('[data-test-id="button-duplicate"]'));
        expect(duplicateButton).toBeTruthy();

        const editButton = el.query(By.css('[data-test-id="button-edit"]'));
        expect(editButton).toBeTruthy();

        const deleteButton = el.query(By.css('[data-test-id="button-delete"]'));
        expect(deleteButton).toBeTruthy();
      });
    });

    describe('Todo status `started`', () => {

      it('add a Todo without dueDate and is not done', () => {
        const newTodo = Object.assign(new Todo(), {
          ...todo,
          status: 'started',
        });
        component.ngOnChanges({
          todo: new SimpleChange(todo, newTodo, false),
        });
        component.todo = newTodo;
        fixture.detectChanges();

        expect(component.isDone).toBeFalsy();
        expect(component.isDue).toBeFalsy();
        const statusButton = el.query(By.css('[data-test-id="button-status"]'));
        expect(statusButton).toBeTruthy();

        const dueDate = el.query(By.css('.small.text-secondary'));
        expect(dueDate).toBeFalsy();

        const duplicateButton = el.query(By.css('[data-test-id="button-duplicate"]'));
        expect(duplicateButton).toBeTruthy();
        const buttonDuplicate = duplicateButton.nativeElement as any;
        expect(buttonDuplicate.disabled).toBeTruthy();

        const editButton = el.query(By.css('[data-test-id="button-edit"]'));
        expect(editButton).toBeTruthy();
        const buttonEdit = editButton.nativeElement as any;
        expect(buttonEdit.disabled).toBeTruthy();

        const deleteButton = el.query(By.css('[data-test-id="button-delete"]'));
        expect(deleteButton).toBeTruthy();
        const buttonDelete = deleteButton.nativeElement as any;
        expect(buttonDelete.disabled).toBeFalsy();
      });

      it('add a Todo with dueDate but is not overtime and is not done', () => {
        const newTodo = Object.assign(new Todo(), {
          ...todo,
          dueDate: getDateOffset(3),
          status: 'started',
        });
        component.ngOnChanges({
          todo: new SimpleChange(todo, newTodo, false),
        });
        component.todo = newTodo;
        fixture.detectChanges();
        expect(component.isDone).toBeFalsy();
        expect(component.isDue).toBeFalsy();

        const statusButton = el.query(By.css('[data-test-id="button-status"]'));
        expect(statusButton).toBeTruthy();

        const dueDate = el.query(By.css('.small.text-secondary'));
        expect(dueDate).toBeTruthy();
      });

      it('add a Todo with dueDate but is overtime and is not done', () => {
        const newTodo = Object.assign(new Todo(), {
          ...todo,
          dueDate: getDateOffset(-1),
          status: 'started',
        });
        component.ngOnChanges({
          todo: new SimpleChange(todo, newTodo, false),
        });
        component.todo = newTodo;
        fixture.detectChanges();
        expect(component.isDone).toBeFalsy();
        expect(component.isDue).toBeTruthy();

        const statusButton = el.query(By.css('[data-test-id="button-status"]'));
        expect(statusButton).toBeTruthy();

        const dueDate = el.query(By.css('.small.text-danger'));
        expect(dueDate).toBeTruthy();
      });
    });

    describe('Todo status `done`', () => {

      it('add a Todo without dueDate and is done', () => {
        const newTodo = Object.assign(new Todo(), {
          ...todo,
          status: 'done',
        });
        component.ngOnChanges({
          todo: new SimpleChange(todo, newTodo, false),
        });
        component.todo = newTodo;
        fixture.detectChanges();

        expect(component.isDone).toBeTruthy();
        expect(component.isDue).toBeFalsy();

        const statusButton = el.query(By.css('[data-test-id="button-status"]'));
        expect(statusButton).toBeFalsy();

        const doneIcon = el.query(By.css('.bi.bi-check-circle.text-success'));
        expect(doneIcon).toBeTruthy();

        const dueDate = el.query(By.css('.small.text-secondary'));
        expect(dueDate).toBeFalsy();

        const duplicateButton = el.query(By.css('[data-test-id="button-duplicate"]'));
        expect(duplicateButton).toBeTruthy();
        const buttonDuplicate = duplicateButton.nativeElement as any;
        expect(buttonDuplicate.disabled).toBeTruthy();

        const editButton = el.query(By.css('[data-test-id="button-edit"]'));
        expect(editButton).toBeTruthy();
        const buttonEdit = editButton.nativeElement as any;
        expect(buttonEdit.disabled).toBeTruthy();

        const deleteButton = el.query(By.css('[data-test-id="button-delete"]'));
        expect(deleteButton).toBeTruthy();
        const buttonDelete = deleteButton.nativeElement as any;
        expect(buttonDelete.disabled).toBeFalsy();
      });

      it('add a Todo with dueDate but is not overtime and is done', () => {
        const newTodo = Object.assign(new Todo(), {
          ...todo,
          dueDate: getDateOffset(3),
          status: 'done',
        });
        component.ngOnChanges({
          todo: new SimpleChange(todo, newTodo, false),
        });
        component.todo = newTodo;
        fixture.detectChanges();
        expect(component.isDone).toBeTruthy();
        expect(component.isDue).toBeFalsy();

        const statusButton = el.query(By.css('[data-test-id="button-status"]'));
        expect(statusButton).toBeFalsy();

        const doneIcon = el.query(By.css('.bi.bi-check-circle.text-success'));
        expect(doneIcon).toBeTruthy();

        const dueDate = el.query(By.css('.small.text-secondary'));
        expect(dueDate).toBeTruthy();
      });

      it('add a Todo with dueDate but is overtime and is done', () => {
        const newTodo = Object.assign(new Todo(), {
          ...todo,
          dueDate: getDateOffset(-1),
          status: 'done',
        });
        component.ngOnChanges({
          todo: new SimpleChange(todo, newTodo, false),
        });
        component.todo = newTodo;
        fixture.detectChanges();
        expect(component.isDone).toBeTruthy();
        expect(component.isDue).toBeFalsy();

        const statusButton = el.query(By.css('[data-test-id="button-status"]'));
        expect(statusButton).toBeFalsy();

        const doneIcon = el.query(By.css('.bi.bi-check-circle.text-success'));
        expect(doneIcon).toBeTruthy();

        const dueDate = el.query(By.css('.small.text-secondary'));
        expect(dueDate).toBeTruthy();
      });
    });
  });

  describe('Output Todo', () => {
    it('emit Output `editTodo` when click on edit button', () => {
      let called = false;
      component.editTodo
        .subscribe({
          next: () => called = true,
        });

      click(fixture, 'button-edit');
      expect(called).toBeTruthy();
    });

    it('emit Output `duplicateTodo` when click on duplicate button', () => {
      let called = false;
      component.duplicateTodo
        .subscribe({
          next: () => called = true,
        });

      click(fixture, 'button-duplicate');
      expect(called).toBeTruthy();
    });

    it('emit Output `deleteTodo` when click on delete button', () => {
      let called = false;
      component.deleteTodo
        .subscribe({
          next: () => called = true,
        });

      click(fixture, 'button-delete');
      expect(called).toBeTruthy();
    });

    it('emit Output `changeStateTodo` when click on change status button', () => {
      let called = false;
      component.changeStateTodo
        .subscribe({
          next: () => called = true,
        });

      click(fixture, 'button-status');
      expect(called).toBeTruthy();
    });
  });
});
