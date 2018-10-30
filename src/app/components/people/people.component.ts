import { Component, OnInit } from '@angular/core';
import { UsersService } from 'src/app/services/users.service';
import _ from 'lodash';
import io from 'socket.io-client';

import { TokenService } from 'src/app/services/token.service';
import { Router } from '@angular/router';

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
  online_users = [];

  constructor(private usersService: UsersService, private tokenService: TokenService, private router: Router) {
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

  online(event) {
    this.online_users = event;
  }

  CheckIfOnline(name) {
    const result = _.indexOf(this.online_users, name);
    if (result > -1) {
      return true;
    } else {
      return false;
    }
  }

  ViewUser(user) {
    this.router.navigate([user.username]);
    if (this.loggedInUser.username !== user.username) {
      this.usersService.ProfileNotifications(user._id).subscribe(
        data => {
          this.socket.emit('refresh', {});
        },
        err => console.log(err)
      );
    }
  }

  GetUser() {
    this.usersService.GetUserById(this.loggedInUser._id).subscribe(data => {
      this.userArr = data.result.following;
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
