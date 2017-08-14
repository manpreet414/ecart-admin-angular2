import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';
import { FormsModule }   from '@angular/forms';

import { AppComponent } from './app.component';
// import { DropdownModule } from 'ng2-bootstrap/dropdown';
import { TabsModule } from 'ng2-bootstrap/tabs';
import { NAV_DROPDOWN_DIRECTIVES } from './shared/nav-dropdown.directive';

import { CookieModule } from 'ngx-cookie';
import { BootstrapModalModule } from 'ng2-bootstrap-modal';

import { ActiveRouteGuard } from './auth/services/activate-route-guard';
import { DeactiveRouteGuard } from './auth/services/deactivate-route-guard';
import { ChildRouteGuard } from './auth/services/child-route-guard';
import { FullLayoutService } from './layouts/full-layout.service';

import { ChartsModule } from 'ng2-charts/ng2-charts';
import { SIDEBAR_TOGGLE_DIRECTIVES } from './shared/sidebar.directive';
import { AsideToggleDirective } from './shared/aside.directive';
import { BreadcrumbsComponent } from './shared/breadcrumb.component';
import { SubHeaderComponent } from './layouts/sub-header/sub-header.component';
import { SidebarComponent } from './layouts/sidebar/sidebar.component';
import { PaginationModule } from 'ng2-bootstrap';
// Routing Module
import { AppRoutingModule } from './app.routing';
import { HttpModule } from '@angular/http';

// Layouts
import { FullLayoutComponent } from './layouts/full-layout.component';

import { FlashMessagesModule } from 'ngx-flash-messages';


import { LoginComponent } from './auth/login/login.component';
import { CustomFormsModule } from 'ng2-validation';
import { ForgotPasswordComponent } from './auth/forgot-password/forgot-password.component';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    // DropdownModule.forRoot(),
    TabsModule.forRoot(),
    ChartsModule,
    PaginationModule.forRoot(),
    CookieModule.forRoot(),    
    HttpModule,
    CustomFormsModule,
    FlashMessagesModule,
    BootstrapModalModule
  ],
  declarations: [
    AppComponent,
    FullLayoutComponent,    
    NAV_DROPDOWN_DIRECTIVES,
    BreadcrumbsComponent,
    SubHeaderComponent,
    SidebarComponent,
    SIDEBAR_TOGGLE_DIRECTIVES,
    AsideToggleDirective,
    LoginComponent,
    ForgotPasswordComponent    
  ],
  providers: [
    {
      provide: LocationStrategy,
      useClass: HashLocationStrategy
    },
    ActiveRouteGuard,
    DeactiveRouteGuard,
    ChildRouteGuard,
    FullLayoutService
  ],
  bootstrap: [ 
    AppComponent
  ]
})
export class AppModule { }
