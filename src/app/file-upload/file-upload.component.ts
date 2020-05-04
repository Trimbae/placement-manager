import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FileService} from '../services/file-service/file.service';
import {FormControl, FormGroup} from '@angular/forms';
import {TaskService} from '../services/task-service/task.service';
import {ActivatedRoute, Router} from '@angular/router';
import {UserService} from '../services/user-service/user.service';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.css']
})
export class FileUploadComponent implements OnInit {

  @ViewChild('fileInput', {static: false}) fileInput: ElementRef;
  @ViewChild('fileInputPond') inputPond: any;
  pdfData: any;
  previewType: string;
  isError = false;
  task: any;
  userId: string;
  showSpinner = false;

  uploadForm = new FormGroup({
    comments: new FormControl(),
    files: new FormControl()
  });

  pondOptions = {
    class: 'my-filepond',
    multiple: 'false',
    labelIdle: 'Drag + Drop or Click to add files',
    acceptedFileTypes: ['application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/pdf']
};

  pondFiles = [];

  constructor(
    private filesService: FileService,
    private route: ActivatedRoute,
    private router: Router,
    private taskService: TaskService,
    private userService: UserService
  ) { }

  ngOnInit(): void {
    this.route.paramMap
      .subscribe(params => {
        const taskId = +params.get('taskId');
        this.taskService.getTaskById(taskId)
          .subscribe(response => {
            this.task = response;
          });
        this.userId = params.get('userId');
      });
  }

  pondHandleInit() {
    console.log('FilePond has initialised', this.inputPond);
  }

  pondHandleAddFile(event) {
    console.log('A file was added', event);
    const fileObject = this.buildFileObject(event.file);
    this.pdfData = fileObject.data;
    this.uploadForm.get('files').setValue(fileObject);
  }

  buildFileObject(file) {
    this.previewType = file.fileType;
    return {
      fileId: file.id,
      filename: file.filename,
      fileType: file.fileType,
      taskId: this.task.taskId,
      universityId: this.userId,
      data: file.getFileEncodeBase64String(),
      metadata: file.getMetadata()
    };
  }

  markTaskCompleted() {
    this.userService.markTaskCompleteForUser(this.userId, this.task.taskId)
      .subscribe(response => {
        console.log(response);
      });
  }

  onFileRemove() {
    this.pdfData = null;
  }

  onFileUpload() {
    this.showSpinner = true;
    if (!this.uploadForm.get('files').value) {
      this.isError = true;
    } else {
      this.filesService.uploadFile(this.uploadForm.value)
        .subscribe( (response: any) => {
          this.markTaskCompleted();
          this.showSpinner = false;
          const uploadId = response._id;
          const navigationUrl = '/tasks/submitted/' + this.userId + '/' + this.task.taskId + '/' + this.task.name;
          this.router.navigate([navigationUrl], {queryParams : { idSelected: uploadId, isUploadRedirect: true}});
        });
    }
  }

}
