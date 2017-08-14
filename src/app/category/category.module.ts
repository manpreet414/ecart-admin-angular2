import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NG2DataTableModule } from "angular2-datatable-pagination";
import { CategoryService } from './services/category.service';
import { SharedModule } from '../shared/shared.module';
import { ListCategoryComponent } from './list-component/list-category.component';
import { AddUpdateCategoryComponent } from './addupdate-component/addupdate-category.component';
import { ViewCategoryComponent } from './view-component/view-category.component';
import { CategoryRoutingModule } from './category-routing.module';
import { CustomFormsModule } from 'ng2-validation';
import { DatePickerModule } from 'ng2-datepicker';
import { FlashMessagesModule } from 'ngx-flash-messages';

@NgModule({
  imports: [
  	CategoryRoutingModule,
  	 CommonModule,
     NG2DataTableModule,
     CustomFormsModule,
     FlashMessagesModule,
     SharedModule
  ],
  providers: [
    CategoryService
  ],
  declarations: [
  	ListCategoryComponent,
  	AddUpdateCategoryComponent,
  	ViewCategoryComponent
  ]
})
export class CategoryModule { }