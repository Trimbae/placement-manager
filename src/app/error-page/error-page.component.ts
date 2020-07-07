import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-error-page',
  templateUrl: './error-page.component.html',
  styleUrls: ['./error-page.component.css']
})
export class ErrorPageComponent implements OnInit {

  errorCode: string;
  loaded = false;

  constructor(private route: ActivatedRoute) { }

  // on init, get error code from query params
  ngOnInit(): void {
    this.route.queryParamMap
      .subscribe( params => {
        this.errorCode = params.get('errorCode');
        this.loaded = true;
      });
  }

}
