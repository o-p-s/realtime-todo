import { Component, OnInit } from '@angular/core';
import { SocketService } from '../../socket.service';
import {Cookie } from 'ng2-cookies';
import { AppService } from '../../app.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { user } from './user';
@Component({
  selector: 'app-friends',
  templateUrl: './friends.component.html',
  styleUrls: ['./friends.component.css']
})
export class FriendsComponent implements OnInit {
  public usersList:Array<user>=[];      //for all users
  public friendsList:Array<any>=[];    // for all friends
  public requestsList:Array<any>=[];      // for all request
  public userInfo;
  public loaderState:boolean=false;
  private pageValue=0;
  constructor(private socketService:SocketService,private appService:AppService,
    private router:Router,private toastr:ToastrService) { }

  ngOnInit() {
   this.userInfo=this.appService.getUserInfoFromLocalStorage();
   this.getAllRequests();
   this.getAllUserList();
   this.onNewRequest();
   this.onCancelRequest();
   this.onAcceptRequest();
   this.onDeclineRequest();
   this.onRemoveFriend();
   this.myChannel();
   this.socketService.getAllUsers();   
  }
  public setfriend(data){
    this.socketService.friend=data;this.router.navigate(['/lists',data.userId])
  }
  public getAllUserList=()=>{
    this.socketService.allUsersList().subscribe((userList) => {
        this.usersList = [];this.friendsList=[];
        for (let x in userList) {
          if(x!=this.userInfo.userId){
            let temp = { 'userId': x, 'userName': userList[x],'active':false,'friends':false};
            if(this.userInfo.friends!=undefined && this.userInfo.friends!=null && this.userInfo.friends.length!=0){  
              this.userInfo.friends.map((f)=>{ 
                if(x==f){
                temp['friends']=true;
                this.friendsList.push({ 'userId': x, 'userName': userList[x],'active':false ,'friends':true  })
                }
              })
            }        
            if(this.requestsList!=null && this.requestsList!=undefined && this.requestsList.length!=0){
              this.requestsList.map((request)=>{
                if((request.senderId==this.userInfo.userId && request.receiverId==x) || (request.receiverId==this.userInfo.userId && request.senderId==x))
                  temp['active']=true;
                })
            }
            this.usersList.push(temp); 
          }      
        }
      }); // end online-user-list
  }
  public getAllRequests=()=>{
    let previousrequests=this.requestsList.length>0?this.requestsList.slice():[];
    this.socketService.allRequests(this.pageValue*10).subscribe((requests)=>{
      if(requests.status==200){
        this.requestsList=requests.data.concat(previousrequests)
        this.toastr.success(requests.message)
      }else{
        this.toastr.info(requests.message)
      }
      setTimeout(() => {this.loaderState=false}, 1000); 
    },(err)=>{
      console.log(err.error.message)
      this.toastr.info(err.error.message)
      setTimeout(() => {this.loaderState=false}, 1000); 
    })
  }
  public getMore(){
    this.pageValue++;
    this.loaderState=true;
    this.getAllRequests();
  }
  public sendRequest(data){
    data['senderId']=this.userInfo.userId;
    data['senderName']=this.userInfo.senderName;
    this.socketService.sendRequest(data);
  }
  public cancelRequest(request){
    this.socketService.cancelRequest(request)
  }
  public acceptRequest(request){
    this.socketService.acceptRequest(request);
  }
  public declineRequest(request){
    this.socketService.declineRequest(request);
  }
  public removeFriend(data){
    data['senderId']=this.userInfo.userId;
    data['senderName']=this.userInfo.userName;
    this.socketService.removeFriend(data);
  }
  public onNewRequest=()=>{
    this.socketService.onNewRequest().subscribe((data)=>{
      this.usersList[this.usersList.map((user)=>{return user.userId}).indexOf(data['receiverId'])].active=true;
      this.requestsList.push(data)
    })
  }
  public onCancelRequest=()=>{
    this.socketService.onCancelRequest().subscribe((data)=>{
      this.usersList[this.usersList.map((user)=>{return user.userId}).indexOf(data['receiverId'])].active=false;
      let i=this.requestsList.findIndex(req=>(req.senderId==data['senderId'] && req.receiverId==data['receiverId']));
        this.requestsList.splice(i,1)
    })
  }
  public onAcceptRequest=()=>{
    this.socketService.onAcceptRequest().subscribe((data)=>{
      this.usersList[this.usersList.map((user)=>{return user.userId}).indexOf(data['senderId'])].active=false;
      this.usersList[this.usersList.map((user)=>{return user.userId}).indexOf(data['senderId'])].friends=true;
      let i=this.requestsList.findIndex(req=>(req.senderId==data['senderId'] && req.receiverId==data['receiverId']));
      this.requestsList.splice(i,1)
      this.friendsList.push({ 'userId': data['senderId'], 'userName': data['senderName'],'active':false ,'friends':true  })
    })
  }
  public onDeclineRequest=()=>{
    this.socketService.onDeclineRequest().subscribe((data)=>{
      this.usersList[this.usersList.map((user)=>{return user.userId}).indexOf(data['senderId'])].active=false;
      let i=this.requestsList.findIndex(req=>(req.senderId==data['senderId'] && req.receiverId==data['receiverId']));
        this.requestsList.splice(i,1)
    })
  }
  public onRemoveFriend=()=>{
    this.socketService.onRemoveFriend().subscribe((data)=>{
      this.usersList[this.usersList.map((user)=>{return user.userId}).indexOf(data['userId'])].friends=false;
      let i=this.friendsList.findIndex(f=>(f.userId==data['userId']));
      this.friendsList.splice(i,1)
    })
  }
  public myChannel(){
    this.socketService.myIOUserId(this.userInfo.userId).subscribe((data)=>{
      if(data.action=='new request'){
        this.usersList[this.usersList.map((user)=>{return user.userId}).indexOf(data.senderId)].active=true;
        this.requestsList.push(data)
      }
      else if(data.action== 'cancel request'){
        this.usersList[this.usersList.map((user)=>{return user.userId}).indexOf(data.senderId)].active=false;
        let i=this.requestsList.findIndex(req=>(req.senderId==data.senderId && req.receiverId==data.receiverId));
        this.requestsList.splice(i,1)
      }
      else if(data.action=='accept request'){
        this.usersList[this.usersList.map((user)=>{return user.userId}).indexOf(data.receiverId)].active=false;
        this.usersList[this.usersList.map((user)=>{return user.userId}).indexOf(data.receiverId)].friends=true;
        let i=this.requestsList.findIndex(req=>(req.senderId==data.senderId && req.receiverId==data.receiverId));
        this.requestsList.splice(i,1)
        this.friendsList.push({ 'userId': data['receiverId'], 'userName': data['receiverName'],'active':false ,'friends':true  })
      }
      else if(data.action=='decline request'){
        this.usersList[this.usersList.map((user)=>{return user.userId}).indexOf(data.receiverId)].active=false;
        let i=this.requestsList.findIndex(req=>(req.senderId==data.senderId && req.receiverId==data.receiverId));
        this.requestsList.splice(i,1)
      }else if(data.action=='remove friend'){
        this.usersList[this.usersList.map((user)=>{return user.userId}).indexOf(data.senderId)].friends=false;
        let i=this.friendsList.findIndex(f=>(f.userId==data.senderId));
        this.friendsList.splice(i,1)
      }
    })
  }
}
