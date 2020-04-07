import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FilesService} from '../services/files.service';
import {FormControl, FormGroup} from '@angular/forms';
import {DomSanitizer} from '@angular/platform-browser';
import {TaskService} from '../services/task.service';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.css']
})
export class FileUploadComponent implements OnInit {

  @ViewChild('fileInput', {static: false}) fileInput: ElementRef;
  @ViewChild('fileInputPond') inputPond: any;
  sourceData: any;
  previewType: string;
  isError = false;
  task: any;
  userId: string;

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
    private sanitizer: DomSanitizer,
    private taskService: TaskService,
    private route: ActivatedRoute) { }

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
    this.sourceData = this.sanitizer.bypassSecurityTrustResourceUrl('data:' + fileObject.fileType + ';base64,' + fileObject.data);
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
    this.sourceData = null;
  }

  onFileUpload() {
    if (!this.uploadForm.get('files').value) {
      this.isError = true;
    } else {
      this.filesService.uploadFile(this.uploadForm.value)
        .subscribe( response => {
          console.log(response);
        });
    }
  }

}
