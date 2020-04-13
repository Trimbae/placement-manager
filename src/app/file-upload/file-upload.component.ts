import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FilesService} from '../services/files.service';
import {FormControl, FormGroup} from '@angular/forms';
import {TaskService} from '../services/task.service';
import {ActivatedRoute, Router} from '@angular/router';

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
    private filesService: FilesService,
    private taskService: TaskService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.route.paramMap
      .subscribe(params => {
        const taskId = +params.get('taskId');
        this.task = this.taskService.getTaskById(taskId);
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
      taskId: this.task.id,
      universityId: this.userId,
      data: file.getFileEncodeBase64String(),
      metadata: file.getMetadata()
    };
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
          console.log(response);
          this.taskService.markTaskCompletedById(this.task.id);
          const uploadId = response._id;
          const navigationUrl = '/tasks/submitted/' + this.userId + '/' + this.task.id + '/' + this.task.name;
          this.showSpinner = false;
          this.router.navigate([navigationUrl], {queryParams : { idSelected: uploadId, isUploadRedirect: true}});
        });
    }
  }

}
