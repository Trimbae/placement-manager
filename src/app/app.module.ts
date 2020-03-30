import { BrowserModule } from '@angular/platform-browser';
import {ErrorHandler, NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { LoginComponent } from './login/login.component';
import {RouterModule} from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DashboardMyTasksComponent } from './dashboard-my-tasks/dashboard-my-tasks.component';
import { DashboardProfileComponent } from './dashboard-profile/dashboard-profile.component';
import { DashboardToolsComponent } from './dashboard-tools/dashboard-tools.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { PostsComponent } from './posts/posts.component';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {PostService} from './services/post.service';
import {AppErrorHandler} from './common/app-error-handler';
import {MsalGuard, MsalInterceptor, MsalModule} from '@azure/msal-angular';

const isIE = window.navigator.userAgent.indexOf('MSIE ') > -1 || window.navigator.userAgent.indexOf('Trident/') > -1;

export const protectedResourceMap: [string, string[]][] = [
  ['https://graph.microsoft.com/v1.0/me', ['user.read']]
];


@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    LoginComponent,
    DashboardComponent,
    DashboardMyTasksComponent,
    DashboardProfileComponent,
    DashboardToolsComponent,
    PostsComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    MsalModule.forRoot({
        auth: {
          clientId: '55d3f751-f735-4fcc-91eb-66ed273ce2ec',
          authority: 'https://login.microsoftonline.com/bdb74b30-9568-4856-bdbf-06759778fcbc',
          validateAuthority: true,
          redirectUri: 'http://localhost:4200/',
          postLogoutRedirectUri: 'http://localhost:4200/',
          navigateToLoginRequestUrl: true,
        },
        cache: {
          cacheLocation: 'localStorage',
          storeAuthStateInCookie: isIE, // set to true for IE 11
        },
      },
      {
        popUp: !isIE,
        consentScopes: [
          'user.read',
          'openid',
          'profile',
          'api://a88bb933-319c-41b5-9f04-eff36d985612/access_as_user'
        ],
        unprotectedResources: ['https://www.microsoft.com/en-us/'],
        protectedResourceMap,
        extraQueryParameters: {}
      }
    ),
    ReactiveFormsModule,
    RouterModule.forRoot([
      {
        path: '',
        canActivate: [MsalGuard],
        component: DashboardComponent
      },
      {
        path: 'dashboard',
        component: DashboardComponent
      },
      {
        path: 'login',
        component: LoginComponent
      },
      {
        path: 'posts',
        component: PostsComponent
      }
    ]),
    NgbModule
  ],
  providers: [
    PostService,
    {provide: ErrorHandler, useClass: AppErrorHandler},
    {provide: HTTP_INTERCEPTORS, useClass: MsalInterceptor, multi: true}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
