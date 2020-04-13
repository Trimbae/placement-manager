import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FilesService {

  url = environment.urls.PLACEMENT_MANAGER_API + '/files';

  constructor(private http: HttpClient) { }

  deleteFileById(fileId: string) {
    return this.http.delete(this.url + '/' + fileId);
  }

  getFilesByTaskId(taskId: number, universityId: string) {
    return this.http.get(this.url + '/' + taskId.toString() + '/' + universityId);
  }

  uploadFile(file) {
    return this.http.post(this.url, file);
  }

}
