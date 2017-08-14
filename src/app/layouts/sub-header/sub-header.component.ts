import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'sub-header',
  templateUrl: './sub-header.component.html',
  styleUrls: ['./sub-header.component.scss']
})
export class SubHeaderComponent implements OnInit {

	@Input() active: string;
	@Input() access: object;
  	@Output() Layout = new EventEmitter<any>();  
  	
  	constructor( ) { }

	ngOnInit() {
	}

	layout( key ) {
		this.Layout.emit( key );
	}
}
