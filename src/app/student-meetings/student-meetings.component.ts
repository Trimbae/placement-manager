import {Component, Input, OnChanges} from '@angular/core';
import {Meeting} from '../common/classes/meeting';
import {MeetingService} from '../services/meeting-service/meeting.service';

@Component({
  selector: 'app-student-meetings',
  templateUrl: './student-meetings.component.html',
  styleUrls: ['./student-meetings.component.css']
})
export class StudentMeetingsComponent implements OnChanges {
  @Input() meetings: Meeting[];
  @Input() canEdit: boolean;
  meetingNotificationText: string;
  meetingNotificationType: string;
  scheduledMeetings: Meeting[] = [];
  pendingMeetings: Meeting[] = [];

  constructor(private meetingService: MeetingService) { }

  ngOnChanges(): void {
    if (this.meetings) {
      this.sortMeetings(this.meetings);
    }
  }

  approveMeeting(meeting: Meeting) {
    const index = this.pendingMeetings.indexOf(meeting);
    this.meetingService.approveMeeting(meeting)
      .subscribe(() => {
        this.setNotification('Meeting Approved: ' + meeting.name, 'success');
        this.pendingMeetings.splice(index, 1);
        this.scheduledMeetings.push(meeting);
      });
  }

  cancelMeeting(meeting: Meeting): void {
    const index = this.scheduledMeetings.indexOf(meeting);
    this.meetingService.cancelMeeting(meeting)
      .subscribe(() => {
        this.setNotification('Meeting Cancelled: ' + meeting.name, 'warning');
        this.scheduledMeetings.splice(index, 1);
      });
  }

  clearNotifications(): void {
    this.meetingNotificationText = null;
    this.meetingNotificationText = null;
  }

  sortMeetings(meetings: Meeting[]) {
    for (const meeting of meetings) {
      if (meeting.approved) {
        this.scheduledMeetings.push(meeting);
      } else {
        this.pendingMeetings.push(meeting);
      }
    }
  }

  setNotification(text: string, type: string) {
    this.meetingNotificationText = text;
    this.meetingNotificationType = type;
  }

}
