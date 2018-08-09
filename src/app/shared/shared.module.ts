import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './navbar/navbar.component';
import { FooterComponent } from './footer/footer.component';

import { RouterModule } from '@angular/router';
import { NewListComponent } from './new-list/new-list.component';
import { FormsModule } from '@angular/forms';
import { DebounceClickDirective } from './double-click.directive';
import { LoaderComponent } from './loader/loader.component';

@NgModule({
  imports: [
    RouterModule,
    CommonModule,
    FormsModule    
  ],
  declarations: [NavbarComponent, FooterComponent, NewListComponent,DebounceClickDirective, LoaderComponent],

  exports:[NavbarComponent,FooterComponent,NewListComponent,DebounceClickDirective,LoaderComponent]
})
export class SharedModule { }
