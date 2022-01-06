import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs'
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { CredService } from '../cred.service'
import { ActivatedRoute } from '@angular/router';
import { FormGroup,FormControl,Validators } from '@angular/forms';
import { Cred } from '../cred'

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit {

  constructor(private httpclient:HttpClient,private toastr: ToastrService,private router:Router,private credservice:CredService,private route: ActivatedRoute) { }

  credObj:Cred={platform:"",username:"",password:""}
  editCredForm:FormGroup=new FormGroup({
    username : new FormControl('',Validators.required),
    password : new FormControl('',Validators.required)
  })

  ngOnInit(): void {
    (this.httpclient.get('cred/edit') as Observable<{message: string}>).subscribe(
      res=>{
        if(res["message"]=="login"){
          this.toastr.warning('login to acsess','Not logged in')
          this.router.navigateByUrl('/login')
        }
        if(res["message"]=="session"){
          this.toastr.warning('session expired log in again','Session expired')
          this.router.navigateByUrl('/login')
        }
        if(res["message"]="success"){
          this.route.params.subscribe(
            params=>{
              if(params && params.platform){
                this.credservice.getOneCred(params.platform).subscribe(
                  res=>{
                    this.credObj=res["message"];
                    console.log(this.credObj)
                    this.editCredForm=new FormGroup({
                      username : new FormControl(this.credObj.username,Validators.required),
                      password : new FormControl(this.credObj.password,Validators.required)
                    })
                  }
                  ,
                  err=>{
                    console.log("error in getting credentials client side",err);
                  }
                )
              }
            }
          )

        }
      }
    )
  }


  onSubmit(){
    let editedCredObj:Cred={platform:this.credObj.platform,username:this.editCredForm.value.username,password:this.editCredForm.value.password}
    this.credservice.editCred(editedCredObj).subscribe(
      res=>{
        if(res["message"]=="success"){
          this.toastr.success('credentials are edited successfully','Success')
        }
        this.router.navigateByUrl('/home');
      }
      ,
      err=>{
        console.log("error in editing client side",err)
      }
    )
  }

  get username(){
    return this.editCredForm.get('username');
  }

 get password(){
   return this.editCredForm.get('password')
 }

}
