import { TokenService } from './../../services/token.service';
import { UsersService } from './../../services/users.service';
import { FileUploader } from 'ng2-file-upload';
import { Component, OnInit } from '@angular/core';
import io from 'socket.io-client';

const URL = 'https://chatapp-longvv.herokuapp.com/api/chatapp/upload-image';
@Component({
  selector: 'app-images',
  templateUrl: './images.component.html',
  styleUrls: ['./images.component.css']
})
export class ImagesComponent implements OnInit {
  uploader: FileUploader = new FileUploader({
    url: URL,
    disableMultipart: true
  });

  selectedFile: any;
  user: any;
  images = [];

  socket: any;
  constructor(private usersService: UsersService, private tokenService: TokenService) {
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
        if (data.result.images.length > 0) {
          this.images = data.result.images;
        }

        console.log(this.images);
      },
      err => console.log(err)
    );
  }

  OnFileSelected(event) {
    const file: File = event[0];
    this.ReadAsBase64(file)
      .then(result => {
        this.selectedFile = result;
      })
      .catch(err => console.log(err));
  }

  ReadAsBase64(file): Promise<any> {
    const reader = new FileReader();
    const fileValue = new Promise((resolve, reject) => {
      reader.addEventListener('load', () => {
        resolve(reader.result);
      });
      reader.addEventListener('error', event => {
        reject(event);
      });
      reader.readAsDataURL(file);
    });
    return fileValue;
  }

  SetProfileImage(image) {
    this.usersService.SetDefaultImage(image.imgId, image.imgVersion).subscribe(
      data => {
        console.log(data);
        this.socket.emit('refresh', {});
      },
      err => {
        console.log(err);
      }
    );
  }
  upload() {
    if (this.selectedFile) {
      this.usersService.AddImage(this.selectedFile).subscribe(
        data => {
          // console.log(data);
          this.socket.emit('refresh', {});
          const filePath = <HTMLInputElement>document.getElementById('filePath');
          filePath.value = '';
        },
        err => console.log(err)
      );
    }
  }
}
