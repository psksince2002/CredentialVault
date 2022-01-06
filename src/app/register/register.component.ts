import { Component, OnInit } from '@angular/core';
import { FormGroup,FormControl,Validators } from '@angular/forms'
import { ToastrService } from 'ngx-toastr';

import { UserService } from '../user.service';

import { User } from '../user';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  userForm :FormGroup=new FormGroup({
     username: new FormControl('',Validators.required),
     email:new FormControl('',[Validators.required,Validators.pattern("[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]),
     password:new FormControl('',Validators.required)
  });


  constructor(private userservice:UserService,private toastr: ToastrService,private router:Router) {
  }

  ngOnInit(): void {

  }

  onSubmit(){
     this.userservice.registerUser(this.userForm.value as User ).subscribe(
       res=>{
           if(res["message"]=="existed"){
            this.toastr.error('Invalid Username','Username already existed')
           }
           if(res["message"]=="success"){
             this.toastr.success("User Created","User successfully created")
             this.router.navigateByUrl('/login')
           }
       }
       ,
       err=>{
            console.log("error in insertion at register component",err)
       }
     )
     this.userForm.reset()
  }

  get username(){
      return this.userForm.get('username');
  }

  get email(){
      return this.userForm.get('email');
  }

  get password(){
    return this.userForm.get('password');
  }



}
