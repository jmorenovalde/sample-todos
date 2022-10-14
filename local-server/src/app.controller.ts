import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { AppService } from './app.service';
import { Todo } from './todo.model';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  getTodos(): Todo[] {
    return this.appService.getTodos();
  }

  @Get(':id')
  getTodo(@Param('id') id: string): Todo {
    return this.appService.getTodo(id);
  }

  @Post()
  createTodo(@Body() todo: Todo): Todo {
    return this.appService.createTodo(todo);
  }

  @Patch(':id')
  updateTodo(@Param('id') id: string, @Body() todo: Todo): Todo {
    return this.appService.updateTodo(id, todo);
  }

  @Delete(':id')
  deleteTodo(@Param('id') id: string): void {
    this.appService.deleteTodo(id);
  }
}
