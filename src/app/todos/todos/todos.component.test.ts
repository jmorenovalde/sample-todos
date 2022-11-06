import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';
import { TodosComponent } from './todos.component';
import { TodosService } from '../../core/services/todos.service';
import { Todo } from '../../core/models/todo.model';
import { listTodos } from '../../core/services/todos.service.test';
import { click, getDateOffset } from '../../core/utils-tests';

describe('TodosComponent', () => {
  let component: TodosComponent;
  let fixture: ComponentFixture<TodosComponent>;
  let el: DebugElement;
  let todosService: any;

  const todosServicesMock = {
    getTodos: jest.fn(),
    updateTodo: jest.fn(),
    createTodo: jest.fn(),
    deleteTodo: jest.fn(),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        {
          provide: TodosService,
          useValue: todosServicesMock,
        }
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TodosComponent);
    component = fixture.componentInstance;
    el = fixture.debugElement;
    todosService = fixture.debugElement.injector.get(TodosService);
    fixture.detectChanges();
    jest.spyOn(todosService, 'getTodos').mockReturnValueOnce(of(listTodos) as any);
    component.ngOnInit();
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(component.todos.length).toEqual(listTodos.length)
  });

  describe('onEditTodo', () => {
    it('should show the form and selectedTodo with the todo', () => {
      component.onEditTodo(listTodos[0]);

      expect(component.showForm).toBeTruthy();
      expect(component.todoSelected).toBeTruthy();
      expect(component.todoSelected?.id).toBeTruthy();
    });
  });

  describe('onDuplicateTodo', () => {
    it('should show the form and selectedTodo with the todo', () => {
      component.onDuplicateTodo(listTodos[0]);

      expect(component.showForm).toBeTruthy();
      expect(component.todoSelected).toBeTruthy();
      expect(component.todoSelected?.id).toBeFalsy();
      expect(component.todoSelected?.title).toContain('[Duplicated]');
    });
  });

  describe('onCancelForm', () => {
    it('should not show the form and selectedTodo should be null', () => {
      component.onCancelForm();

      expect(component.showForm).toBeFalsy();
      expect(component.todoSelected).toBe(null);
    });
  });

  describe('onAddTodoClick', () => {
    it('should show the form and selectedTodo should be null when click on `Add todo` button', () => {
      const button = el.query(By.css('[data-test-id="button-add"]'));
      expect(button).toBeTruthy();
      click(fixture, 'button-add');

      expect(component.showForm).toBeTruthy();
      expect(component.todoSelected).toBe(null);
    });
  });

  describe('onChangeStateTodo', () => {
    it('should change the state is status is `none`', () => {
      const todo = listTodos[0];
      todo.status = 'none';
      const todoReturned = Object.assign(new Todo(), { ...todo, status: 'started' });
      jest.spyOn(todosService, 'updateTodo').mockReturnValueOnce(of(todoReturned) as any);
      jest.spyOn(todosService, 'getTodos').mockReturnValueOnce(of([todoReturned, listTodos[1]]) as any);

      component.onChangeStateTodo(todo);

      fixture.detectChanges();
      expect(todosService.updateTodo).toBeCalled();
      expect(component.showForm).toBeFalsy();
      expect(component.todoSelected).toBeFalsy();
      expect(component.todos?.length).toBeTruthy();
      expect(component.todos[0].status).toBe('started');
    });

    it('should change the state is status is `started`', () => {
      const todo = listTodos[0];
      todo.status = 'started';
      const todoReturned = Object.assign(new Todo(), { ...todo, status: 'done' });
      jest.spyOn(todosService, 'updateTodo').mockReturnValueOnce(of(todoReturned) as any);
      jest.spyOn(todosService, 'getTodos').mockReturnValueOnce(of([todoReturned, listTodos[1]]) as any);

      component.onChangeStateTodo(todo);

      fixture.detectChanges();
      expect(todosService.updateTodo).toBeCalled();
      expect(component.showForm).toBeFalsy();
      expect(component.todoSelected).toBeFalsy();
      expect(component.todos?.length).toBeTruthy();
      expect(component.todos[0].status).toBe('done');
    });
  });

  describe('onSubmit', () => {
    it('should not do anything if todo is null or undefined', () => {
      component.onSubmit(null);
      expect(component.todos.length).toBe(2);
    });

    it('should be called `createTodo` if emitted todo has not id', () => {
      const todo = Object.assign(new Todo(), { title: 'Test title add', body: 'Test body add' });
      const todoReturned = Object.assign(new Todo(), {
        ...todo,
        id: 123458,
        created: getDateOffset(0),
        updated: getDateOffset(0),
        status: 'none',
      });
      jest.spyOn(todosService, 'createTodo').mockReturnValueOnce(of(todoReturned) as any);
      jest.spyOn(todosService, 'getTodos').mockReturnValueOnce(of([...listTodos, todoReturned]) as any);

      expect(component.todos.length).toBe(2);

      component.onSubmit(todo);

      fixture.detectChanges();
      expect(todosService.createTodo).toBeCalled();
      expect(component.showForm).toBeFalsy();
      expect(component.todoSelected).toBe(null);
      expect(component.todos.length).toBe(3);
    });

    it('should be called `updateTodo` if emitted todo has id', () => {
      const todo = Object.assign(new Todo(), listTodos[0]);
      todo.title = 'Title edited';
      const todoReturned = Object.assign(new Todo(), {
        ...todo,
        updated: getDateOffset(0),
      });
      jest.spyOn(todosService, 'updateTodo').mockReturnValueOnce(of(todoReturned) as any);
      jest.spyOn(todosService, 'getTodos').mockReturnValueOnce(of([todoReturned, listTodos[1]]) as any);

      expect(component.todos.length).toBe(2);

      component.onSubmit(todo);

      fixture.detectChanges();
      expect(todosService.updateTodo).toBeCalled();
      expect(component.showForm).toBeFalsy();
      expect(component.todoSelected).toBeFalsy();
      expect(component.todos.length).toBe(2);
    });
  });

  describe('onDeleteTodo', () => {
    it('should not do anything if todoId is empty', () => {
      component.onDeleteTodo('');
      expect(component.todos.length).toBe(2);
    });

    it('should not do anything if todoId is null or undefined', () => {
      component.onDeleteTodo(null);
      expect(component.todos.length).toBe(2);
    });

    it('should call method deleteTodo from TodoService if id is valid.', () => {
      const todoId = listTodos[0].id;
      jest.spyOn(todosService, 'deleteTodo').mockReturnValue(of(null));
      jest.spyOn(todosService, 'getTodos').mockReturnValueOnce(of([listTodos[1]]) as any);

      component.onDeleteTodo(todoId);

      fixture.detectChanges();
      expect(todosService.deleteTodo).toBeCalled();
      expect(component.todoSelected).toBe(null);
      expect(component.todos.length).toBe(1);
    });
  });

  afterEach(() => {
    jest.resetAllMocks();
  });
});
