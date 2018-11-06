import { Component, OnInit } from '@angular/core';
import { TokenService } from 'src/app/services/token.service';
import { UsersService } from 'src/app/services/users.service';
import io from 'socket.io-client';

@Component({
  selector: 'app-following',
  templateUrl: './following.component.html',
  styleUrls: ['./following.component.css']
})
export class FollowingComponent implements OnInit {
  user: any;
  following = [];
  socket: any;

  constructor(private tokenService: TokenService, private usersService: UsersService) {
    this.socket = io('https://chatapp-longvv.herokuapp.com');
  }

  ngOnInit() {
    this.user = this.tokenService.GetPayload();
    this.GetUser();
    this.socket.on('refreshPage', () => {
      this.GetUser();
    });
  }

  GetUser() {
    this.usersService.GetUserById(this.user._id).subscribe(
      data => {
        this.following = data.result.following;
        console.log(this.following);
      },
      err => {
        console.log(err);
      }
    );
  }

  UnFollowUser(user) {
    this.usersService.UnFollowUser(user._id).subscribe(data => {
      console.log(data);
      this.socket.emit('refresh', {});
    });
  }
}
