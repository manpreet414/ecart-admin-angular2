import { Component, ChangeDetectorRef } from '@angular/core';
import { CategoryService } from '../services/category.service';
import { Router, ActivatedRoute } from '@angular/router';
import { CookieService } from 'ngx-cookie';
import { CommanService } from '../../shared/services/comman.service';
import { FlashMessagesService } from 'ngx-flash-messages';

import tsMessages  = require('../../tsmessage');

@Component({
  templateUrl: 'addupdate-category.component.html'
})
export class AddUpdateCategoryComponent {
    public category     = {
        name:'',
        type:'',
        variety: []
    };

    public isLoading       = false;
    public isPageLoading   = true;
    public categoryID: any;
    public oBj = {vname: ''};
    public response:any;
    public type;
    public errMessage = '';
    


    constructor(
        private _router : Router,
        private _activateRouter: ActivatedRoute, 
        private _catgService: CategoryService, 
        private _flashMessagesService: FlashMessagesService, 
        private _cookieService: CookieService,
        private _commanService: CommanService,
        private changeDetectorRef: ChangeDetectorRef ) {

        this.categoryID = _activateRouter.snapshot.params['id'];        

        if( this.categoryID ) {
            this._catgService.get(this.categoryID).subscribe( res => {
                this.isPageLoading = false;
                if(res.success) {
                    this.category = res.data;
                   } else {
                    this._commanService.checkAccessToken(res.error);
                }
            }, err => {
                this.isPageLoading = false;
                this._commanService.checkAccessToken(err);
            });
        } else {
            this.isPageLoading = false;
        }


    }

      ngOnInit(): void {

          this.showDangerAlert();
      }

    /*If categoryID exist then will update existing category otherwise will add new category*/
    save() {

        this.isLoading = true;
        if(this.categoryID) {
            this._catgService.update(this.category).subscribe(res => {
                this.isLoading         = false;
                if(res.success) {
                    this.response          = res;
                    this._cookieService.put('categoryAlert', res.data.message);
                    this._router.navigate(['/category/list']);
                } else {
                    this._cookieService.put('categoryExistAlert',res.error.message);
                    this.showDangerAlert();
                }
            },err => {
                this.isLoading = false;
            })
        } else {
            this._catgService.add(this.category).subscribe(res => {
                this.isLoading         = false;
                if(res.success) {
                    this.response          = res;
                    this._cookieService.put('categoryAlert', res.data.message);
                    this._router.navigate(['/category/list']);
                } else {
                    this._cookieService.put('categoryExistAlert',res.error.message);
                    this.showDangerAlert();
                }
            },err => {
                this.isLoading = false;
            });
            
        }
    }

    addEelement(){
     this.oBj.vname = this.oBj.vname.trim();
     if(!this.oBj.vname){
         this.errMessage = tsMessages.VARIETY_IS_REQUIRED;
         return false;
     }
        let index = this.category.variety.indexOf(this.oBj.vname);

        if(index >=0 ) {
            
           this.errMessage = tsMessages.ALREADY_EXISTS;
           return false;
           
                } else {

                    this.category.variety.push(this.oBj.vname);
                    this.oBj.vname = "";
                    this.errMessage = "" ;
                    return true;

                }      
    }

    removeEelement(index){
        this.category.variety.splice(index,1);
    }

    showDangerAlert(): void {

        let alertMessage = this._cookieService.get('categoryExistAlert');
        if( alertMessage ) {
            this._flashMessagesService.show( alertMessage, {
                classes: ['alert', 'alert-danger'],
                timeout: 3000,
            });
            this._cookieService.remove('categoryExistAlert');
        }    
    }

    trim(key) {
        if(this.category[key] && this.category[key][0] == ' ') this.category[key] = this.category[key].trim();
    }

    checkType() {
        if(this.category.type == "blogs") this.category.variety = [];
    }



}
