import { Component, OnInit } from '@angular/core';
import {FormGroup,FormControl,Validators} from '@angular/forms';

import { ToastrService } from 'ngx-toastr';

import { UserService } from '../user.service';

import { LogUser } from '../log-user';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  userLoginForm :FormGroup=new FormGroup({
    username: new FormControl('',Validators.required),
    password:new FormControl('',Validators.required)
 });

  constructor(private userservice:UserService,private toastr: ToastrService,private router:Router) { }

  ngOnInit(): void {
  }

  onSubmit(){
    this.userservice.logInUser(this.userLoginForm.value as LogUser).subscribe(
      res=>{
        if(res["message"]=="no username"){
          this.toastr.error('Entered username doesnt exist','No Username')
        }
        if(res["message"]=="invalid password"){
          this.toastr.error('Entered Password is not correct','Wrong Password');
        }
        if(res["message"]=="success"){
          let signedToken=res["jwt"];
          let username=res["username"];
          localStorage.setItem('token',signedToken);
          localStorage.setItem('username',username);
          this.toastr.success("Successfully logged in","Success");
          this.router.navigateByUrl('/home');
        }
      }
      ,
      err=>{

      }
    )
    this.userLoginForm.reset();
  }

  get username(){
    return this.userLoginForm.get('username');
 }

 get password(){
  return this.userLoginForm.get('password');
 }

}
