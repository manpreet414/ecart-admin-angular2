import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NG2DataTableModule } from "angular2-datatable-pagination";
import { ListCropComponent } from './list-component/list-crop.component';
import { AddUpdateCropComponent } from './addupdate-component/addupdate-crop.component';
import { ViewCropComponent } from './view-component/view-crop.component';
import { BidsCropComponent } from './bids-component/bids.component';
import { BidDetailCropComponent } from './biddetail-component/biddetail.component';
import { EditBidDetailCropComponent } from './editbid-component/editbid.component';
import { BidHistoryCropComponent } from './bidhistory-component/bidhistory.component';
import { CropsRoutingModule } from './crops-routing.module';
import { CropService } from './services/crop.service';
import { CustomFormsModule } from 'ng2-validation';
import { DatePickerModule } from 'ng2-datepicker';
import { NgxMyDatePickerModule } from 'ngx-mydatepicker';
import { SharedModule } from '../shared/shared.module';
import { BootstrapModalModule } from 'ng2-bootstrap-modal';
import { PromptCropCategoryComponent } from '../modals/promptCropCategory.component';
import { ViewCropImageComponent } from '../modals/view-image/viewCropImage.component';
import { RejectBidComponent } from '../modals/reject-bid/rejectBid.component';
import { DialogService } from "ng2-bootstrap-modal";
import { FormsModule } from '@angular/forms';
import { ImageUploadModule } from 'ng2-imageupload';

@NgModule({
  imports: [
  	CropsRoutingModule,
  	CommonModule,
    NG2DataTableModule,
    CustomFormsModule,
    DatePickerModule,
    NgxMyDatePickerModule,
    SharedModule,
    BootstrapModalModule,
    FormsModule,
    ImageUploadModule
  ],
  providers: [
  	CropService
  ],
  declarations: [
  	ListCropComponent,
  	AddUpdateCropComponent,
  	ViewCropComponent,
    BidsCropComponent,
    PromptCropCategoryComponent,
    ViewCropImageComponent,
    RejectBidComponent,
    BidDetailCropComponent,
    EditBidDetailCropComponent,
    BidHistoryCropComponent
  ],
  //Don't forget add component to entryComponents section
  entryComponents: [
    PromptCropCategoryComponent,
    ViewCropImageComponent,
    RejectBidComponent
  ],
})
export class CropsModule { }