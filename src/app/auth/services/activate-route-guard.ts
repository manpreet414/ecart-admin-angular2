import { CanActivate } from '@angular/router';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { CookieService } from 'ngx-cookie';


@Injectable()
export class ActiveRouteGuard implements CanActivate {

    constructor(private router : Router, private _cookieService: CookieService ) { }

    canActivate() {

  	    let token = this._cookieService.get('token');
   
        if(!token) {
            return true;
        } else {
            this.router.navigate(['/dashboard']);
        }
    }
}