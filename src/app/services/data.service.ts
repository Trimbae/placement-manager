import {Inject, Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {throwError} from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import {AppError} from '../common/app.error';
import {NotFoundError} from '../common/not-found.error';
import {BadRequestError} from '../common/bad-request.error';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(@Inject(String) private url: string, private http: HttpClient) { }

  private static handleError(error: HttpErrorResponse) {
    if (error.status === 404) {
      return throwError(new NotFoundError());
    }
    if (error.status === 400) {
      return throwError(new BadRequestError());
    }
    return throwError(new AppError(error));
  }

  create(resource) {
    return this.http.post(this.url, resource)
      .pipe(

        catchError(DataService.handleError)
      );
  }

  delete(id) {
    return this.http.delete(this.url + '/' + id)
      .pipe(
        catchError(DataService.handleError)
      );
  }

  getAll() {
    return this.http.get(this.url)
      .pipe(
        map((response: any) => response),
        catchError(DataService.handleError)
      );
  }

  get(param: string) {
    return this.http.get(this.url + param)
      .pipe(
        map((response: any) => response),
        catchError(DataService.handleError)
      );
  }

  update(users) {
    return this.http.patch(this.url, users);
  }
}
