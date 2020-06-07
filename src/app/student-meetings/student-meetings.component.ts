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
  // approve meeting via meetingService, on success set page notification, remove meeting from
  // array of pending meetings and add to scheduled meetings
  approveMeeting(meeting: Meeting) {
    const index = this.pendingMeetings.indexOf(meeting);
    this.meetingService.approveMeeting(meeting)
      .subscribe(() => {
        this.setNotification('Meeting Approved: ' + meeting.name, 'success');
        this.pendingMeetings.splice(index, 1);
        this.scheduledMeetings.push(meeting);
      });
  }
  // cancel meeting via meetingService, on success set page notification and remove meeting from
  // array of meetings on page
  cancelMeeting(meeting: Meeting): void {
    if (meeting.approved) {
      const index = this.scheduledMeetings.indexOf(meeting);
      this.meetingService.cancelMeeting(meeting)
        .subscribe(() => {
          this.setNotification('Meeting Cancelled: ' + meeting.name, 'warning');
          this.scheduledMeetings.splice(index, 1);
        });
    } else {
      const index = this.pendingMeetings.indexOf(meeting);
      this.meetingService.cancelMeeting(meeting)
        .subscribe(() => {
          this.setNotification('Meeting Cancelled: ' + meeting.name, 'warning');
          this.pendingMeetings.splice(index, 1);
        });
    }
  }

  clearNotifications(): void {
    this.meetingNotificationText = null;
    this.meetingNotificationText = null;
  }
  // sort meetings into two arrays based on if approved or not
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
