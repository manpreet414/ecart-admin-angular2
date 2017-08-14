import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions, URLSearchParams } from '@angular/http';
import { CommanService } from '../../shared/services/comman.service';
import tsConstants = require('./../../tsconstant');
@Injectable()
export class CropService {

    private _host = tsConstants.HOST;

    constructor(
        private _http: Http,
        private _commanService: CommanService ) { 
    }

    /*Use to fetch all crops*/
  	getAllCrops(rowsOnPage, activePage, sortTrem , search = '',markets = []) {

        let date =  new Date().getTime().toString();
        let marketStr = JSON.stringify(markets);
        let url = this._host +'/admin/crops?count='+rowsOnPage+'&page='+activePage+'&sortBy='+sortTrem+'&search='+search+'&markets='+marketStr+'&date='+date;
        let headers = this._commanService.getAuthorizationHeader();
		return this._http.get(url, { headers: headers }).map((res:Response) => res.json())
    }

    /*Use to add new crop*/
    add(crop) {

        let headers = this._commanService.getAuthorizationHeader();
        return this._http.post(this._host +'/crops/add/', crop, { headers: headers }).map((res:Response) => res.json())
    }

    /*Use to get crop with crop id*/
    get(cropID) {
        
        let headers = this._commanService.getAuthorizationHeader();
        return this._http.get(this._host +'/crops/'+ cropID, { headers: headers }).map((res:Response) => res.json())
    }

    /*Use to update crop*/
    update(crop) {

        let headers = this._commanService.getAuthorizationHeader();
        return this._http.put(this._host +'/crops/edit/'+ crop.id, crop, { headers: headers }).map((res:Response) => res.json())
    }

    /*Use to updateBid*/
    updateBid(obj) {
        let id = obj.id;
        delete obj.id;
        let headers = this._commanService.getAuthorizationHeader();
        return this._http.put(this._host + '/bids/place/'+id, obj, { headers: headers }).map((res:Response) => res.json())
    }

    /*Use to verify, approve or expire crop*/
    changeStatus(cropID, action) {

        let headers = this._commanService.getAuthorizationHeader();
        let url = this._host + '/crops/' + action + '/' + cropID;
        return this._http.get(url, { headers: headers }).map((res:Response) => res.json())
    }

    /*Use to get bid with bid id*/
    getBidDetail(bidID) {
        
        let headers = this._commanService.getAuthorizationHeader();
        return this._http.get(this._host +'/bid/'+ bidID, { headers: headers }).map((res:Response) => res.json())
    }

    /*Use to get bid History with bid id*/
    bidHistory(bidID) {
        
        let headers = this._commanService.getAuthorizationHeader();
        return this._http.get(this._host +'/bid/history/'+ bidID, { headers: headers }).map((res:Response) => res.json())
    }

}
