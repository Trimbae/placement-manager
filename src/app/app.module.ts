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
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {UserService} from './services/user-service/user.service';
import {AppErrorHandler} from './common/app-error-handler';
import {MsalGuard, MsalInterceptor, MsalModule} from '@azure/msal-angular';
import { ModalProfileComponent } from './modal-profile/modal-profile.component';

// imports for file upload plugin
import { FileUploadComponent } from './file-upload/file-upload.component';
import { FilePondModule, registerPlugin } from 'ngx-filepond';
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import FilePondPluginFilePoster from 'filepond-plugin-file-poster';
import FilePondPluginFileEncode from 'filepond-plugin-file-encode';

import { SubmissionComponent } from './submission/submission.component';
import { PdfViewerComponent } from './pdf-viewer/pdf-viewer.component';
import { LoadingSpinnerComponent } from './common/loading-spinner/loading-spinner.component';
import { ModalDeleteComponent } from './modal-delete/modal-delete.component';
import { CreateTaskComponent } from './create-task/create-task.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatNativeDateModule} from '@angular/material/core';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatCardModule} from '@angular/material/card';
import { ViewTasksComponent } from './view-tasks/view-tasks.component';
import {DragDropModule} from '@angular/cdk/drag-drop';
registerPlugin(FilePondPluginFileValidateType, FilePondPluginImagePreview, FilePondPluginFilePoster, FilePondPluginFileEncode);


const isIE = window.navigator.userAgent.indexOf('MSIE ') > -1 || window.navigator.userAgent.indexOf('Trident/') > -1;

export const protectedResourceMap: [string, string[]][] = [
  ['https://graph.microsoft.com/v1.0/me', ['user.read']],
  ['http://localhost:3000/user', ['user.read']]
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
    ModalProfileComponent,
    FileUploadComponent,
    SubmissionComponent,
    PdfViewerComponent,
    LoadingSpinnerComponent,
    ModalDeleteComponent,
    CreateTaskComponent,
    ViewTasksComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    FilePondModule,
    HttpClientModule,
    MatDatepickerModule,
    MatNativeDateModule,
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
        path: 'edit/:taskId/:taskName',
        component: CreateTaskComponent
      },
      {
        path: 'login',
        component: LoginComponent
      },
      {
        path: 'tasks/upload/:userId/:taskId/:taskName',
        component: FileUploadComponent
      },
      {
        path: 'tasks/create',
        component: CreateTaskComponent
      },
      {
        path: 'tasks/submitted/:userId/:taskId/:taskName',
        component: SubmissionComponent
      },
      {
        path: 'tasks/view',
        component: ViewTasksComponent
      }
    ]),
    NgbModule,
    BrowserAnimationsModule,
    MatInputModule,
    MatSelectModule,
    MatCardModule,
    DragDropModule
  ],
  providers: [
    UserService,
    {provide: ErrorHandler, useClass: AppErrorHandler},
    {provide: HTTP_INTERCEPTORS, useClass: MsalInterceptor, multi: true}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
