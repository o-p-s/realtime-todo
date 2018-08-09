import { Component,EventEmitter, OnInit, Output, Input} from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { SocketService } from '../../socket.service';
import { Cookie } from 'ng2-cookies';

@Component({
  selector: 'new-list',
  templateUrl: './new-list.component.html',
  styleUrls: ['./new-list.component.css']
})
export class NewListComponent implements OnInit{
  @Output() createList:EventEmitter<any>=new EventEmitter<any>();
  @Input() edit:boolean;
  @Input() lists;
  public pActive:boolean;    //flag to handle collapse state
  public editNewList:boolean;    //flag to handle edit state of the list
  public newList:any={            //structure of the new empty list
    'listName':'',
    'items':[]
  };
  constructor(private toastr:ToastrService,private socketService:SocketService) { }
  ngOnInit(){this.pActive=true;}
   /**
   * OPERATIONS FOR CREATING A NEW LIST.
   */
  public increaseItem(){console.log(this.pActive);
    (this.newList.items.length==0 && this.pActive==true)?this.pActive=true:this.pActive=false;
    let len=(this.newList.items.length)?this.newList.items.length:0;
    this.newList.items.push({
      'itemId':`itemId${len++}`,
      'itemName':'',
      'open':true,
      'subitems':[],
      'active':true
    })
  }
  public increaseSubitem(itemId){
    this.newList.items.forEach(item => {
      (item.subitems.length==0 && item.active==true)?item.active=true:item.active=false;
      if(item.itemId==itemId){
        let len=(item.subitems.length)?item.subitems.length:0;
        item.subitems.push({
          'subitemId':`${item.itemId}subId${len++}`,
          'subitemName':'',
          'open':true,
        }); 
      }
    });
  }
  public removeSubitem(data){
      this.newList.items.forEach(item => {
        if(item.itemId==data.itemId){
          let removeIndex = item.subitems.map(function(subitem) { return subitem.subitemId; }).indexOf(data.subitemId);
          item.subitems.splice(removeIndex,1)
          this.toastr.success(`Removed.`)
          return;          
        }
      }); 
  }
  public removeItem(data){
    let removeIndex = this.newList.items.map(function(item) { return item.itemId; }).indexOf(data.itemId);
    this.newList.items.splice(removeIndex,1)
    this.toastr.success(`Removed.`) 
  }
  public setEditFlag(){
    this.editNewList=true;
  }
  public checkList=()=>{
    let submissionflag=true;
    if(this.newList.listName==null || this.newList.listName=='' || this.newList.listName==undefined){
      this.toastr.error("Name of the List cannot be empty.")
        return submissionflag=false;
    }else{
      this.newList.items.forEach(item=>{
        if(item.itemName==''|| item.itemName == null|| item.itemName==undefined){
          this.toastr.error("Please fill or delete all the empty Items.")
          return submissionflag=false;
        }else{
          item.subitems.forEach(subitem => {
            if(subitem.subitemName==''|| subitem.subitemName == null|| subitem.subitemName==undefined){
              this.toastr.error(`Please fill or delete all the empty subitems under ${item.itemName}.`)
              return submissionflag=false;
            }      
          });
        }
      })

      if(this.lists!=null && this.lists!=undefined && this.lists.length!=0 ){   console.log(this.lists)   
       let returnIndex=this.lists.map(function(list){return list['listName']}).indexOf(this.newList.listName);
        if(returnIndex!=null && returnIndex!=undefined && returnIndex>0){console.log(returnIndex);
          this.toastr.error("List Name Already Exists.");
          return submissionflag=false;
        }
      }
    } return submissionflag;
  }
  public addNewList=()=>{
    let submissionflag=this.checkList();
    if(submissionflag){
      this.pActive=true;
      this.editNewList=false;           //flags 
      this.createList.emit(this.newList);      
      this.newList.listName='';
      this.newList.items=[];
    }
  }
  public deleteNewList=()=>{
    this.newList.items=[];    
    this.newList.listName='';
    this.editNewList=false;
    this.pActive=false;
  }
}
