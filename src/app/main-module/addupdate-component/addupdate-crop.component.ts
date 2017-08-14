import { Component, ChangeDetectorRef, ViewChild } from '@angular/core';
import { CropService } from '../services/crop.service';
import { CommanService } from '../../shared/services/comman.service';
import { Router, ActivatedRoute } from '@angular/router';
import { INgxMyDpOptions, IMyDateModel } from 'ngx-mydatepicker';
import { PromptCropCategoryComponent } from '../../modals/promptCropCategory.component';
import { ViewCropImageComponent } from '../../modals/view-image/viewCropImage.component';
import { DialogService } from "ng2-bootstrap-modal";
import { ImageResult } from 'ng2-imageupload';
import tsConstants = require('./../../tsconstant');
declare var jQuery:any;

@Component({
  templateUrl: 'addupdate-crop.component.html'
})
export class AddUpdateCropComponent {
    @ViewChild('myInput')
    myInputVariable: any;
    private _host = tsConstants.HOST;

	public crop = {
        terms:"Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod",
        category:'',
        variety:'',
        packaging:'',
        categoryID:'',
        sellerID:'',
        quantity:null,
        quantityUnit:'Tonnes',
        availableUnit : 'Days',
        minBidQuantity:null,
        verified: 'No',
        state:'',
        district:'',
        images:[],
        documents:[],
        availableFrom:null,
        bidEndDate:null,
        bidEarnestAmount:null,
        efarmxComission:tsConstants.EFARMX_CHARGES,
        taxRate:tsConstants.TAX_RATE

    };
    
    private myOptions: INgxMyDpOptions = {
        // other options...
        dateFormat: tsConstants.DATE_FORMAT_FOR_DATEPICKER,
        disableDateRanges:[{begin: {year: 1000, month: 11, day: 20}, end: {year: new Date().getFullYear(), month: (new Date().getMonth()+1), day: (new Date().getDate()-1)}}]

    };
    
    public isLoading       = false;
    public isPageLoading   = true;
    public category        = [];
    public sellers         = [];
    public cropID:any;

    // private quantities = tsConstants.QUANTITY_UNITS;
    public units:string = "";
    public varieties: any;
    public states: any;
    public districts: any;
    public promptMessage:string = '';
    
   constructor( private _dialogService:DialogService, 
                private _router : Router,
                private _activateRouter: ActivatedRoute, 
                private _cropService: CropService,
                private _commanService: CommanService, 
                private changeDetectorRef: ChangeDetectorRef ) { 

        this.cropID = _activateRouter.snapshot.params['id'];        
        
        if( this.cropID ) {
            this._cropService.get(this.cropID).subscribe(res => {
                if(res.success) {
                    this.crop                = res.data;
                    this.crop.availableFrom  = this._commanService.convertDateToDateObject(res.data.availableFrom);
                    this.crop.bidEndDate     = this._commanService.convertDateToDateObject(res.data.bidEndDate);
                    this.crop.categoryID     = res.data.category.id;
                    this.units               = res.data.quantity + ' ' + res.data.quantityUnit;
                    if(res.data.seller && res.data.seller.id )this.crop.sellerID = res.data.seller.id;
                } else {
                    this._commanService.checkAccessToken(res.error);
                }
                this.isPageLoading = false;
            },err => {
                this.isPageLoading = false;
            });
        } else {
            this.crop.availableFrom = this._commanService.convertDateToDateObject(new Date());
            this.crop.bidEndDate    = this._commanService.convertDateToDateObject(new Date());
            this.isPageLoading      = false;
        }
        
        /*Use to get all users*/
        this._commanService.getAllUsers('U').subscribe( res => {
             if(res.success) {
                this.sellers = res.data.users;  
            } else {
                this._commanService.checkAccessToken(res.error);    
            }
        }, err => {});

        setTimeout(()=>{
            jQuery("body #name").focus();
            /*Use to get all states*/
            this._commanService.getStates().subscribe( res => { 
                this.states = res.data;   
                if( this.cropID ) this.setDistrict();
            },err => {});
            /*Use to get all Crops categories*/
            this._commanService.getAllCategories('crops').subscribe( res => {
                 this.category = res.data; 
                if( this.cropID ) this.setVarieties();
            }, err => {});
        },1500);

    }

    // Show add category Prompt
    showPrompt() {
        this._dialogService.addDialog(PromptCropCategoryComponent, {
          title:'Add Category',
          type: 'crops',
      }).subscribe((res)=>{
            //We get dialog result            
            if( res ){
                if(res["success"]) {
                    this.category.push(res["data"]["category"]);
                    this.setCategoryInSelectBox(res["data"]["category"]);
                }
            }

        });
    }

    setCategoryInSelectBox(response){
        this.crop.categoryID =  response.id;
        this.setVarieties();
    }

     /*If cropID exist then will update existing crop otherwise will add new crop*/
    save() {
        this.isLoading         = true;
        let data               = JSON.parse(JSON.stringify(this.crop));
        data["category"]       = data["categoryID"];
        data["seller"]         = data["sellerID"];
        data["availableFrom"]  = data.availableFrom.jsdate;
        data["bidEndDate"]     = data.bidEndDate.jsdate;
        delete                   data["categoryID"];
        delete                   data["sellerID"];
        if(this.cropID) {
            this._cropService.update(data).subscribe(res => {
                this.isLoading = false;
                if(res.success) {
                    this._commanService.showAlert(res.message,'alert-success');
                    this._router.navigate(['/crops/list']);
                } else {
                    this._commanService.checkAccessToken(res.error);
                    this._commanService.showAlert(res.error.message,'alert-danger');
                }
            },err => {
                this._commanService.showAlert('There is Some Problem please try after some time.','alert-danger');
                this.isLoading = false;
            })
        } else {
      	    this._cropService.add(data).subscribe(res => {
                this.isLoading = false;
                if(res.success) {
                    this._commanService.showAlert(res.message,'alert-success');
                    this._router.navigate(['/crops/list']);
                } else {
                    this._commanService.checkAccessToken(res.error);
                    this._commanService.showAlert(res.error.message,'alert-danger');
                }
            },err => {
                this.isLoading = false;
            });
        }
    }

    /*Use to set variety get from selected on category*/
    setVarieties( ): void {  
        /* reset values. */
        this.varieties         = null;
        if( !this.cropID ){
            this.crop.variety = null;
            this.crop.variety = '';
        }
        /* Initialize category. */
        let categoryID = this.crop.categoryID;        
        if( categoryID ){
            this.category.filter(obj => obj.id == categoryID).map( obj => this.varieties = obj.variety)
        }
        
        this.changeDetectorRef.detectChanges();
    }

    /*Use to set district based on state name*/
    setDistrict( ): void {  
        /* reset values. */
        this.districts         = null;
        if( !this.cropID ){
            this.crop.district = null;
            this.crop.district = '';
        }    

        /* Initialize category. */
        let stateName = this.crop.state; 

        if( stateName ){
            this.states.filter(obj => obj.stateName == stateName).map( obj => this.districts = obj.districts)
        }
        
        this.changeDetectorRef.detectChanges();
    }

    trim(key) {
        if(this.crop[key] && this.crop[key][0] == ' ') this.crop[key] = this.crop[key].trim();
    }

    uploadImage(imageResult: ImageResult) {
        let object = {
            data:imageResult.dataURL,
            type:'crops'
        }
        this.myInputVariable.nativeElement.value = "";
        this.isLoading = true;
        this._commanService.uploadImage(object).subscribe( res => {
            this.isLoading = false;
            if(res.success) {
                this.crop.images.push(res.data.fullPath);
            } else {
                this._commanService.showAlert(res.error.message,'alert-danger');
            }
        },err => { this.isLoading = false; });
    }

    removeImage(image) {
        let index = this.crop.images.indexOf(image);
        if(index > -1) this.crop.images.splice(index,1);
    }

    // Use to View Image Prompt
    viewImage(imageUrl) {
        this._dialogService.addDialog(ViewCropImageComponent, {
          imageUrl:imageUrl
        }).subscribe((res)=>{ });
    }

    uploadDocument(imageResult: ImageResult) {
        let object = {
            data:imageResult.dataURL,
            type:'crops'
        }
        this.myInputVariable.nativeElement.value = "";
        this.isLoading = true;
        this._commanService.uploadDocument(object).subscribe( res => {
            this.isLoading = false;
            if(res.success) {
                if(!this.crop["documents"]) this.crop["documents"] = [];
                this.crop.documents.push(res.data.fullPath);
            } else {
                this._commanService.showAlert(res.error.message,'alert-danger');
            }
        },err => { this.isLoading = false; });
    }

    removeDocument(document) {
        let index = this.crop.documents.indexOf(document);
        if(index > -1) this.crop.documents.splice(index,1);
    }

    onPriceChange() {
        let price = parseFloat(this.crop["price"]);
        if(!price) price = 0;
        this.crop["bidEarnestAmount"] = (price * tsConstants.TAX_RATE)/100;
        this.crop["bidEarnestAmount"] = parseFloat(this.crop["bidEarnestAmount"]).toFixed(2);
    }

    onEarnestAmtChange() {
        let earnestAmt = parseFloat(this.crop["bidEarnestAmount"]);
        let price = parseFloat(this.crop["price"]);
        if(!price) price = 0;
        if(!earnestAmt) {
            this.crop["bidEarnestAmount"] = 0;
        } else if(earnestAmt >= price) {
          this.crop["bidEarnestAmount"] = price;     
        }
    }
    onDateChanged(event: IMyDateModel): void {
        // date selected
    }

    setQuantity():  void {
       let qtyUnit = this.units.split(' ');
       this.crop.quantity     = qtyUnit[0];
       this.crop.quantityUnit = qtyUnit[1];
   }
}
