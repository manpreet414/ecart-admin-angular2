import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CommanService } from './services/comman.service';
import { LoaderComponent } from './loader/loader.component';
import { CapitalizePipe } from './pipes/capitalize.pipe';
@NgModule({
  imports: [
    CommonModule
  ],
  providers:[CommanService],
  declarations: [LoaderComponent,CapitalizePipe],
  exports: [LoaderComponent,CapitalizePipe]
})
export class SharedModule { }
