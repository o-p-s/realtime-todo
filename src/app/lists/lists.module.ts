import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TodoListsComponent } from './todo-lists/todo-lists.component';
import { RouterModule } from '@angular/router';
import { ListsGuardService } from './lists-guard.service';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { SocketService } from '../socket.service';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    RouterModule.forChild([
      {path:'lists/:userId',component:TodoListsComponent,canActivate:[ListsGuardService]}      
    ])
  ],
  declarations: [TodoListsComponent],
  providers:[SocketService]
})
export class ListsModule { }
