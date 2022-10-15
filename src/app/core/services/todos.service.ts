import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs';

import { Todo } from '../models/todo.model';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TodosService {

  private url = '/TODOS';

  constructor(private http: HttpClient) { }

  getTodos(): Observable<Todo[]> {
    return this.http.get<Todo[]>(this.url)
      .pipe(map((items) => items.map(item => Object.assign(new Todo(), { ...item }))));
  }

  getTodo(id: string): Observable<Todo> {
    if (!id || id === '') {
      throw new Error('Required parameter `id` was null or undefined when calling `getTodo`.');
    }
    return this.http.get<Todo>(`${this.url}/${id}`)
      .pipe(map(todo => Object.assign(new Todo(), { ...todo })));
  }

  createTodo(todo: Todo): Observable<Todo> {
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

  updateTodo(todo: Todo): Observable<Todo> {
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

  deleteTodo(id: string): Observable<void> {
    if (!id || id === '') {
      throw new Error('Required parameter `id` was null or undefined when calling `updateTodo`.');
    }
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}
