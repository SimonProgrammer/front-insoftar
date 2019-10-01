import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders,HttpParams } from '@angular/common/http';
import { User } from './models/user.model';
import { Observable } from 'rxjs';
import { Constant } from './constant'; 

@Injectable({
  providedIn: 'root'
})
export class AppService {

  url:string;

  constructor(private http: HttpClient) { 
    this.url = Constant.API_ENDPOINT;
  }

  saveUser(user: any): Observable<any>{
    let json = JSON.stringify(user);
    // let params = user;

    let headers = new HttpHeaders({'Content-Type':'application/json'});

    let body = new HttpParams({
      fromObject : user
    })
    
     
    return this.http.post(this.url+'user/add',body);
  }

  editUser(user:any): Observable<any>{
    let json = JSON.stringify(user);
    // let params = user;

    let headers = new HttpHeaders({'Content-Type':'application/json'});

    let body = new HttpParams({
      fromObject : user
    })
    
     
    return this.http.put(this.url+'user/edit',body);
  }
}
