import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { TodosService } from './core/services/todos.service';
import { TodosComponent } from './todos/todos/todos.component';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    TodosComponent,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
