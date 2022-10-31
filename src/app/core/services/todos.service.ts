import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpResponse } from '@angular/common/http'
import { Observable } from 'rxjs';

import { Todo } from '../models/todo.model';
import { map } from 'rxjs';
import { TodoDbo } from '@core/models/todo.dbo';

@Injectable({
  providedIn: 'root'
})
export class TodosService {

  private url = '/TODOS';

  constructor(private http: HttpClient) { }

  getTodos(): Observable<Todo[]>;
  getTodos(): Observable<HttpResponse<Todo[]>>;
  getTodos(): Observable<HttpEvent<Todo[]>>;
  getTodos(): Observable<any> {
    return this.http.get<Todo[]>(this.url)
      .pipe(map((items) => items.map(item => Object.assign(new Todo(), { ...item }))));
  }

  getTodo(id: string): Observable<TodoDbo>;
  getTodo(id: string): Observable<HttpResponse<TodoDbo>>;
  getTodo(id: string): Observable<HttpEvent<TodoDbo>>;
  getTodo(id: string): Observable<any> {
    if (!id || id === '') {
      throw new Error('Required parameter `id` was null or undefined when calling `getTodo`.');
    }
    return this.http.get<Todo>(`${this.url}/${id}`);
  }

  createTodo(todo: TodoDbo): Observable<Todo>;
  createTodo(todo: TodoDbo): Observable<HttpResponse<Todo>>;
  createTodo(todo: TodoDbo): Observable<HttpEvent<Todo>>;
  createTodo(todo: TodoDbo): Observable<any> {
    const { title, body } = todo;
    if (!title || title === '') {
      throw new Error('Required parameter `title` was null or undefined when calling `createTodo`.');
    }
    if (!body || body === '') {
      throw new Error('Required parameter `body` was null or undefined when calling `createTodo`.');
    }
    return this.http.post<Todo>(this.url, todo)
      .pipe(map(todo => Object.assign(new Todo(), { ...todo })));
  }


  updateTodo(todo: TodoDbo): Observable<Todo>;
  updateTodo(todo: TodoDbo): Observable<HttpResponse<Todo>>;
  updateTodo(todo: TodoDbo): Observable<HttpEvent<Todo>>;
  updateTodo(todo: TodoDbo): Observable<any> {
    const { id, title, body, status } = todo;
    if (!id || id === '') {
      throw new Error('Required parameter `id` was null or undefined when calling `updateTodo`.');
    }
    if (!title || title === '') {
      throw new Error('Required parameter `title` was null or undefined when calling `updateTodo`.');
    }
    if (!body || body === '') {
      throw new Error('Required parameter `body` was null or undefined when calling `updateTodo`.');
    }
    if (!status) {
      throw new Error('Required parameter `status` was null or undefined when calling `updateTodo`.');
    }

    return this.http.patch<Todo>(`${this.url}/${id}`, todo)
      .pipe(map(todo => Object.assign(new Todo(), { ...todo })));
  }

  deleteTodo(id: string): Observable<void>;
  deleteTodo(id: string): Observable<HttpResponse<void>>;
  deleteTodo(id: string): Observable<HttpEvent<void>>;
  deleteTodo(id: string): Observable<any> {
    if (!id || id === '') {
      throw new Error('Required parameter `id` was null or undefined when calling `updateTodo`.');
    }
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}
