import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CropService } from '../services/crop.service';
import { CommanService } from '../../shared/services/comman.service';
import { DialogService } from "ng2-bootstrap-modal";
import { ViewCropImageComponent } from '../../modals/view-image/viewCropImage.component';
import tsConstants = require('./../../tsconstant');

@Component({
  templateUrl: 'view-crop.component.html'
})
export class ViewCropComponent {

    private _host          = tsConstants.HOST;
    private _dateFormat    = tsConstants.DATE_FORMAT;

	public cropID          = '';
	public crop            = {};
    public isPageLoading   = true;
    public isLoading       = false;
    public addEditDelete:boolean = false;

    constructor(
        private _router: Router, 
        private _route: ActivatedRoute,
        private _cropService: CropService,
        private _commanService: CommanService,
        private _dialogService: DialogService ) { 

        let actions = this._commanService.getActions();
        if(actions["type"] == 'SA' || actions['crops']['addEditDelete']) this.addEditDelete = true;

      	this.cropID = _route.snapshot.params['id'];
  	    this._cropService.get(this.cropID).subscribe(res => {
            this.isPageLoading = false;
            if(res.success) {
                this.crop = res.data;
                this.getHighestBid();
            } else {
                this._commanService.checkAccessToken(res.error);
            }
        },err => {
            this.isPageLoading = false;
        });

    }

    editCrop(cropid) {        
        let route = '/crops/edit/'+ cropid;
        this._router.navigate([route]);       
    }

    // Use to View Image Prompt
    viewImage(imageUrl) {
        this._dialogService.addDialog(ViewCropImageComponent, {
          imageUrl:imageUrl
      }).subscribe((res)=>{ });
    }

    getHighestBid() {
        
        let bidAmounts = [];
        if( this.crop["bids"] ){
            let bids = this.crop["bids"];
            for (var i = 0; i < bids.length; ++i ) {
                bidAmounts.push(bids[i].amount);
            }                          
        }

        this.crop["highestBid"] = Math.max(...bidAmounts);
        if(this.crop["highestBid"] == "-Infinity") this.crop["highestBid"] = null;
    }

         /* Function use to verify or expire Crop with crop id*/
    changeStatus( cropID, action) {
        let message = "Do you want to " + action + " Crop?"
        if(confirm(message)) {
            this.isLoading = true;
            if(action == 'close') action = 'expire';
            this._cropService.changeStatus(cropID,action).subscribe(res => {
                this.isLoading = false;
                if(res.success) {
                    if(action == 'verify') this.crop["verified"] = 'Yes';
                    if(action == 'expire') this.crop["isExpired"] = true;
                    this._commanService.showAlert(res.data.message,'alert-success');
                } else {
                    this._commanService.showAlert(res.error.message,'alert-danger');
                }
            },err => {
                this.isLoading = false;
            });             
        }
    }

}
