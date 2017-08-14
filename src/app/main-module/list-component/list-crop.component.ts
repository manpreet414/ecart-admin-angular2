import { Component, OnInit } from '@angular/core';
import { CropService } from '../services/crop.service';
import { CommanService } from '../../shared/services/comman.service';
import { FullLayoutService } from '../../layouts/full-layout.service';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { Angular2Csv } from 'angular2-csv/Angular2-csv';
import tsConstants = require('./../../tsconstant');

declare let jsPDF; 

@Component({
  selector: 'app-crops',
  templateUrl: './list-crop.component.html',
  styleUrls: ['./list-crop.component.scss']
})
export class ListCropComponent implements OnInit {
    
    private _host                = tsConstants.HOST;
    private _dateFormat          = tsConstants.DATE_FORMAT;

    public data                  = [];
    public exportData            = [];
    public rowsOnPage            = 5;
    public sortBy                = "createdAt";
    public sortOrder             = "desc";
    public activePage            = 1;
    public itemsTotal            = 0;
    public searchTerm            = '';
    public sortTrem              = '';
    public itemsOnPage;    

    public isLoading:boolean     = false;
    public isPageLoading:boolean = true;
    public addEditDelete:boolean = false;
    private _selectedMarket        = [];
    private _path;
    
    public constructor(
        private _router: Router,
        private _route: ActivatedRoute, 
        private _cropService: CropService,
        private _commanService: CommanService,
        private _fullLayoutService:FullLayoutService ) { 
        this._path = this._route.snapshot["_urlSegment"].segments[0].path;

        let actions = this._commanService.getActions();
        if(actions["type"] == 'SA' || actions['crops']['addEditDelete']) this.addEditDelete = true;

        this._fullLayoutService.markets.subscribe(res => {
          this._selectedMarket = res['selectedMarket']['pincode'];
          this.isPageLoading = true;
          if(this._path == 'crops') this.getCrops();   
        });
    }

    ngOnInit(): void {
        
        this._router.events.subscribe((evt) => {
            if (!(evt instanceof NavigationEnd)) {
                return;
            }
            window.scrollTo(0, 0)
        });

        /*set initial sort condition */
        this.sortTrem = this.sortBy + ' ' + this.sortOrder;         

        /*Load data*/
        this.getCrops();        
        this.activePage = 1;

        this.itemsOnPage = this.rowsOnPage;
    }

    public toInt(num: string) {
        return +num;
    }

    public sortByWordLength = (a: any) => {
        return a.city.length;
    }

    route(cropID,path) {     
        let route = '/crops/' + path + '/' + cropID;
        this._router.navigate([route]);       
    }

    viewUser(userID,path) {     
        let route = '/users/' + path + '/' + userID;
        this._router.navigate([route]);       
    }

    /* Function use to remove Crop with crop id*/
    removeCrop( cropID ) {
        if(confirm("Do you want to delete?")) {
            this.isLoading = true;
            this._commanService.deleteRecord(cropID,'crops').subscribe(res => {
                if(res.success) {
                    let start       = (this.activePage * this.rowsOnPage - this.rowsOnPage + 1);
                    this.itemsTotal = this.itemsTotal - 1;
                    
                    if( ! (this.itemsTotal >= start) ){
                       this.activePage = this.activePage -1;
                       if(this.activePage == 0) this.activePage = 1;
                    }
                    /* reload page data */
                    this.getCrops();
                    this._commanService.showAlert(res.data.message,'alert-success');
                } else {
                    this.isLoading = false;
                    this._commanService.showAlert(res.error.message,'alert-danger');
                }
            },err => {
                this.isLoading = false;
            });             
        }
    }

    /* Function use to approve Crop with crop id*/
    changeStatus( cropID, action ) {
        if(confirm("Do you want to Approve Crop?")) {
            this.isLoading = true;
            this._cropService.changeStatus(cropID,action).subscribe(res => {
                if(res.success) {
                    let start       = (this.activePage * this.rowsOnPage - this.rowsOnPage + 1);
                    this.itemsTotal = this.itemsTotal - 1;
                    
                    if( ! (this.itemsTotal >= start) ){
                       this.activePage = this.activePage -1
                    }
                    if(this.activePage == 0) this.activePage = 1;
                    /* reload page. */
                    this.getCrops();
                    this._commanService.showAlert(res.data.message,'alert-success');
                } else {
                    this.isLoading = true;
                    this._commanService.showAlert(res.error.message,'alert-danger');
                }
            },err => {
                this.isLoading = false;
            });             
        }
    } 
 

    /*Get all Crops*/
    getCrops(): void {   
        this._cropService.getAllCrops( this.rowsOnPage, this.activePage, this.sortTrem,  this.searchTerm, this._selectedMarket ).subscribe(res => {
            this.isLoading     = false;
            this.isPageLoading = false;
            if(res.success) {
                this.data          = res.data.crops;
                this.itemsTotal    = res.data.total;
                this.getHighestBid('data');
            } else {
                this._commanService.checkAccessToken(res.error);   
            }
        },err => {
            this.isLoading     = false;
            this.isPageLoading = false;
       });
    }

    public onPageChange(event) {
        this.isLoading     = true;
        this.rowsOnPage = event.rowsOnPage;
        this.activePage = event.activePage;
        this.getCrops();
    }

    public onRowsChange( event ): void {
        this.isLoading  = true;
        this.rowsOnPage = this.itemsOnPage;
        this.activePage = 1;
        this.getCrops();      
    }

    public onSortOrder(event) {
        this.sortTrem = this.sortBy+' '+this.sortOrder;
        this.isLoading  = true; 
        this.getCrops();
    }

    public search( event, element = 'input' ) {
        if( element == 'input' ) {
            if(event.keyCode == 13 || this.searchTerm == '') {
                this.searchTerm = this.searchTerm.trim();
                this.isLoading  = true;
                this.getCrops(); 
                this.activePage = 1;
                this.getCrops(); 
            }
        }else{
            this.searchTerm = this.searchTerm.trim();
            this.isLoading  = true;
            this.getCrops(); 
            this.activePage = 1;
            this.getCrops(); 
        }
    }

    /*Get all Crops fro export*/
    export(key) {   
        this.isLoading         = true;
        this._cropService.getAllCrops( this.itemsTotal, 1, this.sortTrem,  this.searchTerm ).subscribe(res => {
            this.isLoading     = false;
            this.isPageLoading = false;
            if(res.success) {
                this.exportData    = res.data.crops;
                this.getHighestBid('exportData');
                if(key == 'CSV') this.downloadCSV();
                if(key == 'PDF') this.downloadPDF();
            } else {
                this._commanService.checkAccessToken(res.error);   
            }
        },err => {
            this.isLoading     = false;
            this.isPageLoading = false;
       });
    }

    downloadCSV(): void {
        let i;
        let filteredData = [];
        
        let header = {
            code:"Crop ID",
            name:"Crop Name",
            category:'Category',
            price:'Offer Price',
            quantity:'Qty.',
            totalBids:"Total Bids",
            highestBid:'Highest Bid',
            seller:'Seller'
        }

        filteredData.push(header);

        for ( i = 0; i < this.exportData.length ; i++ ) {
            // let _availableDate = new Date(this.exportData[i].availableFrom); 
            // let availableDate = _availableDate ? _availableDate.getDate() + '/' + (_availableDate.getMonth() +1) + '/' + _availableDate.getFullYear() : '-';
            let temp = {
                code:this.exportData[i].code,
                name: this.exportData[i].name,
                category: this.exportData[i].category,
                price: this.exportData[i].price,
                quantity: this.exportData[i].quantity + ' ' + this.exportData[i].quantityUnit,
                totalBids: this.exportData[i].bids ? this.exportData[i].bids.length : 0,
                highestBid: this.exportData[i].highestBid ? this.exportData[i].highestBid : 0,
                seller: this.exportData[i].seller + ' (' +this.exportData[i].sellerMobile+ ')'
            };

            filteredData.push(temp);
        }       

        let fileName = "CropsReport-"+Math.floor(Date.now() / 1000); 
        new Angular2Csv( filteredData, fileName);
    }

    downloadPDF() {
        
        let i;
        let filteredData = [];

        let header = [
            "Crop ID",
            "Crop Name",
            "Category",
            "Offer Price",
            "Qty.",
            "Total Bids",
            "Highest Bid",
            "Seller"
        ]   

        for ( i = 0; i < this.exportData.length ; i++ ) { 
            // let _availableDate = new Date(this.exportData[i].availableFrom); 
            // let availableDate = _availableDate ? _availableDate.getDate() + '/' + (_availableDate.getMonth() +1) + '/' + _availableDate.getFullYear() : '-';
            let temp = [
                this.exportData[i].code,
                this.exportData[i].name,                
                this.exportData[i].category,
                this.exportData[i].price,
                this.exportData[i].quantity + ' ' + this.exportData[i].quantityUnit,
                this.exportData[i].bids ? this.exportData[i].bids.length : 0,
                this.exportData[i].highestBid ? this.exportData[i].highestBid : 0,
                this.exportData[i].seller +' (' + this.exportData[i].sellerMobile +')'
            ];

            filteredData.push(temp);
        }       

        let fileName = "CropsReport-"+Math.floor(Date.now() / 1000); 

        var doc = new jsPDF();    

        doc.autoTable(header, filteredData,  {
            theme: 'grid',
            headerStyles: {fillColor: 0},
            startY: 10, // false (indicates margin top value) or a number 
            margin: {horizontal: 7}, // a number, array or object 
            pageBreak: 'auto', // 'auto', 'avoid' or 'always' 
            tableWidth: 'wrap', // 'auto', 'wrap' or a number,  
            tableHeight: '1', // 'auto', 'wrap' or a number,  
            showHeader: 'everyPage',
            tableLineColor: 200, // number, array (see color section below) 
            tableLineWidth: 0,
            fontSize: 10,
            overflow : 'linebreak',
            columnWidth : 'auto',
            cellPadding : 2,       
            cellSpacing : 0,       
            valign : 'top',
            lineHeight: 15, 

        });

        doc.save(fileName);
    }

    getHighestBid(key) {
        for(var j = 0; j < this[key].length; ++j) {
            let bidAmounts = [];
            if( this[key][j].bids ){
                for (var i = 0; i < this[key][j].bids.length; ++i ) {
                    bidAmounts.push(this[key][j].bids[i].amount);
                }                          
            }

            this[key][j]["highestBid"] = Math.max(...bidAmounts);
            if(this[key][j]["highestBid"] == "-Infinity" 
                || this[key][j]["highestBid"] == NaN 
                || this[key][j]["highestBid"] == "NaN" 
                || !this[key][j]["highestBid"]) {
                this[key][j]["highestBid"] = 0;      
            }
        }
    }
}
