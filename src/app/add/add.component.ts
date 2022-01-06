import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs'
import { ToastrService } from 'ngx-toastr';
import { FormGroup,FormControl,Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CredService } from '../cred.service'
import { Cred } from '../cred'

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css']
})
export class AddComponent implements OnInit {

  CredForm:FormGroup=new FormGroup({
    platform : new FormControl('',Validators.required),
    username : new FormControl('',Validators.required),
    password : new FormControl('',Validators.required)
  })

  constructor(private httpclient:HttpClient,private toastr: ToastrService,private router:Router,private credservice:CredService) { }

  ngOnInit(): void {
    (this.httpclient.get('cred/add') as Observable<{message: string}>).subscribe(
      res=>{
        if(res["message"]=="login"){
            this.toastr.warning('login to acsess','Not logged in')
            this.router.navigateByUrl('/login')
        }
        if(res["message"]=="session"){
            this.toastr.warning('session expired log in again','Session expired')
            this.router.navigateByUrl('/login')
        }
      }
      ,
      err=>{
        console.log("error in guarding the add route",err)
      }
    )
  }

  onSubmit(){
    this.credservice.addCred(this.CredForm.value as Cred).subscribe(
      res=>{
        if(res["message"]=="success"){
          this.toastr.success('credentials are added successfully','Success')
        }
        if(res["message"]=="existed"){
          this.toastr.error('credentials for that platform exists','Already exists')
        }
        this.router.navigateByUrl('/home');
      },
      err=>{
        console.log("error in adding credentials",err)
      }
    )
    this.CredForm.reset()
  }

  get username(){
     return this.CredForm.get('username');
  }

  get password(){
    return this.CredForm.get('password')
  }

  get platform(){
    return this.CredForm.get('platform')
  }
}
