import {Component, OnInit} from '@angular/core';
import {TaskService} from '../services/task-service/task.service';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import {Router} from '@angular/router';
import {Task} from '../common/classes/task';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ModalDeleteComponent} from '../modal-delete/modal-delete.component';
import {PermissionService} from '../services/permission-service/permission.service';

@Component({
  selector: 'app-view-tasks',
  templateUrl: './view-tasks.component.html',
  styleUrls: ['./view-tasks.component.css']
})
export class ViewTasksComponent implements OnInit {
  publishedTasks = [];
  draftTasks = [];
  orderChanged = false;
  isLoaded = false;
  notificationText: string;
  notificationType: string;

  originalPublishedTasks: any;
  originalDraftTasks: any;

  constructor(private taskService: TaskService,
              private modalService: NgbModal,
              private permissionService: PermissionService,
              private router: Router) { }

  ngOnInit(): void {
    this.checkPermissions();
    this.getTasks();
  }

  checkPermissions(): void {
    if (!this.permissionService.isAdmin()) {
      this.router.navigate(['error'], { queryParams: { errorCode: 'userNotAuthorized' }});
    }
  }

  clearNotifications(): void {
    this.notificationText = null;
    this.notificationType = null;
  }
  // event called when a task item is dropped in a new place in group
  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);
    }
    this.orderChanged = this.isOrderChanged();
  }
  // navigate to edit task page
  editClicked(task) {
    this.router.navigate(['/admin/edit-task', task.taskId, task.name]);
  }
  // check if order has changed, this tells us whether to enable save changes button
  isOrderChanged() {
    for (const task of this.publishedTasks) {
      const currentIndex = this.publishedTasks.indexOf(task);
      if (task.orderIndex !== currentIndex || !task.isPublished) {
        return true;
      }
    }
    for (const task of this.draftTasks) {
      if (task.isPublished) {
        return true;
      }
    }
    return false;
  }
  // get tasks
  getTasks() {
    this.taskService.getTasks()
      .subscribe(response => {
        this.sortTasks(response);
        this.isLoaded = true;
      });
  }
  // called when delete icon is clicked for a task
  onDelete(task: Task) {
    // open delete modal for task
    const modalRef = this.modalService.open(ModalDeleteComponent, {windowClass: 'modal-holder', centered: true});
    modalRef.componentInstance.name = task.displayName;
    modalRef.componentInstance.type = 'Task';
    // if user clicks ok, delete task and set notification
    modalRef.result.then( () => {
      this.taskService.deleteTaskById(task.taskId)
        .subscribe(() => {
          this.removeTaskFromList(task);
          this.setNotification('Task deleted: ' + task.displayName, 'warning');
        });
    }, () => {
      // modal dismissed
    });
  }
  // called when save changes button clicked, so that we dont have to update every task every time we save
  // this function finds tasks that need updating and only posts these tasks for update
  onSaveChanges() {
    const tasksToUpdate = [];
    // iterate through list of published tasks
    for (const task of this.publishedTasks) {
      const currentIndex = this.publishedTasks.indexOf(task);
      // if original orderIndex doesnt match current index, save new index and push to array of tasks to update
      if (currentIndex !== task.orderIndex) {
        task.isPublished = true;
        task.orderIndex = currentIndex;
        tasksToUpdate.push(task);
      // this accounts for tasks that match the orderIndex but were originally in the drafts list
      } else if (!task.isPublished) {
        task.isPublished = true;
        tasksToUpdate.push(task);
      }
    }
    // iterate through draft tasks and push any tasks that were previously in published list for update
    for (const task of this.draftTasks) {
      if (task.isPublished) {
        task.isPublished = false;
        task.orderIndex = null;
        tasksToUpdate.push(task);
      }
    }
    // post all tasks to be updated
    this.taskService.updateTasks(tasksToUpdate)
      .subscribe(response => {
        this.orderChanged = false;
      });
  }
  // removes task from the appropriate array maintained in browser
  removeTaskFromList(task: Task) {
    if (task.isPublished) {
      const index = this.publishedTasks.indexOf(task);
      this.publishedTasks.splice(index, 1);
    } else {
      const index = this.draftTasks.indexOf(task);
      this.draftTasks.splice(index, 1);
    }
  }

  sortTasks(tasks) {
    for (const task of tasks) {
      if (task.isPublished) {
        this.publishedTasks.push(task);
      } else {
        this.draftTasks.push(task);
      }
    }
    this.publishedTasks.sort((a, b) => a.orderIndex - b.orderIndex);
    this.originalPublishedTasks = this.publishedTasks;
    this.originalDraftTasks = this.draftTasks;
  }

  setNotification(text: string, type: string): void {
    this.notificationText = text;
    this.notificationType = type;
  }

}
