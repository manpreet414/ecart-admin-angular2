import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions, URLSearchParams } from '@angular/http';
// import 'rxjs/add/operator/map'
import tsConstants = require('./../../tsconstant');

@Injectable()
export class ForgotPasswordService {

 	private _host = tsConstants.HOST;
  	
  	constructor(private _http: Http) { }

	forgotPassword(emailID) {

        let headers           = new Headers();
        let email:string  	  = emailID;
        let urlSearchParams   = new URLSearchParams();
        
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        urlSearchParams.append('email', email);
        let body = urlSearchParams.toString()
		
        return this._http.post(this._host +'/forgotpassword', body, { headers: headers }).map((res:Response) => res.json())
    }

}
