import { Component, OnInit } from '@angular/core';
import { PostService } from 'src/app/services/post.service';
import * as moment from 'moment';
@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.css']
})
export class PostsComponent implements OnInit {
  constructor(private postService: PostService) {}
  posts = [];
  ngOnInit() {
    this.AllPost();
  }

  AllPost() {
    this.postService.getAllPosts().subscribe(data => {
      this.posts = data.posts;
      console.log(data);
    });
  }

  TimeFromNow(time) {
    return moment(time).fromNow();
  }
}
