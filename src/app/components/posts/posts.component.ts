import { Component, OnInit } from '@angular/core';
import { PostService } from 'src/app/services/post.service';
import * as moment from 'moment';
import io from 'socket.io-client';
import _ from 'lodash';
import { TokenService } from 'src/app/services/token.service';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.css']
})
export class PostsComponent implements OnInit {
  posts = [];
  socket: any;
  user: any;

  constructor(private postService: PostService, private tokenService: TokenService) {
    this.socket = io('http://localhost:3000');
  }
  ngOnInit() {
    this.user = this.tokenService.GetPayload();
    this.AllPosts();
    this.socket.on('refreshPage', data => {
      this.AllPosts();
    });
  }

  LikePost(post) {
    this.postService.addLike(post).subscribe(
      data => {
        console.log(data);
        this.socket.emit('refresh', {});
      },
      err => console.log(err)
    );
  }

  AllPosts() {
    this.postService.getAllPosts().subscribe(data => {
      this.posts = data.posts;
      console.log(data);
    });
  }

  CheckInLikesArray(arr, username) {
    return _.some(arr, { username: username });
  }

  TimeFromNow(time) {
    return moment(time).fromNow();
  }
}
