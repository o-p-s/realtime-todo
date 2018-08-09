import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-internal-error',
  templateUrl: './internal-error.component.html',
  styleUrls: ['./internal-error.component.css']
})
export class InternalErrorComponent implements OnInit {

  constructor(private router:Router) { }

  ngOnInit() {
  }
  public goBack(){
    this.router.navigate(['/']);
  }

}
