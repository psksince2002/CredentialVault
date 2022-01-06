import { Injectable } from '@angular/core';
import { HttpEvent,HttpHandler,HttpInterceptor,HttpRequest } from '@angular/common/http'
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthorizationService implements HttpInterceptor  {

  constructor() { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>>{
    let token=localStorage.getItem('token') as string

    if(token){
      let cloneReqObj=req.clone({
        headers:req.headers.set('Authorization','Bearer '+token)
      })
      return next.handle(cloneReqObj)
    }
    else{
      return next.handle(req)
    }
  }
}
