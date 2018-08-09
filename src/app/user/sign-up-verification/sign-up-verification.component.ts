import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppService } from '../../app.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-sign-up-verification',
  templateUrl: './sign-up-verification.component.html',
  styleUrls: ['./sign-up-verification.component.css']
})
export class SignUpVerificationComponent implements OnInit {
  private token;
  public progress='0%';
  constructor(public appService: AppService,public router: Router, private toastr: ToastrService,private _route:ActivatedRoute) {
  }

  public goToSignIn: any = () => {
    this.router.navigate(['/']);
  } // end goToSignIn

  ngOnInit() {
    this.token=this._route.snapshot.queryParamMap.get('token')
    if(this.token==''||this.token==null||this.token==undefined){
    this.goToSignIn();
    }else{
      setTimeout(()=>{this.progress="25%"},1000)
      setTimeout(()=>{this.progress="50%"},1000)
    let data={token:this.token};
    this.appService.signUpVerification(data).subscribe((apiResponse)=>{
        if (apiResponse.status === 200) {
          this.toastr.success(apiResponse.message);
            setTimeout(() => {
              this.goToSignIn();
            }, 2000);
        }else {
          console.log(apiResponse.message)
          this.toastr.error(apiResponse.message)
        }
      },(err) => {
        console.log(err.error.message);
        this.toastr.error(err.error.message);
      })
    }
  }

}
