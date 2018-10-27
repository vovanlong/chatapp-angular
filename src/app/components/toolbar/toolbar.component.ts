import { Component, OnInit, AfterViewInit, Output, EventEmitter } from '@angular/core';
import { TokenService } from 'src/app/services/token.service';
import { Router } from '@angular/router';
import * as M from 'materialize-css';
import { UsersService } from 'src/app/services/users.service';
import * as moment from 'moment';
import io from 'socket.io-client';
import _ from 'lodash';
import { MessageService } from 'src/app/services/message.service';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent implements OnInit, AfterViewInit {
  @Output()
  onlineUsers = new EventEmitter();
  user: any;
  socket: any;
  notifications = [];
  count = [];
  chatList = [];
  msgNumber = 0;

  constructor(
    private tokenService: TokenService,
    private router: Router,
    private usersService: UsersService,
    private msgService: MessageService
  ) {
    this.socket = io('http://localhost:3000');
  }

  ngOnInit() {
    this.user = this.tokenService.GetPayload();
    const dropdownElement = document.querySelectorAll('.dropdown-trigger');
    M.Dropdown.init(dropdownElement, {
      alignment: 'right',
      hover: true,
      coverTrigger: false
    });

    const dropdownElementTwo = document.querySelectorAll('.dropdown-trigger1');
    M.Dropdown.init(dropdownElementTwo, {
      alignment: 'right',
      hover: true,
      coverTrigger: false
    });

    this.socket.emit('online', { room: 'global', user: this.user.username });

    this.GetUser();
    this.socket.on('refreshPage', () => {
      this.GetUser();
    });
  }
  ngAfterViewInit() {
    this.socket.on('usersOnline', data => {
      this.onlineUsers.emit(data);
    });
  }
  ChecIfRead(arr) {
    const checkArr = [];
    for (let i = 0; i < arr.length; i++) {
      const receiver = arr[i].msgId.message[arr[i].msgId.message.length - 1];
      if (this.router.url !== `/chat/${receiver.sendername}`) {
        if (receiver.isRead === false && receiver.receivername === this.user.username) {
          checkArr.push(1);
          this.msgNumber = _.sum(checkArr);
        }
      }
    }
  }

  logout() {
    this.tokenService.DeleteToken();
    this.router.navigate(['']);
  }

  GetUser() {
    this.usersService.GetUserById(this.user._id).subscribe(
      data => {
        this.notifications = data.result.notifications.reverse() || '';
        const value = _.filter(this.notifications, ['read', false]);
        this.count = value;
        this.chatList = data.result.chatList;
        this.ChecIfRead(this.chatList);
        console.log(this.msgNumber);
      },
      err => {
        if (err.error.token === null) {
          this.tokenService.DeleteToken();
          this.router.navigate(['']);
        }
      }
    );
  }
  GoToChatPage(name) {
    this.router.navigate(['chat', name]);
    this.msgService.MaxMessages(this.user.username, name).subscribe(data => {
      this.socket.emit('refresh', {});
    });
  }

  GoToHome() {
    this.router.navigate(['streams']);
  }
  maxAllMessages() {
    this.msgService.MaxAllMessages().subscribe(data => {
      this.socket.emit('refresh', {});
      this.msgNumber = 0;
    });
  }
  maxAll() {
    this.usersService.MaxAllAsRead().subscribe(data => {
      console.log(data);
      this.socket.emit('refresh', {});
    });
  }
  TimeFromNow(time) {
    return moment(time).fromNow();
  }

  MessageDate(data) {
    return moment(data).calendar(null, {
      sameDay: '[Today]',
      lastDay: '[YesterDay]',
      lastWeek: 'DD/MM/YYYY',
      sameElse: 'DD/MM/YYYY'
    });
  }
}
