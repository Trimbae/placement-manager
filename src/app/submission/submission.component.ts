import {Component, OnChanges, OnInit} from '@angular/core';
import {FileService} from '../services/file-service/file.service';
import {TaskService} from '../services/task-service/task.service';
import {ActivatedRoute} from '@angular/router';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ModalDeleteComponent} from '../modal-delete/modal-delete.component';

@Component({
  selector: 'app-submission',
  templateUrl: './submission.component.html',
  styleUrls: ['./submission.component.css']
})
export class SubmissionComponent implements OnInit, OnChanges {
  task: any;
  universityId: string;
  submissions: any;
  previewType: string;
  pdfData: string;
  idSelected: string;
  isUploadRedirect: boolean;
  showSpinner = true;
  fileDeleted: any;

  constructor(
    private route: ActivatedRoute,
    private filesService: FileService,
    private modalService: NgbModal,
    private taskService: TaskService
  ) { }

  ngOnInit(): void {
    this.getSubmissions();
  }

  ngOnChanges(): void {
    this.getPreview(this.idSelected);
  }

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

  getSubmissions() {
    this.route.paramMap
      .subscribe(params => {
        const taskId = +params.get('taskId');
        this.task = this.taskService.getTaskById(taskId);
        this.universityId = params.get('userId');
        this.filesService.getFilesByTaskId(taskId, this.universityId)
           .subscribe( response => {
             this.submissions = response;
             this.getPreview(this.idSelected);
             this.showSpinner = false;
           });
      });
    this.route.queryParamMap
      .subscribe( params => {
        this.idSelected = params.get('idSelected') || null;
        this.isUploadRedirect = params.get('isUploadRedirect') === 'true' || false;
      });
  }

  onDelete(file: any) {
    const modalRef = this.modalService.open(ModalDeleteComponent, {windowClass: 'modal-holder', centered: true});
    modalRef.componentInstance.filename = file.filename;

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
