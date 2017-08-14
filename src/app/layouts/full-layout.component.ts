import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CommanService } from '../shared/services/comman.service';
import { FullLayoutService } from './full-layout.service';
import { CookieService } from 'ngx-cookie';

@Component({
  selector: 'app-dashboard',
  templateUrl: './full-layout.component.html',
  providers:[CommanService]
})

export class FullLayoutComponent implements OnInit {

    public disabled: boolean           = false;
    // public status: {isopen: boolean}   = {isopen: false};
    public marketObj = {};
    public active;
    public access = {
        crops:false,
        inputs:false,
        equipments:false,
        land:false,
        users:false,
        category:false,
        manufacturer:false,
        roles:false,
        adminUsers:false,
        blogs:false,
        channelPartners:false,
        smsGroups:false,
        logisticPartners:false,
        market:false
    }

    constructor(
        private _router : Router, 
        private _route: ActivatedRoute, 
        private _cookieService: CookieService,
        private _commanService: CommanService,
        private _fullLayoutService:FullLayoutService ) { 

        this._fullLayoutService.setMarket(null);
        
        this.active = this._route.snapshot["_urlSegment"].segments[0].path;
        let actions = this._commanService.getActions();
        if(actions["type"] == 'SA') {
            for (var key in this.access) {
              if (this.access.hasOwnProperty(key)) {
                this.access[key] = true;
              }
            }
        } else {
            this.access = {
                crops:actions['crops'].view,
                inputs:actions['inputs'].view,
                equipments:actions['equipments'].view,
                land:actions['lands'].view,
                users:actions['users'].view,
                category:actions['category'].view,
                manufacturer:actions['manufacturer'].view,
                roles:actions['adminRoles'].view,
                adminUsers:actions['adminUsers'].view,
                blogs:actions['blogs'].view,
                channelPartners:actions['channelPartners'].view,
                smsGroups:actions['smsGroups'].view,
                logisticPartners:actions['logisticPartners'].view,
                market:false
            }
        }

    }

    public toggled(open: boolean): void {
      // console.log('Dropdown is now: ', open);
    }

    // public toggleDropdown($event: MouseEvent): void {
    //     $event.preventDefault();
    //     $event.stopPropagation();
    //     this.status.isopen = !this.status.isopen;
    // }

    ngOnInit(): void {
        this._fullLayoutService.markets.subscribe(res => {
          this.marketObj = res;
        });
    }

    layout(key) {
        let keyArray = key.split('-');
        let flag = keyArray.length > 1 ? keyArray[0] + keyArray[1].substring(0,1).toUpperCase() + keyArray[1].substring(1) : keyArray[0];
        if(this.access[flag]) this.applyRouter(key);
    }

    applyRouter(key) {
       this.active = key;
       let route = '/' + key + '/list';
       this._router.navigate([route]);
    }

    logout() {
        this._cookieService.removeAll();
        this._router.navigate(['/login']);
    }

    selectMarket(market) {
        this.marketObj["selectedMarket"] = market;
        this._fullLayoutService.setMarket(this.marketObj);
    }

    allMarket() {
        let pincode = [];
        let marketArray = this.marketObj["markets"];

        for (var i = 0; i < marketArray.length; i++) {
            let array = marketArray[i].pincode;
            for (var j = 0; j < array.length; ++j) {
                pincode.push(array[j]);
            }
        }

        this.marketObj["selectedMarket"] = {
           name:"All Markets",
           pincode:pincode
        }
        
        this._fullLayoutService.setMarket(this.marketObj);
    }

}
