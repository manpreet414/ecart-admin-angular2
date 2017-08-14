import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HttpModule } from '@angular/http';
// Layouts
import { FullLayoutComponent } from './layouts/full-layout.component';

import { LoginComponent } from './auth/login/login.component';
import { ForgotPasswordComponent } from './auth/forgot-password/forgot-password.component'
import { ActiveRouteGuard } from './auth/services/activate-route-guard';
import { DeactiveRouteGuard } from './auth/services/deactivate-route-guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [ActiveRouteGuard]
  },
  {
    path: 'forgot-password',
    component: ForgotPasswordComponent,
    canActivate: [ActiveRouteGuard]
  },
  {
    path: '',
    component: FullLayoutComponent,
    data: {
      title: 'Home'
    },
    canActivate: [DeactiveRouteGuard],
    children: [
      {
        path: 'dashboard',
        loadChildren: './dashboard/dashboard.module#DashboardModule'
      },
      {
        path: 'crops',
        loadChildren: './crops/crops.module#CropsModule'
      },
      {
        path: 'inputs',
        loadChildren: './inputs/inputs.module#InputsModule'  
      },
      {
        path: 'equipments',
        loadChildren: './equipments/equipments.module#EquipmentsModule'
      },
      {
        path: 'land',
        loadChildren: './land/land.module#LandModule'
      },
      {
        path: 'users',
        loadChildren: './users/users.module#UsersModule'      
      },
      {
        path: 'roles',
        loadChildren: './roles/roles.module#RolesModule'      
      },
      {
        path: 'manufacturer',
        loadChildren: './manufacturer/manufacturer.module#ManufacturerModule'      
      },
      {
        path: 'category',
        loadChildren: './category/category.module#CategoryModule'      
      },
      {
        path: 'admin-users',
        loadChildren: './admin-users/admin-users.module#AdminUsersModule'      
      },
      {
        path: 'blogs',
        loadChildren: './blogs/blogs.module#BlogsModule'
      },
      {
        path: 'channel-partners',
        loadChildren: './channel-partners/channel-partners.module#ChannelPartnersModule'      
      },
      {
        path: 'sms-groups',
        loadChildren: './sms-groups/sms-groups.module#SMSGroupsModule'      
      },
      {
        path: 'logistic-partners',
        loadChildren: './logistic-partners/logistic-partners.module#LogisticPartnersModule'      
      },
      {
        path: 'market',
        loadChildren: './market/market.module#MarketModule'      
      }
    ]
  }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes),HttpModule ],
  exports: [ RouterModule,HttpModule ]
})
export class AppRoutingModule {}
