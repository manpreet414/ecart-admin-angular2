import { Component, OnInit, Input } from '@angular/core';
import { ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';


@Component({
	selector: 'app-loader',
	templateUrl: './loader.component.html',
	styleUrls: ['./loader.component.css'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoaderComponent implements OnInit {

	@Input() isLoading: boolean = false;
	constructor() { }

	ngOnInit() {
	}

}
