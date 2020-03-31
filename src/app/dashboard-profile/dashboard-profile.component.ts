import {Component, Input, OnInit} from '@angular/core';
import {ImageService} from '../services/image.service';
import {environment} from '../../environments/environment';
import {SafeUrl} from '@angular/platform-browser';

@Component({
  selector: 'app-dashboard-profile',
  templateUrl: './dashboard-profile.component.html',
  styleUrls: ['./dashboard-profile.component.css']
})
export class DashboardProfileComponent implements OnInit {

  @Input() msUser: any;
  profilePhoto: SafeUrl;

  user = {
    id: 'C1525379',
    name: 'Matthew Trimby',
    placementEmployer: 'BT',
    img: './assets/img/Profile-pic-example.JPG',
    supervisor: {
      id: 1,
      name: 'Carl Jones'
    },
    workSupervisor: 'Clare Lewis',
    startDate: '09/09/2019'
  };

  photoUrl = environment.urls.MICROSOFT_API + 'me/photo/$value';

  constructor(private imageService: ImageService) {}

  ngOnInit(): void {
    this.getImageFromService();
  }

  getImageFromService() {
    this.imageService.getImage(this.photoUrl)
      .subscribe(data => {
        this.profilePhoto = this.imageService.createImageFromBlob(data);
      }, error => {
        console.log(error);
    });
  }

}
