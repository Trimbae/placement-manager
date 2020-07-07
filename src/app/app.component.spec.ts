import { TestBed, async } from '@angular/core/testing';
import { AppComponent } from './app.component';
import {BroadcastService, MSAL_CONFIG, MSAL_CONFIG_ANGULAR, MsalService} from '@azure/msal-angular';
import {RouterTestingModule} from '@angular/router/testing';

describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent
      ],
      imports: [
        RouterTestingModule
      ],
      providers: [
        BroadcastService,
        MsalService,
        {provide: MSAL_CONFIG, useValue: {}},
        {provide: MSAL_CONFIG_ANGULAR, useValue: {}}
      ]
    }).compileComponents();
  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title 'Placement Manager'`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('Placement Manager');
  });
});
