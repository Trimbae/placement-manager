import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {map} from 'rxjs/operators';
import {Task} from '../../common/classes/task';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  url = environment.urls.PLACEMENT_MANAGER_API + '/tasks';

  constructor(private http: HttpClient) { }

  createTask(taskData) {
    return this.http.post(this.url, taskData);
  }

  deleteTaskById(taskId: string) {
    return this.http.delete(this.url + '/' + taskId);
  }

  editTask(taskData) {
    const taskId = taskData.taskId;
    return this.http.put(this.url + '/' + taskId, taskData);
  }

  getDraftTasks() {
    return this.http.get(this.url + '/drafts');
  }

  getPublishedTasks() {
    return this.http.get(this.url + '/published')
      .pipe(
        map(res => res as Task[])
      );
  }

  getTasks() {
    return this.http.get(this.url);
  }

  getTaskById(taskId: string) {
    if (taskId) {
      return this.http.get(this.url + '/' + taskId)
        .pipe(
          map(response => response as Task)
        );
    }
  }

  updateTasks(data) {
    return this.http.patch(this.url, data);
  }
}
