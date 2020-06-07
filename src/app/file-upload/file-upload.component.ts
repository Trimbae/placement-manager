import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FileService} from '../services/file-service/file.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {TaskService} from '../services/task-service/task.service';
import {ActivatedRoute, Router} from '@angular/router';
import {UserService} from '../services/user-service/user.service';
import {Task} from '../common/classes/task';
import {PermissionService} from '../services/permission-service/permission.service';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.css']
})
export class FileUploadComponent implements OnInit {

  @ViewChild('fileInput', {static: false}) fileInput: ElementRef;
  @ViewChild('fileInputPond') inputPond: any;
  fileData: string = null;
  previewType: string = null;
  task: Task;
  userId: string;
  showSpinner = false;

  // create formGroup
  uploadForm = new FormGroup({
    comments: new FormControl(),
    files: new FormControl('', Validators.required)
  });

  // set default options for filepond
  pondOptions = {
    class: 'my-filepond',
    multiple: 'false',
    labelIdle: 'Drag + Drop or Click to add files',
    acceptedFileTypes: ['application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/pdf']
};
  // initialise empty list of files
  pondFiles = [];

  constructor(
    private filesService: FileService,
    private permissionService: PermissionService,
    private route: ActivatedRoute,
    private router: Router,
    private taskService: TaskService,
    private userService: UserService
  ) { }

  ngOnInit(): void {
    // get the task id from the url parameters
    this.route.paramMap
      .subscribe(params => {
        const taskId = params.get('taskId');
        // get task data by Id
        this.taskService.getTaskById(taskId)
          .subscribe(response => {
            this.task = response;
          });
        // set user Id from URL parameters
        this.userId = params.get('userId');
        this.checkPermissions();
      });
  }

  checkPermissions(): void {
    if (!this.permissionService.isCurrentUser(this.userId)) {
      this.router.navigate(['error'], { queryParams: { errorCode: 'userNotAuthorized' }});
    }
  }

  pondHandleInit() {
    console.log('FilePond has initialised', this.inputPond);
  }
  // method called when file added to the filepond
  pondHandleAddFile(event) {
    // build file object
    const fileObject = this.buildFileObject(event.file);
    // set pdfData for preview
    this.previewType = event.file.fileType;
    this.fileData = fileObject.data;

    // set the value of the 'files' form control to file object
    this.uploadForm.get('files').setValue(fileObject);
  }

  // creates file data object
  buildFileObject(file) {
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
  // set preview pdfData to null if file removed from filepond
  onFileRemove() {
    this.fileData = null;
    this.uploadForm.get('files').setValue(null);
  }

  // method called when user clicks upload button
  onFileUpload() {
    // show user spinner while file being uploaded
    this.showSpinner = true;

    this.filesService.uploadFile(this.uploadForm.value)
      .subscribe( (response: any) => {
        // mark task as completed
        this.markTaskCompleted();
        // file uploaded so stop showing spinner
        this.showSpinner = false;
        const uploadId = response._id;
        // set navigation url based on userId, taskId and file uploadId
        const navigationUrl = '/tasks/submitted/' + this.userId + '/' + this.task.taskId + '/' + this.task.name;
        // navigate to submissions page for user to view submissions for this task
        this.router.navigate([navigationUrl], {queryParams : { idSelected: uploadId, isUploadRedirect: true}});
      });
  }

}
