import { Component, OnInit} from '@angular/core';
import { Cookie} from "./../../../../node_modules/ng2-cookies";
import { ToastrService } from 'ngx-toastr';
import { SocketService } from '../../socket.service';
import Swal from 'sweetalert2';
import { ActivatedRoute, Router} from '@angular/router';
import { AppService } from '../../app.service';
import { ISubscription } from "rxjs/Subscription";
@Component({
  selector: 'app-todo-lists',
  templateUrl: './todo-lists.component.html',
  styleUrls: ['./todo-lists.component.css']
})
export class TodoListsComponent implements OnInit {
  
  public lists=[];
  public userInfo=this.appService.getUserInfoFromLocalStorage();
  private observer: ISubscription;
  private pageValue=0;
  public loaderState:boolean=false;
  private user='';
  constructor(private toastr:ToastrService,public socketService:SocketService,private route:ActivatedRoute,private appService:AppService,private router:Router) {
  
  }
  ngOnInit() {
    this.route.params.subscribe((params)=>{
      let uId=params['userId'];
      if(uId=='mylists'){
        this.user=this.userInfo.userId;
        this.pageValue=0;this.fetchLists(this.user);
      }
      else {
        if(this.userInfo.friends.map(f=> {return f}).indexOf(uId)>=0 && this.socketService.friend!=null){
          this.user=uId;
          this.pageValue=0;this.fetchLists(uId)
        }else
        this.router.navigate(['/lists','mylists'])
      }
    })  
    this.onListChanges();
  }

  ngOnDestroy(){
    this.observer.unsubscribe();
  }

  public fetchLists=(user)=>{
    let previousLists=(this.lists.length>0)?this.lists.slice():[];

    this.socketService.fetchLists(user,this.pageValue*10).subscribe((apiResponse)=>{
      if(apiResponse.status==200){
        for (let list of apiResponse.data){
          list['edit']=false;list['collapse']=false;
          if(list.items.length!=0){
            for (let item of list.items) {
              item['edit']=false;item['collapse']=false;
              if(item.subitems.length!=0){
                for (let subitem of item.subitems) {
                  subitem['edit']=false;
                }
              }
            }
          }
        }
        this.toastr.success(apiResponse.message);
        this.lists=apiResponse.data.concat(previousLists);
      }else{
        this.lists=previousLists;
      }setTimeout(() => {this.loaderState=false}, 1000); 
    },(err)=>{this.toastr.info(err.error.message);console.log(err.error.message);
      setTimeout(() => {this.loaderState=false}, 1000); 
    });
  }
  public moreLists(){
    this.loaderState=true;
    this.pageValue++;
    this.fetchLists(this.user);
  }
  public setEditFlag(flag){
    for (let list of this.lists) {
      if(list.listId==flag.list){
        Cookie.delete('listId');Cookie.delete('listName');
        Cookie.set('listId',list.listId);Cookie.set('listName',list.listName);   
        if(!list.edit)(list.collapse)?list.collapse=false:list.collapse=true;   //flag to collapse
        list.edit=true;           //flag to edit
      }
      else {
        if(Cookie.get('listId')==list.listId){
          for (let item of list.items) {
            if(item.itemId==flag.item){
              Cookie.delete('itemId');Cookie.delete('itemName');
              Cookie.set('itemId',item.itemId);Cookie.set('itemName',item.itemName);
              if(!item.edit)(item.collapse)?item.collapse=false:item.collapse=true;  //flag to collapse
              item.edit=true;           //flag to edit 
            }
            else {
              if(Cookie.get('itemId')==item.itemId){
                for(let subitem of item.subitems){
                  if(subitem.subitemId==flag.subitem){
                    Cookie.delete('subitemId');Cookie.delete('subitemName');
                    Cookie.set('subitemId',subitem.subitemId);Cookie.set('subitemName',subitem.subitemName);
                    subitem.edit=true;               //flag to edit
                  }
                }
              }
            }
          }
        }
      }
    }
  } //end setting edit flags & cookies of corresponding element in the list

  public setCookies(data){
    if(data.listId){
      Cookie.delete('listId');Cookie.delete('listName');
      Cookie.set('listId',data.listId);Cookie.set('listName',data.listName); 
      let i=this.lists.map((l)=>{return l.listId}).indexOf(data.listId);
      if(!this.lists[i].edit)
        (this.lists[i].collapse)?this.lists[i].collapse=false:this.lists[i].collapse=true;
    }
    else if(data.itemId){
      Cookie.delete('itemId');Cookie.delete('itemName');
      Cookie.set('itemId',data.itemId);Cookie.set('itemName',data.itemName)
      let l=this.lists.map((li)=>{return li.listId}).indexOf(Cookie.get('listId'));
      let i=this.lists[l].items.map((it)=>{return it.itemId}).indexOf(data.itemId)
      if(!this.lists[l].items[i].edit)
        (this.lists[l].items[i].collapse)?this.lists[l].items[i].collapse=false:this.lists[l].items[i].collapse=true
    }
    else if(data.subitemId){
      Cookie.delete('subitemId');Cookie.delete('subitemName');
      Cookie.set('subitemId',data.subitemId);Cookie.set('subitemName',data.subitemName)
    }
  } //end setting cookies on click

  public increaseElement(element){  
    let index=this.lists.map( function(list){return list.listId}).indexOf(Cookie.get('listId'));
    let data={
    'listId':Cookie.get('listId'),
    'listName':Cookie.get('listName')
    };
    if(this.socketService.friend){
      data['userId']=this.socketService.friend.userId;data['userName']=this.socketService.friend.userName;
      data['friendId']=this.userInfo.userId;data['friendName']=this.userInfo.firstName;
    }
    else 
    data['userId']=this.userInfo.userId;data['userName']=this.userInfo.userName;
   
    if(element=='item'){
      data['action']='new item';
      
    }else if(element=='subitem'){           
      data['itemId']=Cookie.get('itemId');
      data['itemName']=Cookie.get('itemName');
      data['action']='new subitem';
    } 
    this.socketService.increaseElement(data)
  }
  public decreaseElement(element){

    let data={     
      'listId':Cookie.get('listId'),
      'listName':Cookie.get('listName'),
      'itemId':Cookie.get('itemId'),
      'itemName':Cookie.get('itemName'),
      'action':'delete item'
    }
    if(this.socketService.friend){
      data['userId']=this.socketService.friend.userId;data['userName']=this.socketService.friend.userName;
      data['friendId']=this.userInfo.userId;data['friendName']=this.userInfo.firstName;
    }
    else
    data['userId']=this.userInfo.userId;data['userName']=Cookie.get('userName')

    if(element=='subitem'){           
      data['subitemId']=Cookie.get('subitemId');
      data['subitemName']=Cookie.get('subitemName');
      data['action']='delete subitem';
    }
    this.socketService.decreaseElement(data)
  }

  public saveData(flag){
    let data={};
    if(this.socketService.friend){
      data['userId']=this.socketService.friend.userId;data['userName']=this.socketService.friend.userName;
      data['friendId']=this.userInfo.userId;data['friendName']=this.userInfo.firstName;
    }
    else
      data['userId']=this.userInfo.userId;data['userName']=Cookie.get('uesrName');

    for (let list of this.lists) {
      if(list.listId==Cookie.get('listId')){
        data['listId']=list.listId; data['listName']=list.listName;  //setting changed elements
        if(flag=='list'){
          list.edit=false;list.collapse=true;
        }else{
          for (let item of list.items) {
                if(item.itemId===Cookie.get('itemId')){
                  data['itemId']=item.itemId;    //setting changed elements       
                  
                  if(flag=='itemState') data['itemOpen']=(item.open)?false:true;   
                  else if(flag=='item'){
                  data['itemName']=item.itemName; item.edit=false; item.collapse=true; 
                  }
                  else {
                    for( let subitem of item.subitems){
                      if(subitem.subitemId==Cookie.get('subitemId')){console.log('matched')
                        data['subitemId']=subitem.subitemId;      //setting change parameter                       
                        if(flag=='subitemState')data['subitemOpen']=(subitem.open)?false:true; 
                        else if(flag=='subitem')subitem.edit=false;data['subitemName']=subitem.subitemName;
                      }
                    }
                  }
                }
              }
          }

        }
      }
    
    this.socketService.sendListChange(data);
  } //end update existing data  

  public deleteList=(data)=>{
    Swal({
      title: 'Are you sure?',
      text: '',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.value) {
        Swal(
          'Deleted!',
          'List has been deleted.',
          'success'
        )
        if(this.socketService.friend){
          data['userId']=this.socketService.friend.userId;data['userName']=this.socketService.friend.userName;
          data['friendId']=this.userInfo.userId;data['friendName']=this.userInfo.firstName;
        }
        else
        data['userId']=this.userInfo.userId; data['userName']=Cookie.get('userName')    
        this.socketService.removeList(data);
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal(
          'Cancelled',
          'List is safe :)',
          'error'
        )
      }
    })
  } //end removing existing list

  public createList=(data:any)=>{
    if(this.socketService.friend!=null && this.socketService.friend!=undefined){
      data['userId']=this.socketService.friend.userId;data['userName']=this.socketService.friend.userName;
      data['friendId']=this.userInfo.userId;data['friendName']=this.userInfo.firstName;
    }
    else {
    data['userId']=this.userInfo.userId;data['userName']=this.userInfo.userName;
    }
    this.socketService.createList(data)
  } //end creating new list
  
  public onListChanges=()=>{
    this.observer=this.socketService.onListChanges().subscribe((data)=>{
      
        if(data.action=='create'){
          if(Cookie.get('userId')==data.userId){
            data['edit']=false;data['active']=false;data['collapse']=false;
              if(data.items!=null && data.items!=undefined ){
                if(data['items'].length!=0){
                  data.items.forEach(item=>{
                    item['edit']=false;item['active']=false;item['collapse']=false;
                      if(item.subitems!=null && item.subitems!=undefined){ 
                        if(item['subitems'].length!=0){
                        item.subitems.forEach(subitem=>{subitem['edit']=false;})
                        }
                      }
                  });
                }
              }
            this.lists.push(data);
          }
        }
        else if(data.action=='delete'){
          let rI=this.lists.map((list)=>{return list.listId}).indexOf(data.listId);
          this.lists.splice(rI,1);
        }
        else{
          for (let list of this.lists) {
            if(data.listId==list.listId){         
              if(data.action=='update' || data.action=='revert'){
                list.listName=data.listName;}
              if(data.action=='new item' || data.action=='add item' ){ 
                data.element['edit']=false;data.element['active']=false;data.element['collapse']=false;
                list.items.push(data.element);
                }else if(data.action=='delete item'|| data.action=='remove item'){
                  let i=list.items.map((item)=>{return item.itemId}).indexOf(data.itemId);
                  list.items.splice(i,1)
                }
              else{
                  for (let item of list.items) {
                    if(item.itemId==data.itemId){
                      if(data.action=='new subitem' || data.action=='add subitem'){
                        data.element['edit']=false;
                        item.subitems.push(data.element);
                      }
                      else if(data.action=='delete subitem' || data.action=='remove subitem')
                      item.subitems.splice(item.subitems.map((subitem)=>{return subitem.subitemId}).indexOf(data.subitemId),1)

                      else if((data.action=='update' || data.action=='revert' ) && data.itemOpen==null && data.itemOpen==undefined && data.subitemId==undefined && data.subitemId==null)
                      item.itemName=data.itemName;
                      else if((data.action=='update'|| data.action=='revert' ) && data.itemOpen!=null && data.itemOpen!=undefined && data.subitemId==undefined && data.subitemId==null)
                      item.open=data.itemOpen;
                      else if(data.action=='update' || data.action=='revert' && data.subitemId!=undefined && data.subitemId!=null){
                        let i=item.subitems.map((subitem)=>{return subitem.subitemId}).indexOf(data.subitemId)
                        item.subitems[i].subitemName=data.subitemName;
                        if(data.subitemOpen!=undefined || data.subitem!=null) item.subitems[i].open=data.subitemOpen;
                      }
                    }
                }
              }
            }
          }
        }
        if(data.message==="No more Operations to Undo.")this.toastr.info(data.message)
        else
        this.toastr.success(data.message);
      
    })
  }
    
  public getBackList:any=(event:any)=>{
    if(event.keyCode==26){
      this.undoLastOperation({'action':'userList'})
    }
  }
  
  public getBackInList:any=(event:any)=>{
    if(event.keyCode==26){
      this.undoLastOperation({'listId':Cookie.get('listId')});
    }
  }

  public undoLastOperation=(data)=>{
    if(this.socketService.friend){
      data['userId']=this.socketService.friend.userId;data['userName']=this.socketService.friend.userName;
      data['friendId']=this.userInfo.userId;data['friendName']=this.userInfo.firstName;
    }
    else
    data['userId']=this.userInfo.userId;data['userName']=Cookie.get('userName');
    this.socketService.getLastChange(data);
  }

}
