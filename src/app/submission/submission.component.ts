import {Component, OnChanges, OnInit} from '@angular/core';
import {FileService} from '../services/file-service/file.service';
import {TaskService} from '../services/task-service/task.service';
import {ActivatedRoute, Router} from '@angular/router';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ModalDeleteComponent} from '../modal-delete/modal-delete.component';
import {Task} from '../common/classes/task';
import {PermissionService} from '../services/permission-service/permission.service';

@Component({
  selector: 'app-submission',
  templateUrl: './submission.component.html',
  styleUrls: ['./submission.component.css']
})
export class SubmissionComponent implements OnInit, OnChanges {
  task: Task;
  universityId: string;
  submissions: any;
  previewType: string;
  pdfData: string;
  idSelected: string;
  isUploadRedirect: boolean;
  showSpinner = true;
  fileDeleted: any;

  constructor(
    private filesService: FileService,
    private modalService: NgbModal,
    private permissionService: PermissionService,
    private route: ActivatedRoute,
    private router: Router,
    private taskService: TaskService
  ) { }

  ngOnInit(): void {
    this.getSubmissions();
  }
  // when data changes, get preview
  ngOnChanges(): void {
    this.getPreview(this.idSelected);
  }

  checkPermissions(): void {
    if (!this.permissionService.isCurrentUser(this.universityId) &&
      !this.permissionService.isSupervisorOfStudent(this.universityId) &&
      !this.permissionService.isAdmin()) {
        this.router.navigate(['error'], { queryParams: { errorCode: 'userNotAuthorized' }});
    }
  }

  // get files for this student for this task
  getFiles(taskId: string, universityId: string) {
    this.filesService.getFilesByTaskId(taskId, universityId)
      .subscribe( response => {
        this.submissions = response;
        this.getPreview(this.idSelected);
        this.showSpinner = false;
      });
  }
  // set data for preview window
  getPreview(submissionId: string) {
    if (this.submissions && submissionId) {
      this.idSelected = submissionId;
      for (const sub of this.submissions) {
        if (sub._id === submissionId) {
          this.pdfData = sub.data;
          this.previewType = sub.fileType;
        }
      }
    }
  }
  // get task based on taskId
  getTask(taskId: string) {
    this.taskService.getTaskById(taskId)
      .subscribe(response => {
        this.task = response;
      });
  }
  // calls methods to get task and files from url parameters
  getSubmissions() {
    this.route.paramMap
      .subscribe(params => {
        const taskId = params.get('taskId');
        this.universityId = params.get('userId');
        this.checkPermissions();
        this.getTask(taskId);
        this.getFiles(taskId, this.universityId);
      });
    this.route.queryParamMap
      .subscribe( params => {
        this.idSelected = params.get('idSelected') || null;
        this.isUploadRedirect = params.get('isUploadRedirect') === 'true' || false;
      });
  }
  // called when delete icon clicked
  onDelete(file: any) {
    // delete 'are you sure?' modal initialised for file
    const modalRef = this.modalService.open(ModalDeleteComponent, {windowClass: 'modal-holder', centered: true});
    modalRef.componentInstance.name = file.filename;
    modalRef.componentInstance.type = 'File';
    // if user clicks ok then delete file from DB and populate notification
    modalRef.result.then( () => {
      this.filesService.deleteFileById(file._id)
        .subscribe(() => {
          const index = this.submissions.indexOf(file);
          this.submissions.splice(index, 1);
          this.fileDeleted = file;
          this.isUploadRedirect = false;
        });
    }, () => {
      // modal dismissed
    });
  }

}
