import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {environment} from '../../environments/environment';
import {UserLoginRequestBody, UserLoginResponseData} from "../auth/auth.interface";


const API_USERS_URL = `${environment.apiUrl}Account`;
const GetAuthTokens = () => {
  return {
    "content-type": "application/json; charset=utf-8",
  }
}

@Injectable({
  providedIn: 'root',
})
export class ApiHandleService {
  constructor(private http: HttpClient) {
  }

  login$(loginBody: UserLoginRequestBody): Observable<UserLoginResponseData> {
    let reqHeader = new HttpHeaders({'Content-Type': 'application/json'})
    return this.http.post<UserLoginResponseData>('https://localhost:7272/api/Account/login',loginBody,{headers:reqHeader}) as Observable<UserLoginResponseData>;
  }

  signUp$(signUpRequestBody: any): Observable<string> {
    let reqHeader = new HttpHeaders({'Content-Type': 'application/json'})
    return this.http.post<string>('https://localhost:7272/api/Account/RegisterUser', signUpRequestBody,{headers:reqHeader}) as Observable<string>;
  }

  scramble$(scrambleRequestBody: any) {
    let reqHeader = new HttpHeaders({'Content-Type': 'application/json'})
    return this.http.post<any>(API_USERS_URL, scrambleRequestBody,{headers:reqHeader});
  }

  userData$(){
    let reqHeader = new HttpHeaders({'Content-Type': 'application/json'})
    return this.http.get<any>(API_USERS_URL,{headers:reqHeader});
  }

}
