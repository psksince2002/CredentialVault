import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs'
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { CredService } from '../cred.service'
import { Cred } from '../cred'

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  username:string="";
  credArray:Array<Cred>=[]

  constructor(private httpclient:HttpClient,private toastr: ToastrService,private router:Router,private credservice:CredService) {
  }

  ngOnInit(): void {
     (this.httpclient.get('cred/home') as Observable<{message: string}>).subscribe(
       res=>{
         if(res["message"]=="login"){
             this.toastr.warning('login to acsess','Not logged in')
             this.router.navigateByUrl('/login')
         }
         if(res["message"]=="session"){
             this.toastr.warning('session expired log in again','Session expired')
             this.router.navigateByUrl('/login')
         }
         if(res["message"]=="success"){
            this.username=localStorage.getItem('username') as string;
            this.credservice.getCred().subscribe(
              res=>{
                 this.credArray=res["message"]
              }
              ,
              err=>{
                console.log("error in getting credentials",err)
              }
            )
         }
       }
       ,
       err=>{
         console.log("error in guarding the home roor",err)
       }
     )
  }

  addClick(){
    this.router.navigateByUrl('/add');
  }

  platformFun(str:string){
    if(str=='1'){
      return "Facebook"
    }
    else if(str=='2'){
      return "Instagram"
    }
    else if(str=='3'){
      return "Reddit"
    }
    else if(str=='4'){
      return "Twitter"
    }
    else{
      return "Linkedin"
    }
  }

  onDelete(obj:Cred){
    this.credservice.deleteCred(obj.platform).subscribe(
      res=>{
        this.toastr.success('Credential successfully deleted','Deleted')
        window.location.reload()
      },
      err=>{
        console.log("error in deleting a credential client side",err)
      }
    )
  }

}
