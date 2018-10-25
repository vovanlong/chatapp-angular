import { Component, OnInit, AfterViewInit } from '@angular/core';
import { TokenService } from 'src/app/services/token.service';
import { MessageService } from 'src/app/services/message.service';
import { ActivatedRoute } from '@angular/router';
import { UsersService } from 'src/app/services/users.service';
import io from 'socket.io-client';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.css']
})
export class MessageComponent implements OnInit, AfterViewInit {
  receiver: string;
  user: any;
  message: string;
  receiverData: any;
  messagesArray = [];
  socket: any;
  typingMessage;
  typing = false;

  constructor(
    private tokenService: TokenService,
    private msgService: MessageService,
    private route: ActivatedRoute,
    private usersService: UsersService
  ) {
    this.socket = io('http://localhost:3000');
  }

  ngOnInit() {
    this.user = this.tokenService.GetPayload();
    this.route.params.subscribe(params => {
      this.receiver = params.name;
      this.GetUserByUsername(this.receiver);

      this.socket.on('refreshPage', () => {
        this.GetUserByUsername(this.receiver);
      });
    });

    this.socket.on('is_typing', data => {
      if (data.sender === this.receiver) {
        this.typing = true;
      }
    });

    this.socket.on('has_stopped_typing', data => {
      if (data.sender === this.receiver) {
        this.typing = false;
      }
    });
  }

  ngAfterViewInit() {
    const params = {
      room1: this.user.username,
      room2: this.receiver
    };

    this.socket.emit('join chat', params);
  }
  GetUserByUsername(name) {
    this.usersService.GetUserByName(name).subscribe(data => {
      this.receiverData = data.result;
      this.GetMessages(this.user._id, data.result._id);
    });
  }

  GetMessages(senderId, receiverId) {
    this.msgService.GetAllMessages(senderId, receiverId).subscribe(data => {
      this.messagesArray = data.messages.message;
      console.log(data);
    });
  }

  SendMessage() {
    if (this.message) {
      this.msgService
        .SendMessage(this.user._id, this.receiverData._id, this.receiverData.username, this.message)
        .subscribe(data => {
          this.socket.emit('refresh', {});
          this.message = '';
        });
    }
  }

  IsTyping() {
    this.socket.emit('start_typing', {
      sender: this.user.username,
      receiver: this.receiver
    });

    if (this.typingMessage) {
      clearTimeout(this.typingMessage);
    }

    this.typingMessage = setTimeout(() => {
      this.socket.emit('stop_typing', {
        sender: this.user.username,
        receiver: this.receiver
      });
    }, 500);
  }
}
