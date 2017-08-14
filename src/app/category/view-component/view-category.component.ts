import { Component } from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import { CategoryService } from '../services/category.service';
import { CookieService } from 'ngx-cookie';
import { CommanService } from '../../shared/services/comman.service';

@Component({
  templateUrl: 'view-category.component.html',
  providers: [CategoryService]
})
export class ViewCategoryComponent {

	public ID                  = '';
	public category            = {type:'' };
    public isLoading:boolean   = true;
    public addEditDelete:boolean   = false;

    constructor(
        private _router: Router, 
        private _activatedRouter: ActivatedRoute,  
        private _categoryService: CategoryService, 
        private _cookieService: CookieService,
        private _commanService: CommanService ) {

        let actions = this._commanService.getActions();
        if(actions["type"] == 'SA' || actions['category']['addEditDelete']) this.addEditDelete = true;

  	    this.ID =  _activatedRouter.snapshot.params['id'];
  	
        if( this.ID ) {
            this._categoryService.get(this.ID).subscribe( res => {
                this.isLoading = false;
                if(res.success) {
                    this.category     = res.data;
                    /*console.log(res.data.type);
                    this.category.type = this.firstUpper(this.category.type);*/
                } else {
                    this._commanService.checkAccessToken(res.error);
                }
            }, err => {
                this.isLoading = false;
                this._commanService.checkAccessToken(err);
            });
        }  

    }

   edit( ID ) {        
        let route = '/category/edit/'+ID;
        this._router.navigate([route]);       
    }   
   

}