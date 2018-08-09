import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { SignUpVerificationComponent } from './sign-up-verification/sign-up-verification.component';
import { FriendsComponent } from './friends/friends.component';
import { ListsGuardService } from '../lists/lists-guard.service';
import { SharedModule } from '../shared/shared.module';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    RouterModule.forChild([
      {path:'login',component:LoginComponent,pathMatch:'full'},
      {path:'sign-up',component:SignupComponent},
      {path:'friends',component:FriendsComponent,canActivate:[ListsGuardService]},
      {path:'sign-up-verification',component:SignUpVerificationComponent},
      {path:'forgot-password',component:ForgotPasswordComponent},
      {path:'reset-password',component:ResetPasswordComponent}
    ])
  ],
  declarations: [LoginComponent, SignupComponent, ForgotPasswordComponent, ResetPasswordComponent,SignUpVerificationComponent, FriendsComponent]
})
export class UserModule { }
