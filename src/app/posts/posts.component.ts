import { Component, OnInit } from '@angular/core';
import {PostService} from '../services/post.service';
import {AppError} from '../common/app.error';
import {NotFoundError} from '../common/not-found.error';
import {BadRequestError} from '../common/bad-request.error';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.css']
})
export class PostsComponent implements OnInit {
  posts;

  constructor(private service: PostService) {}

  ngOnInit(): void {
    this.service.getAll()
      .subscribe(
        posts =>  this.posts = posts,
        (error: AppError) => {
          if (error instanceof NotFoundError) {
            alert('Resource not found');
          }});
  }

  createPost(input: HTMLInputElement) {
    const post: any = {title: input.value};
    input.value = '';
    this.service.create(post)
      .subscribe(
        (newPost: any) => {
          post.id = newPost.id;
          this.posts.splice(0, 0, post);
          console.log(newPost, post.id);
      }, (error: AppError) => {
          if (error instanceof BadRequestError) {
            alert('Invalid request');
          } else { throw error; }
        });
  }

  updatePost(post) {
    this.service.update(post)
      .subscribe(
        response => {
          console.log(response);
      });
  }
  deletePost(post) {
    this.service.delete(post.id)
      .subscribe(
        response => {
          console.log(response);
          const index = this.posts.indexOf(post);
          this.posts.splice(index, 1);
      }, (error: AppError) => {
          if (error instanceof NotFoundError) {
            alert('this post has already been deleted');
          } else { throw error; }
      });
  }

}
