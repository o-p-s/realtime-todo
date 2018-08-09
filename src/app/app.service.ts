import { Injectable } from '@angular/core';
import { HttpClient,HttpParams} from '@angular/common/http';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/toPromise';
import {Cookie} from 'ng2-cookies/ng2-cookies';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class AppService {
  private url="http://localhost:3000";
  public loggedIn:boolean=false;
  constructor(public http:HttpClient,private router:Router,private toastr:ToastrService) { }
  
  public signupFunction(data):Observable<any>{
    const params= new HttpParams()
    .set('firstName',data.firstName)
    .set('lastName',data.lastName)
    .set('mobile',data.mobile)
    .set('countryCode',data.countryCode)
    .set('country',data.country)
    .set('email',data.email)
    .set('password',data.password)

    return this.handleError(this.http.post(`${this.url}/api/v1/users/signup`,params))
  } //end of signupFunction

  public signinFunction(data):Observable<any>{
    const params= new HttpParams()
    .set('email',data.email)
    .set('password',data.password);

    return this.handleError(this.http.post(`${this.url}/api/v1/users/login`,params))
  } //end of loginFunction

  public setUserInfoInLocalStorage=(data)=>{
    localStorage.setItem('userInfo',JSON.stringify(data));
  }

  public getUserInfoFromLocalStorage=()=>{
    return JSON.parse(localStorage.getItem('userInfo'));
  }

  public logout(): Observable<any> {
    const params = new HttpParams()
      .set('authToken',Cookie.get('authtoken'))
      .set('userId', Cookie.get('userId'))
      return this.handleError(this.http.post(`${this.url}/api/v1/users/logout`, params))
    //.catch(this.handleError)
  } // end logout function

  public forgotPassword(data):Observable<any>{
    const params=new HttpParams()
    .set('email',data.email)
    return this.handleError(this.http.post(`${this.url}/api/v1/users/forgot-password`,params))
    //.catch(this.handleError)
  }
  public resetPassword(data):Observable<any>{
    const params=new HttpParams()
    .set('newPassword',data.newPassword)
    .set('verifyPassword',data.verifyPassword)
    .set('token',data.token)
    return this.handleError(this.http.post(`${this.url}/api/v1/users/reset-password`,params))
    //.catch(this.handleError)
  }
  public signUpVerification(data):Observable<any>{
    const params=new HttpParams()
    .set('token',data.token)
    return this.handleError(this.http.post(`${this.url}/api/v1/users/signUp-verification`,params))
    //.catch(this.handleError)
  }

  public handleError(data){
    if(data.status==500){
      this.router.navigate(['/internal-error'])
      console.log(data.message);
      this.toastr.error(data.message)
      return null;
     }
     else return data
  }

}
