import { Component, OnInit } from '@angular/core';
import { UsersService } from 'src/app/services/users.service';
import _ from 'lodash';
import io from 'socket.io-client';

import { TokenService } from 'src/app/services/token.service';

@Component({
  selector: 'app-people',
  templateUrl: './people.component.html',
  styleUrls: ['./people.component.css']
})
export class PeopleComponent implements OnInit {
  users = [];
  loggedInUser: any;
  userArr = [];
  socket: any;

  constructor(private usersService: UsersService, private tokenService: TokenService) {
    this.socket = io('http://localhost:3000');
  }

  ngOnInit() {
    this.loggedInUser = this.tokenService.GetPayload();
    this.GetUsers();
    this.GetUser();

    this.socket.on('refreshPage', () => {
      this.GetUsers();
      this.GetUser();
    });
  }

  GetUsers() {
    this.usersService.GetAllUsers().subscribe(data => {
      console.log(data);
      _.remove(data.result, { username: this.loggedInUser.username });
      this.users = data.result;
    });
  }

  GetUser() {
    this.usersService.GetUserById(this.loggedInUser._id).subscribe(data => {
      this.userArr = data.result.following;
      console.log(data);
    });
  }

  FollowUser(user) {
    console.log(user);
    this.usersService.FollowUser(user._id).subscribe(data => {
      // this.userArr = data.result.following;
      this.socket.emit('refresh', {});
    });
  }

  CheckInArray(arr, id) {
    const result = _.find(arr, ['userFollowed._id', id]);
    if (result) {
      return true;
    } else {
      return false;
    }
  }
}
