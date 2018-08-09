import { Component, OnInit } from '@angular/core';
import { AppService } from './../../app.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CountryCodesService } from '../../shared/country-codes.service';


@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
  providers:[CountryCodesService]
})
export class SignupComponent implements OnInit {

  public firstName: any;
  public lastName: any;
  public mobile: any;
  public email: any;
  public password: any;

  constructor(  
    public appService: AppService,
    public router: Router,
    private toastr: ToastrService,
    private countryCodes:CountryCodesService){
     }
  public codes;   
  public cc;
  ngOnInit() {
    this.getCodes();
  }
  public getCodes(){
    this.codes=this.countryCodes.fetchCodes();
  }
  public goToSignIn: any = () => {

    this.router.navigate(['/']);

  } // end goToSignIn

  public signupFunction: any = () => {

    if (!this.firstName) {
      this.toastr.warning('enter first name')     

    } else if (!this.lastName) {
      this.toastr.warning('enter last name')

    } else if (!this.mobile) {
      this.toastr.warning('enter mobile')

    } else if (!this.email) {
      this.toastr.warning('enter email')

    } else if (!this.password) {
      this.toastr.warning('enter password')     

    }  else  if (!this.password.match(/^[A-Za-z0-9]\w{7,}$/)){
      /* Minimum 8 characters which contain only characters,numeric digits, underscore and first character must be a letter */ 
      this.toastr.warning('Passwrod does not meet requirements')
    }
    else if(!this.email.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)){
      this.toastr.warning('Enter valid email!')
    }

    else {

      let data = {
        firstName: this.firstName,
        lastName: this.lastName,
        country:this.countryCodes.getCountryName(this.cc),
        countryCode:this.cc,
        mobile: this.mobile,
        email: this.email,
        password: this.password
      }
      this.appService.signupFunction(data)
        .subscribe((apiResponse) => {
          if (apiResponse.status === 200) {
            this.toastr.success(apiResponse.message);
            setTimeout(() => { this.goToSignIn();}, 2000);
          } 
        },(err) => {
          this.toastr.error(err);
        });

    } // end condition

  } // end signupFunction

}
