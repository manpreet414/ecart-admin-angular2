import { Component, OnInit } from '@angular/core';
import { LoginService } from './login.service';
import { CommanService } from '../../shared/services/comman.service';
import { Router, ActivatedRoute } from '@angular/router';
import { CookieService } from 'ngx-cookie';
import tsConstants = require('./../../tsconstant');
import tsMessages  = require('../../tsmessage');


@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    providers: [LoginService,CommanService]
})
export class LoginComponent implements OnInit {
    
    public user = {
        grant_type : tsConstants.GRANT_TYPE,
        client_id  : tsConstants.CLIENT_ID
    };

    public errMessage            = '';
    public isPageLoading:boolean = false;
    public rememberMe            = true;
    private _session             = false;

    constructor(
        private _router : Router,
        private _loginService: LoginService,
        private _commanService: CommanService,
        private _cookieService: CookieService,
        private _activateRouter: ActivatedRoute ) { 
        this._session = _activateRouter.snapshot.params['data'];
        if(this._session) {
            this.errMessage = tsMessages.YOUR_SESSION_HAS_EXPIRED_PLEASE_LOGIN_AGAIN;
        }
    }

    ngOnInit() {
        if(localStorage.getItem("remember")) {
            this.user["username"] = localStorage.getItem("remember");
        }
    }

  	login() {
        
        this.isPageLoading     = true;
        this.errMessage        = '';        

		this._loginService.login(this.user).subscribe(res => {

            this.isPageLoading = false;
            let token          = res.access_token;
            this.setMarket(res);

            let actions;
            if( res.role_id && res.role_id['permission'] ) {

                actions         = res.role_id['permission'];
                actions['type'] = res.roles;
                this.routeNavigate(token,actions);

            } else if(res.roles == 'SA') {
                
                actions = {
                    type:res.roles
                };
                this.routeNavigate(token,actions);        

            } else {
                this.errMessage = tsMessages.YOU_ARE_NOT_AUTHORIZED_PLEASE_CONTACT_MARKET_ADMIN;
            }

        },err => {       
            this.isPageLoading  = false;
            this.errMessage     = tsMessages.EMAIL_OR_PASSWORD_IS_NOT_CORRECT;
        });

	}

    setMarket(res) {
        let marketObj = {
            markets:[],
            selectedMarket: {
                name : 'All Markets',
                pincode:[]
            }
        };
        if(res.markets && res.markets.length > 0) {
            for (var i = 0; i < res.markets.length; ++i) {
                let obj = {
                    name:res.markets[i].name,
                    pincode: res.markets[i].pincode ? res.markets[i].pincode : []
                }
                for (var j = 0; j < obj.pincode.length; ++j) {
                    marketObj.selectedMarket.pincode.push(obj.pincode[j]);
                }
                marketObj.markets.push(obj);
            }
            this._cookieService.putObject('markets', marketObj );
        } else {
            this._cookieService.putObject('markets', marketObj );
        }    
    }

    routeNavigate(token, actions) {
        /* Setup Cookie */
        this._cookieService.put('token', token );
        this._cookieService.putObject('actions', actions );
        if(this.rememberMe) {
            localStorage.setItem("remember",this.user["username"]);
        } else {
             localStorage.removeItem('remember');
        }
        this._router.navigate(['/dashboard']);
    }
}
