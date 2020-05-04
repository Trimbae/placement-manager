import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {DomSanitizer} from '@angular/platform-browser';


@Injectable({
  providedIn: 'root'
})
export class ImageService {

  constructor(private http: HttpClient, private sanitizer: DomSanitizer) { }

  createImageFromBlob(image: Blob) {
    const imageUrl = URL.createObjectURL(image);

    return this.sanitizer.bypassSecurityTrustUrl(imageUrl);
  }

  getImage(imageUrl: string): Observable<Blob> {
    return this.http.get(imageUrl, { responseType: 'blob' });
  }
}
// https://stackoverflow.com/a/45630579
