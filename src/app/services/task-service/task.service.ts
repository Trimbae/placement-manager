import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  url = environment.urls.PLACEMENT_MANAGER_API + '/tasks';

  constructor(private http: HttpClient) { }

  createTask(taskData) {
    return this.http.post(this.url, taskData);
  }

  editTask(taskData) {
    const id = taskData.taskId;
    return this.http.put(this.url + '/' + id, taskData);
  }

  getDraftTasks() {
    return this.http.get(this.url + '/drafts');
  }
  getPublishedTasks() {
    return this.http.get(this.url + '/published');
  }

  getTasks() {
    return this.http.get(this.url);
  }

  getTaskById(id: number) {
    if (id) {
      return this.http.get(this.url + '/' + id);
    }
  }

  updateTasks(data) {
    return this.http.patch(this.url, data);
  }
}