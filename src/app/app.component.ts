import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Placement Manager';
  tweet = {
    body: 'Here is the body of the tweet',
    isLiked: false,
    likeCount: 0
  };
}
