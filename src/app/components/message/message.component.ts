import { Component, OnInit } from '@angular/core';
import { TokenService } from 'src/app/services/token.service';
import { MessageService } from 'src/app/services/message.service';
import { ActivatedRoute } from '@angular/router';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.css']
})
export class MessageComponent implements OnInit {
  receiver: string;
  user: any;
  message: string;
  receiverData: any;
  messagesArray = [];
  socket: any;

  constructor(
    private tokenService: TokenService,
    private msgService: MessageService,
    private route: ActivatedRoute,
    private usersService: UsersService
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.receiver = params.name;
      this.GetUserByUsername(this.receiver);
    });
  }
  GetUserByUsername(name) {
    this.usersService.GetUserByName(name).subscribe(data => {
      console.log(data);
    });
  }
  SendMessage() {}
}
