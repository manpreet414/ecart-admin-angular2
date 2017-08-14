import { Component, OnInit } from '@angular/core';
import { ForgotPasswordService } from './forgot-password.service';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie';

import tsMessages  = require('../../tsmessage');

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
    providers: [ForgotPasswordService]
})
export class ForgotPasswordComponent implements OnInit {

	public emailID	      = '';
	public errMessage 	  = '';
    public successMessage = '';
	public isPageLoading  = false;

	constructor(private _router : Router, private _forgotPasswordService: ForgotPasswordService, private _cookieService: CookieService) { }

	ngOnInit() {
	}

	submit() {
		this.isPageLoading     = true;
        this.errMessage        = '';        

		this._forgotPasswordService.forgotPassword(this.emailID).subscribe(res => {
            this.isPageLoading = false;
            if(res.success) {
                this.successMessage = res.data.message;    
            } else {
                this.errMessage     = res.error.message;
            }
        },err => {       
            this.isPageLoading = false;
            this.errMessage    = tsMessages.NO_SUCH_USER_EXIST;    
        });
	}
}
