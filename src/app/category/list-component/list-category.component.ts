import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { CategoryService } from '../services/category.service';
import { CommanService } from '../../shared/services/comman.service';
import { CookieService } from 'ngx-cookie';
import { Angular2Csv } from 'angular2-csv/Angular2-csv';
import { FlashMessagesService } from 'ngx-flash-messages';

declare let jsPDF; 

@Component({
  selector: 'app-category',
  templateUrl: './list-category.component.html',
  styleUrls: ['./list-category.component.scss']
})
export class ListCategoryComponent implements OnInit {

    public data                  = [];
    public totalRecords          = 0;
    public filterQuery           = "";
    public rowsOnPage            = 5;
    public sortBy                = "createdAt";
    public sortOrder             = "desc";
    public activePage            = 1;
    public itemsTotal            = 0;
    public searchTerm            = '';
    public sortTrem              = '';

    public itemsOnPage;    

    public response:any;
    public isLoading:boolean     = false;
    public isPageLoading:boolean = true;
    public addEditDelete:boolean = false;

    public constructor(
        private _router: Router,
        private _categoryService: CategoryService,
        private _cookieService: CookieService,
        private _flashMessagesService: FlashMessagesService,
        private _commanService: CommanService ) { 

        let actions = this._commanService.getActions();
        if(actions["type"] == 'SA' || actions['category']['addEditDelete']) this.addEditDelete = true;
        
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
        this.getCategory();        
        this.activePage = 1;
        this.getCategory();
        
        this.itemsOnPage = this.rowsOnPage;
    }

    public toInt(num: string) {
        return +num;
    }

    public sortByWordLength = (a: any) => {
        return a.city.length;
    }

    view(ID) {
       let route = '/category/list/'+ID
       this._router.navigate([route]);       
    }

    edit(ID) {
       let route = '/category/edit/'+ID;
        this._router.navigate([route]);       
    }

    /* Function use to remove Crop with crop id */ 
    // remove( ID ) {
    //     if(confirm("Do you want to delete?")) {
    //         this.isLoading = true;
    //         this._categoryService.delete(ID).subscribe(res => {
    //             this.response  = res;
    //             this.isLoading = false;  
    //             let start       = (this.activePage * this.rowsOnPage - this.rowsOnPage + 1);
    //             this.itemsTotal = this.itemsTotal - 1;
                
    //             if( ! (this.itemsTotal >= start) ){
    //                this.activePage = this.activePage -1
    //             }
    //             this._cookieService.put('categoryAlert', 'Deleted successfully.');
    //             /* reload page. */
    //             this.getCategory();     
    //         },err => {
    //             this.isLoading = false;
    //         });  
    //     }
    // } 

    /*Get all Users */
    getCategory(): void {
        this._categoryService.getAllCategory( this.rowsOnPage, this.activePage, this.sortTrem,  this.searchTerm ).subscribe(res => {
            this.isLoading     = false;
            this.isPageLoading = false;
            if(res.success) {
                this.data          = res.data.category;
                this.itemsTotal    = res.data.total;
                this.showAlert();
            } else {
                this._commanService.checkAccessToken(res.error);
            }
        },err => {
            this.isLoading     = false;
            this.isPageLoading = false;
            this._commanService.checkAccessToken(err);
       });             
    }    

    public onPageChange(event) {
        this.isLoading     = true;
        this.rowsOnPage = event.rowsOnPage;
        this.activePage = event.activePage;
        this.getCategory();
    }

    public onRowsChange( event ): void {
        this.isLoading  = true;
        this.rowsOnPage = this.itemsOnPage;
        this.activePage = 1;
        this.getCategory();      
    }

    public onSortOrder(event) {
        this.sortTrem = this.sortBy+' '+this.sortOrder;
        this.isLoading  = true; 
        this.getCategory();
    }

    public search( event, element = 'category' ) {
        if( element == 'category' ) {
            if(event.keyCode == 13 || this.searchTerm == '') {
                this.searchTerm = this.searchTerm.trim();
                this.isLoading  = true;
                this.getCategory(); 
                this.activePage = 1;
                this.getCategory(); 
            }
        }else{
            this.searchTerm = this.searchTerm.trim();
            this.isLoading  = true;
            this.getCategory(); 
            this.activePage = 1;
            this.getCategory(); 
        }
    }

    showAlert(): void {

        let alertMessage = this._cookieService.get('categoryAlert');
        if( alertMessage ) {
            this._flashMessagesService.show( alertMessage, {
                classes: ['alert', 'alert-success'],
                timeout: 3000,
            });
            this._cookieService.remove('categoryAlert');
        }    
    } 

}
