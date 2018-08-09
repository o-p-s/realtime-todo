import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InternalErrorComponent } from './internal-error/internal-error.component';
import { RouterModule } from '@angular/router';
import { NotFoundComponent } from './not-found/not-found.component';



@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild([
      {path:'not-found',component:NotFoundComponent},
      {path:'internal-error',component:InternalErrorComponent}
    ])
  ],
  declarations: [NotFoundComponent, InternalErrorComponent]
})
export class ErrorsModule { }
