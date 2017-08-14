import { Injectable } from '@angular/core';
import { FlashMessagesService } from 'ngx-flash-messages';
import { CookieService } from 'ngx-cookie';
import { BehaviorSubject } from 'rxjs/Rx';

@Injectable()
export class FullLayoutService {
    public markets:BehaviorSubject<object> = new BehaviorSubject<object>({});
    constructor(
        private _cookieService: CookieService,  
        private _flashMessagesService: FlashMessagesService ) { 
    }

    showAlert(message,alertClass,alertTime) {
        window.scrollTo(0, 0);
        let obj = {
            classes: ['alert', alertClass],
            timeout: alertTime
        }
        this._flashMessagesService.show( message, obj);
    }

    setMarket(marketObj) {
        if(marketObj) {
            this.markets.next(marketObj);
        } else {
            let marketObj = this._cookieService.getObject('markets');
            this.markets.next(marketObj);
        }
    }
}
