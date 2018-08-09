import { Injectable } from '@angular/core';
import { Router, ActivatedRouteSnapshot, CanActivate } from '@angular/router';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { AppService } from '../app.service';
import { SocketService } from '../socket.service';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ListsGuardService implements CanActivate {
  
  constructor(private router:Router,private appService:AppService,private toastr:ToastrService,
    private socketService:SocketService) {
    this.socketService.authError().subscribe((data)=>{
      if(data.status==500){
        this.router.navigate(['/']);
        toastr.error('Authentication Token could not be verified.');
        this.appService.loggedIn=false;
      }
    })
  }
 
  canActivate(route : ActivatedRouteSnapshot) : boolean{
    console.log('in guard service');
    if (Cookie.get('authtoken') === undefined || Cookie.get('authtoken') === '' || Cookie.get('authtoken') === null) {
      this.router.navigate(['/']);
      this.appService.loggedIn=false;
      return false;
    }else {
      this.appService.loggedIn=true;
      return true;
    } 
  }
}
