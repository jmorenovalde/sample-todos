import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { TodosService } from './todos.service';
import { Todo } from '../models/todo.model';
import { getDateOffset } from '../utils';
import { HttpErrorResponse } from '@angular/common/http';

describe('TodosService', () => {

  let service: TodosService;
  let httpTestingController: HttpTestingController;
  let url = '/TODOS';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TodosService],
    });
    service = TestBed.inject(TodosService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getTodos', () => {
    it('check the URL of the method', () => {
      service.getTodos()
        .subscribe((response) => {
          expect(response).toBeTruthy();
          expect(response).toEqual(listTodos);
        });
      const req = httpTestingController.expectOne(url);
      expect(req.request.method).toEqual('GET');
      req.flush(listTodos);
    });

    it('On error return a any response', () => {
      service.getTodos()
        .subscribe({
          next: (response) => fail('Internal server Error'),
          error: (error: HttpErrorResponse) => {
            expect(error.status).toBe(500);
          }
        });
      const req = httpTestingController.expectOne((httpRequest) => httpRequest.url === url);
      expect(req.request.method).toEqual('GET');
      req.flush('Internal Server Error', { status: 500, statusText: 'Internal Server Error' });
    });
  });

  describe('getTodo', () => {
    let getTodoUrl: string;
    let id = '123456';

    beforeEach(() => {
      getTodoUrl = `${url}/${id}`;
    });

    it('check the URL of the method', () => {
      service.getTodo(id)
        .subscribe((response) => {
          expect(response).toBeTruthy();
          expect(response).toEqual(listTodos[0]);
        });
      const req = httpTestingController.expectOne(getTodoUrl);
      expect(req.request.method).toEqual('GET');
      req.flush(listTodos[0]);
    });

    it('On error return a any response', () => {
      service.getTodo(id)
        .subscribe({
          next: (response) => fail('Internal server Error'),
          error: (error: HttpErrorResponse) => {
            expect(error.status).toBe(500);
          }
        });
      const req = httpTestingController.expectOne((httpRequest) => httpRequest.url === getTodoUrl);
      expect(req.request.method).toEqual('GET');
      req.flush('Internal Server Error', { status: 500, statusText: 'Internal Server Error' });
    });

    it('call the method with id is an empty string, return an error from the method', () => {
      expect(() => service.getTodo('')).toThrow();
    });

    it('call the method with id is `null` or `undefinded`, return an error from the method', () => {
      let idNew: string;
      expect(() => service.getTodo(idNew)).toThrow();
    });
  });

  describe('createTodo', () => {
    it('check the URL of the method', () => {
      service.createTodo(listTodos[0])
        .subscribe((response) => {
          expect(response).toBeTruthy();
          expect(response).toEqual(listTodos[0]);
        });
      const req = httpTestingController.expectOne(url);
      expect(req.request.method).toEqual('POST');
      req.flush(listTodos[0]);
    });

    it('On error return a any response', () => {
      service.createTodo(listTodos[0])
        .subscribe({
          next: (response) => fail('Internal server Error'),
          error: (error: HttpErrorResponse) => {
            expect(error.status).toBe(500);
          }
        });
      const req = httpTestingController.expectOne((httpRequest) => httpRequest.url === url);
      expect(req.request.method).toEqual('POST');
      req.flush('Internal Server Error', { status: 500, statusText: 'Internal Server Error' });
    });

    it('call the method with title is an empty string, return an error from the method', () => {
      const todo = new Todo();
      todo.title = '';
      expect(() => service.createTodo(todo)).toThrow();
    });

    it('call the method with body is an empty string, return an error from the method', () => {
      const todo = new Todo();
      todo.title = 'Test';
      todo.body = '';
      expect(() => service.createTodo(todo)).toThrow();
    });
  });

  describe('update', () => {
    let getTodoUrl: string;
    let id = '123456';

    beforeEach(() => {
      getTodoUrl = `${url}/${id}`;
    });

    it('check the URL of the method', () => {
      const todo = Object.assign(new Todo(), { ...listTodos[0], id });
      service.updateTodo(todo)
        .subscribe((response) => {
          expect(response).toBeTruthy();
          expect(response).toEqual(todo);
          expect(response.id).toEqual(id);
        });
      const req = httpTestingController.expectOne(getTodoUrl);
      expect(req.request.method).toEqual('PATCH');
      req.flush(todo);
    });

    it('On error return a any response', () => {
      service.updateTodo(listTodos[0])
        .subscribe({
          next: (response) => fail('Internal server Error'),
          error: (error: HttpErrorResponse) => {
            expect(error.status).toBe(500);
          }
        });
      const req = httpTestingController.expectOne((httpRequest) => httpRequest.url === getTodoUrl);
      expect(req.request.method).toEqual('PATCH');
      req.flush('Internal Server Error', { status: 500, statusText: 'Internal Server Error' });
    });

    it('call the method with id is an empty string, return an error from the method', () => {
      const todo = new Todo();
      expect(() => service.updateTodo(todo)).toThrow();
    });

    it('call the method with title is an empty string, return an error from the method', () => {
      const todo = new Todo();
      todo.id = id;
      todo.title = '';
      expect(() => service.updateTodo(todo)).toThrow();
    });

    it('call the method with body is an empty string, return an error from the method', () => {
      const todo = new Todo();
      todo.id = id;
      todo.title = 'Test';
      todo.body = '';
      expect(() => service.updateTodo(todo)).toThrow();
    });

    it('call the method with status is an empty string, return an error from the method', () => {
      const todo = new Todo();
      todo.id = id;
      todo.title = 'Test';
      todo.body = 'Test';
      expect(() => service.updateTodo(todo)).toThrow();
    });
  });

  describe('deleteTodo', () => {
    let getTodoUrl: string;
    let id = '123456';

    beforeEach(() => {
      getTodoUrl = `${url}/${id}`;
    });

    it('check the URL of the method', () => {
      service.deleteTodo(id)
        .subscribe((response) => {
          expect(response).toBeTruthy();
        });
      const req = httpTestingController.expectOne(getTodoUrl);
      expect(req.request.method).toEqual('DELETE');
      req.flush('');
    });

    it('On error return a any response', () => {
      service.deleteTodo(id)
        .subscribe({
          next: (response) => fail('Internal server Error'),
          error: (error: HttpErrorResponse) => {
            expect(error.status).toBe(500);
          }
        });
      const req = httpTestingController.expectOne((httpRequest) => httpRequest.url === getTodoUrl);
      expect(req.request.method).toEqual('DELETE');
      req.flush('Internal Server Error', { status: 500, statusText: 'Internal Server Error' });
    });
  });

  it('call the method with id is an empty string, return an error from the method', () => {
    const todo = new Todo();
    expect(() => service.deleteTodo('')).toThrow();
  });

  afterEach(() => {
    httpTestingController.verify();
  });
});

export const listTodos: Todo[] = [
  Object.assign(new Todo(), {
    id: '123456',
    title: 'Title 1',
    body: 'Body 1',
    status: 'started',
    created: getDateOffset(-3),
    updated: getDateOffset(-1)
  }),
  Object.assign(new Todo(), {
    id: '123457',
    title: 'Title 2',
    body: 'Body 3',
    status: 'started',
    created: getDateOffset(-4),
    updated: getDateOffset(-1),
    dueDate: getDateOffset(2),
  }),
];
