import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { PostService } from 'src/app/services/post.service';
import io from 'socket.io-client';
import { FileUploader } from 'ng2-file-upload';

const URL = 'https://chatapp-longvv.herokuapp.com/api/chatapp/upload-image';
@Component({
  selector: 'app-post-form',
  templateUrl: './post-form.component.html',
  styleUrls: ['./post-form.component.css']
})
export class PostFormComponent implements OnInit {
  uploader: FileUploader = new FileUploader({
    url: URL,
    disableMultipart: true
  });

  selectedFile: any;
  socketHost: any;
  socket: any;
  postForm: FormGroup;

  constructor(private fb: FormBuilder, private postService: PostService) {
    this.socket = io('https://chatapp-longvv.herokuapp.com');
  }

  ngOnInit() {
    this.init();
  }
  init() {
    this.postForm = this.fb.group({
      post: ['', Validators.required]
    });
  }
  SubmitPost() {
    let body;
    if (!this.selectedFile) {
      body = {
        post: this.postForm.value.post
      };
    } else {
      body = {
        post: this.postForm.value.post,
        image: this.selectedFile
      };
    }
    this.postService.addPost(body).subscribe(data => {
      // console.log(data);
      this.socket.emit('refresh', {});
      this.postForm.reset();
    });
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

  OnFileSelected(event) {
    const file: File = event[0];
    this.ReadAsBase64(file)
      .then(result => {
        this.selectedFile = result;
        console.log(this.selectedFile);
      })
      .catch(err => console.log(err));
  }
}
