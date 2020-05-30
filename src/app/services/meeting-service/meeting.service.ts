import { Injectable } from '@angular/core';
import {environment} from '../../../environments/environment';
import {HttpClient, HttpParams} from '@angular/common/http';
import {map} from 'rxjs/operators';
import {Meeting} from '../../common/classes/meeting';

@Injectable({
  providedIn: 'root'
})
export class MeetingService {

  private url = environment.urls.PLACEMENT_MANAGER_API + '/meetings';

  constructor(private http: HttpClient) { }

  approveMeeting(meeting: Meeting) {
    return this.http.patch(this.url + '/' + meeting._id, {approved: true});
  }

  cancelMeeting(meeting: Meeting) {
    return this.http.delete(this.url + '/' + meeting._id);
  }

  getMeetingsById(studentId, supervisorId) {
    return this.http.get(this.url, {
      params: new HttpParams()
        .set('studentId', studentId)
        .set('supervisorId', supervisorId)
    }).pipe(
      map(response => response as Meeting[])
    );
  }
  scheduleMeeting(meetingData) {
    return this.http.post(this.url, meetingData).pipe();
  }
}
