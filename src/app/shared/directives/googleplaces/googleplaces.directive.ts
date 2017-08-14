import {Directive, ElementRef, EventEmitter, Output} from '@angular/core';
import {NgModel} from '@angular/forms';
import {Address} from './model/google_place';

declare var google:any;

@Directive({
  selector: '[googleplace]',
  providers: [NgModel],
  host: {
    '(input)' : 'onInputChange($event)'
  }
})
export class GoogleplaceDirective  {
  @Output() setAddress: EventEmitter<any>        = new EventEmitter();
  @Output() adr_address: EventEmitter<any>       = new EventEmitter();
  @Output() place_id: EventEmitter<any>          = new EventEmitter();
  @Output() formatted_address: EventEmitter<any> = new EventEmitter();

  modelValue:any;
  autocomplete:any;
  private _el:HTMLElement;
  place:Address;

  constructor(el: ElementRef, private model:NgModel) {
    this._el = el.nativeElement;
    this.modelValue = this.model;
    var input = this._el;
    this.autocomplete = new google.maps.places.Autocomplete(input, {});
    google.maps.event.addListener(this.autocomplete, 'place_changed', ()=> {
      /* if(input.dataset.location == 'name') {
       (<HTMLInputElement>input).value=(<HTMLInputElement>input).value.split(',')[0];
       }
       else if(input.dataset.location == 'address') {
       // Keep full formatted address
       }*/
      (<HTMLInputElement>input).value=(<HTMLInputElement>input).value.split(',')[0];
      this.place = this.autocomplete.getPlace();
      if (this.place && this.place.place_id){
        this.invokeEvent();
      }
    });
  }

  //invokeEvent(place:Object) {
  invokeEvent() {
    this.setAddress.emit(this.place);
    this.adr_address.emit(this.place.adr_address ? this.place.adr_address : null);
    this.formatted_address.emit(this.place.formatted_address ? (this.place.formatted_address) : null);
  }

  onInputChange() {

  }
}