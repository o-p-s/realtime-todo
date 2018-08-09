import { Component, OnInit,ViewContainerRef } from '@angular/core';
import { Router } from '@angular/router';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { AppService } from './../../app.service';
import { ToastrService } from 'ngx-toastr';
import { SocketService } from '../../socket.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public email: any;
  public password: any;

  constructor(
    public appService: AppService,
    public router: Router,
    private toastr: ToastrService,
    private socketService:SocketService){}

  ngOnInit() {
  }

  public goToForgotPassword: any = () => {

    this.router.navigate(['/forgot-password']);

  } // end goToSignUp
  public signinFunction: any = () => {

    if (!this.email) {
      this.toastr.warning('enter email')

    } else if (!this.password) {

      this.toastr.warning('enter password')

    } else if(!this.email.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)){
      this.toastr.warning('Enter valid email!')
    } else {

      let data = {
        email: this.email,
        password: this.password
      }

      this.appService.signinFunction(data)
        .subscribe((apiResponse) => {
          if (apiResponse.status === 200) {
             Cookie.set('authtoken', apiResponse.data.authToken);
             Cookie.set('userId', apiResponse.data.userDetails.userId);
             Cookie.set('userName', apiResponse.data.userDetails.firstName + ' ' + apiResponse.data.userDetails.lastName);
             this.appService.setUserInfoInLocalStorage(apiResponse.data.userDetails)
             this.socketService.setUserToList(Cookie.get('authtoken')); 
             this.appService.loggedIn=true;
             this.router.navigate(['/lists','mylists']);  
             this.toastr.success(apiResponse.message);
          }else {
            this.toastr.error(apiResponse.message)
          }
        },(err)=>{
          console.log(err.error.message);
          this.toastr.error(err.error.message);
        });

    } // end condition

  } // end signinFunction

}