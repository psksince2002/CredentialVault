import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Cred } from './cred'

@Injectable({
  providedIn: 'root'
})
export class CredService {

  constructor(private httpclient:HttpClient) { }

  addCred(credObj : Cred):Observable<any>{
    let username=localStorage.getItem('username');
    return this.httpclient.post('cred/addCred/'+username,credObj);
  }

  getCred():Observable<any>{
    let username=localStorage.getItem('username');
    return this.httpclient.get('cred/getCred/'+username);
  }

  deleteCred(platform:string):Observable<any>{
    let username=localStorage.getItem('username') as string;
    let str='cred/deleteCred/'+username+'/'+platform
    return this.httpclient.delete(str);
  }

  getOneCred(platform:string):Observable<any>{
    let username=localStorage.getItem('username') as string;
    let str='cred/getOneCred/'+username+'/'+platform
    return this.httpclient.get(str);
  }

  editCred(credObj:Cred):Observable<any>{
    let username=localStorage.getItem('username') as string;
    let str='cred/editCred/'+username+'/'+credObj.platform;
    return this.httpclient.put(str,credObj);
  }



}
