import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  url = environment.urls.PLACEMENT_MANAGER_API + '/users';

  constructor(private http: HttpClient) { }

  getAllUsers() {
    return this.http.get(this.url);
  }

  getCurrentUser() {
    return this.http.get(this.url + '/me');
  }

  markTaskCompleteForUser(universityId, task) {
    return this.http.patch(this.url + '/' + universityId + '/tasks', {taskId: task});
  }
}
