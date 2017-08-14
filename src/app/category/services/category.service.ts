import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions, URLSearchParams } from '@angular/http';
import { CommanService } from '../../shared/services/comman.service';
import tsConstants = require('./../../tsconstant');

@Injectable()
export class CategoryService {

    private _host           = tsConstants.HOST;
  
    constructor(
        private _http: Http,
        private _commanService: CommanService ) {
    }

    /*Use to fetch all Inputs*/
  	getAllCategory(rowsOnPage, activePage, sortTrem , search = '') {
        let date =  new Date().getTime().toString();
  		let url = this._host +'/allcategory?count='+rowsOnPage+'&page='+activePage+'&sortBy='+sortTrem+'&search='+search+'&date='+date;

        let headers = this._commanService.getAuthorizationHeader();
        return this._http.get(url, { headers: headers }).map((res:Response) => res.json())
    }

    /*Use to add new Input*/
    add(category) {

        let headers = this._commanService.getAuthorizationHeader();
        return this._http.post(this._host +'/category', category, { headers: headers }).map((res:Response) => res.json())
    }
    
    /*Use to get input with input id*/
    get(ID) {

        let headers = this._commanService.getAuthorizationHeader();
        return this._http.get(this._host +'/category/'+ ID, { headers: headers }).map((res:Response) => res.json())
    }

    /*Use to update input*/
    update(category) {
        
        let headers = this._commanService.getAuthorizationHeader();
        return this._http.put(this._host +'/category/'+ category.id, category, { headers: headers }).map((res:Response) => res.json())
    }


    /*Use to Delete input with input id */
    // delete( Id ) {
        
    //     let headers = this._commanService.getAuthorizationHeader();
    //     return this._http.delete(this._host +'/category/'+ Id,  { headers: headers }).map((res:Response) => res.json());
    // }      

}
