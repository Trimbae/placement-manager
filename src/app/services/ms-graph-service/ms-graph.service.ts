import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {DataService} from '../data.service';

@Injectable({
  providedIn: 'root'
})
export class MsGraphService extends DataService {

  constructor( http: HttpClient) {
    super('https://graph.microsoft.com/v1.0', http);
  }
}
