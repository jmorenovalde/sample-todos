import { DebugElement, SimpleChange } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { click, getDateOffset, getDateString } from '../../core/utils-tests';
import { Todo } from '../../core/models/todo.model';
import { TodoFormComponent } from './todo-form.component';
import { By } from '@angular/platform-browser';

describe('TodoFormComponent', () => {
  let component: TodoFormComponent;
  let fixture: ComponentFixture<TodoFormComponent>;
  let el: DebugElement;
  beforeEach(async () => {
    await TestBed.configureTestingModule({}).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TodoFormComponent);
    component = fixture.componentInstance;
    el = fixture.debugElement;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Todo is null', () => {
    beforeEach(() => {
      component.ngOnChanges({
        todo: new SimpleChange(null, null, true),
      });
      component.todo = null;
      fixture.detectChanges();
    });

    it('check all fields are empty and buttons are disabled', () => {
      // This can check by to ways:
      // 1: by code
      const title = component.todoForm.get('todoTitle')?.value;
      const body = component.todoForm.get('todoBody')?.value;
      const dueDate = component.todoForm.get('todoDueDate')?.value;

      expect(title).toBe('');                     // formTitle
      expect(body).toBe('');                      // formBody
      expect(dueDate).toBe('');                   // formDueDate
      expect(component.canSaveTodo).toBeFalsy();  // button-save

      // 2: by view
      const formTitle = el.query(By.css('#formTitle'));
      const inputTitle = formTitle.nativeElement as any;
      expect(inputTitle.value).toBe('');

      const formBody = el.query(By.css('#formBody'));
      const inputBody = formBody.nativeElement as any;
      expect(inputBody.value).toBe('');

      const formDueDate = el.query(By.css('#formDueDate'));
      const inputDueDate = formDueDate.nativeElement as any;
      expect(inputDueDate.value).toBe('');

      const buttonSave = el.query(By.css('[data-test-id="button-save"]'));
      const saveButton = buttonSave.nativeElement as any;
      expect(saveButton.disabled).toBeTruthy();
    });

    it('should enable save button if title and body are filled', () => {
      component.todoForm.get('todoTitle')?.setValue('Test title');
      component.todoForm.get('todoBody')?.setValue('Test body');
      fixture.detectChanges();

      expect(component.canSaveTodo).toBeTruthy();  // button-save
    });

    it('should send cancel output when click on cancel and clear the form', () => {
      component.todoForm.get('todoTitle')?.setValue('Test title');
      component.todoForm.get('todoBody')?.setValue('Test body');
      fixture.detectChanges();

      let called = false;
      component.cancel
        .subscribe({
          next: () => called = true,
        });

      click(fixture, 'button-cancel');
      expect(called).toBeTruthy();
      const title = component.todoForm.get('todoTitle')?.value;
      expect(title).toBe(null);
      const body = component.todoForm.get('todoBody')?.value;
      expect(body).toBe(null);
      const dueDate = component.todoForm.get('todoDueDate')?.value;
      expect(dueDate).toBe(null);
    });

    it('should send submit output when click on save and clear the form', () => {
      component.todoForm.get('todoTitle')?.setValue('Test title');
      component.todoForm.get('todoBody')?.setValue('Test body');
      fixture.detectChanges();

      let called = false;
      component.submit
        .subscribe({
          next: () => called = true,
        });

      click(fixture, 'button-save');
      expect(called).toBeTruthy();
      const title = component.todoForm.get('todoTitle')?.value;
      expect(title).toBe(null);
      const body = component.todoForm.get('todoBody')?.value;
      expect(body).toBe(null);
      const dueDate = component.todoForm.get('todoDueDate')?.value;
      expect(dueDate).toBe(null);
    });
  });

  describe('Todo is not null', () => {
    let todo: Todo;
    beforeEach(() => {
      todo = Object.assign(new Todo(), {
        title: 'Test title',
        body: 'Test body',
        id: '123456',
        created: getDateOffset(-3),
        updated: getDateOffset(-2),
        dueDate: getDateOffset(2),
        status: 'none',
      });
      component.ngOnChanges({
        todo: new SimpleChange(null, todo, true),
      });
      component.todo = todo;
    });

    it('should be initialized with the todo values', () => {
      component.ngOnInit();
      const title = component.todoForm.get('todoTitle')?.value;
      expect(title).toBe(todo.title);

      const body = component.todoForm.get('todoBody')?.value;
      expect(body).toBe(todo.body);

      const dueDate = component.todoForm.get('todoDueDate')?.value;
      expect(dueDate).toBe(getDateString(todo.dueDate));
    });

    it('should submit the edited element', () => {
      const editedTitle = 'Test title edited';
      const editedBody = 'Test body edited';
      component.todoForm.get('todoTitle')?.setValue(editedTitle);
      component.todoForm.get('todoBody')?.setValue(editedBody);
      fixture.detectChanges();

      let called = false;
      component.submit
        .subscribe({
          next: (todo: Todo) => {
            called = true
            expect(todo.title).toBe(editedTitle);
            expect(todo.body).toBe(editedBody);
          },
        });

      click(fixture, 'button-save');
      expect(called).toBeTruthy();
      const title = component.todoForm.get('todoTitle')?.value;
      expect(title).toBe(null);
      const body = component.todoForm.get('todoBody')?.value;
      expect(body).toBe(null);
      const dueDate = component.todoForm.get('todoDueDate')?.value;
      expect(dueDate).toBe(null);
    });
  });
});
