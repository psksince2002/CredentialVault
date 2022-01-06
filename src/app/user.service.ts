import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from './user';
import { LogUser } from './log-user';
@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private httpclient:HttpClient) { }

  registerUser(userObj:User):Observable<any>{
     return this.httpclient.post('user/createUser',userObj);
  }

  logInUser(userObj:LogUser):Observable<any>{
    return this.httpclient.post('user/logUser',userObj);
  }





}
