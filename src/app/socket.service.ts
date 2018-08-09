import { Injectable , OnDestroy, ViewChild } from '@angular/core';
import * as io from 'socket.io-client';
import {HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/toPromise';

import { Cookie } from 'ng2-cookies/ng2-cookies';
import { ToastrService } from 'ngx-toastr';
import { AppService } from './app.service';

@Injectable({
  providedIn: 'root'
})

export class SocketService {
  private url = 'http://localhost:3000';  
  private socket;
  public friend;
  private userInfo=this.appService.getUserInfoFromLocalStorage();
  constructor(private http:HttpClient,private toastr:ToastrService,private appService:AppService) { 
    //connection is being created
    this.socket=io(this.url); 
    this.setUserToList(Cookie.get('authtoken'));
  }
  /**
   * ******ALL USER RELATED FUNCTIONS********
   */
  
  /*** Emitters **/
  public setUserToList=(data)=>{
    this.socket.emit('set-user',(data));
  } //end of setUser
  public getAllUsers(){
    this.socket.emit('get-users')
  };// end of getting alluserslist
  public sendRequest(data){
    this.socket.emit('send-request',(data));
  }
  public cancelRequest(data){
    this.socket.emit('cancel-request',(data));
  }
  public acceptRequest(data){
    this.socket.emit('accept-request',(data));
  }
  public declineRequest(data){
    this.socket.emit('decline-request',(data));
  }
  public removeFriend(data){
    this.socket.emit('remove-friend',data);
  }
  public exitSocket=()=>{
    this.socket.disconnect();
  }// end exit socket

  /*** Listeners ***/
  public authError=()=>{
    return Observable.create((observer)=>{
      this.socket.on('auth-error',(data)=>{
        observer.next(data);
      }); //end of Socket
    }); //end of Observer
  } //emd of auth-error
  public allUsersList=()=>{
    return Observable.create((observer)=> {
      this.socket.on('all-users-list', (userList)=>{
        observer.next(this.appService.handleError(userList)) 
      });//end of socket
    }); //end of Observer
  } //end of allUsersList receiving 
  public allRequests=(skip):Observable<any>=>{
    return this.appService.handleError(this.http.get(`${this.url}/api/v1/friends/requests?userId=${Cookie.get('userId')}&skip=${skip}&authToken=${Cookie.get('authtoken')}`))
  }
  public onNewRequest(){
    return new Observable((observer)=>{
      this.socket.on('new request',data=>{
        this.toastr.success(`Request sent successfully to ${data.receiverName}`)
        observer.next(data);
      })
    })
  }
  public onCancelRequest(){
    return new Observable((observer)=>{
      this.socket.on('cancel request',data=>{
        this.toastr.success(`Request cancelled successfully`)
        observer.next(data);
      })
    })
  }
  public onAcceptRequest(){
    return new Observable((observer)=>{
      this.socket.on('accept request',data=>{
        this.userInfo['friends'].push(data['senderId']);
        this.appService.setUserInfoInLocalStorage(this.userInfo);
        this.toastr.success(`Congratulations!! You are now friends with ${data.senderName}`)
        observer.next(data);
      })
    })
  }
  public onDeclineRequest(){
    return new Observable((observer)=>{
      this.socket.on('decline request',data=>{
        this.toastr.success(`${data.receiverName} has declined your friend request.`)
        observer.next(data);
      })
    })
  }
  public onRemoveFriend(){
    return new Observable((observer)=>{
      this.socket.on('remove friend',(data)=>{
        this.toastr.info(`${data.userName} isn't your friend now.`);               
        this.userInfo.friends.splice(this.userInfo['friends'].findIndex(f=>(f==data['userId'])),1)
        this.appService.setUserInfoInLocalStorage(this.userInfo);
        observer.next(data);
      })
    })
  }
  public myIOUserId=(userId)=>{
    return Observable.create((observer) => {     
      this.socket.on(userId, (data) => {
        if(data.action=="new request"){
          this.toastr.info(`You have received a friend request from ${data.senderName}`)
        }
         else if(data.action=="cancel request"){
          this.toastr.info(`Friend request was cancelled from ${data.senderName}`)
        }
        else if(data.action=="accept request"){
          this.userInfo['friends'].push(data['receiverId']);
          this.appService.setUserInfoInLocalStorage(this.userInfo);
          this.toastr.info(`Congratulations!! You are now friends with ${data.receiverName}`)
        }
        else if(data.action=="decline request"){
          this.toastr.info(`Friend request was declined from ${data.receiverName}`)
        }
        else if(data.action=='remove friend'){     
          this.userInfo.friends.splice(this.userInfo['friends'].findIndex(f=>(f==data['senderId'])),1)
          this.appService.setUserInfoInLocalStorage(this.userInfo);
          this.toastr.info(`${data.senderName} has removed you from their friend list.`)
        }
        observer.next(data);
      }); // end Socket
    }); // end Observable
  } 

  /**
   ********** ALL LIST RELATED FUNCTIONS********
   */

  /*** Emitters ***/
  public fetchLists=(data,pageValue):Observable<any>=>{
    return this.appService.handleError(this.http.get(`${this.url}/api/v1/lists/get/by/user?userId=${data}&skip=${pageValue}&authToken=${Cookie.get('authtoken')}`))
  }
  public getLastChange=(data)=>{
    this.socket.emit('last-change-on-list',data);
  }
    //create new list
  public createList=(data)=>{
    this.socket.emit('create-list', data);
  } // end of creating new list

  public removeList=(data)=>{
    this.socket.emit('delete-list',data);
  } //end of removing list

  public sendListChange=(data)=>{
   this.socket.emit('list-change',data); 
  } //end of sendList change

  public increaseElement=(data)=>{
    this.socket.emit('increase-element',data);
  } //end of increase Item in the List

  public decreaseElement=(data)=>{
    this.socket.emit('decrease-element',data);
  } //end of increase Item in the List

  /*** Listeners ***/
  public onListChanges=()=>{
    return Observable.create((observer)=>{
      this.socket.on('onChanges-inList',(data)=>{
        observer.next(data)
      })
    })
  }

}
