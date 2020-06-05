import {Component, OnInit} from '@angular/core';
import {TaskService} from '../services/task-service/task.service';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import {Router} from '@angular/router';
import {Task} from '../common/classes/task';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ModalDeleteComponent} from '../modal-delete/modal-delete.component';

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

  constructor(private taskService: TaskService, private modalService: NgbModal,  private router: Router) { }

  ngOnInit(): void {
    this.getTasks();
  }

  clearNotifications(): void {
    this.notificationText = null;
    this.notificationType = null;
  }

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);
    }
    this.orderChanged =  this.isOrderChanged();
  }

  editClicked(task) {
    this.router.navigate(['/admin/edit-task', task.taskId, task.name]);
  }

  isOrderChanged() {
    for (const task of this.publishedTasks) {
      const currentIndex = this.publishedTasks.indexOf(task);
      if (task.orderIndex !== currentIndex || !task.isPublished) {
        console.log('prev: ' + task.orderIndex + ' current: ' + currentIndex);
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

  getTasks() {
    this.taskService.getTasks()
      .subscribe(response => {
        this.sortTasks(response);
        this.isLoaded = true;
      });
  }

  onDelete(task: Task) {
    const modalRef = this.modalService.open(ModalDeleteComponent, {windowClass: 'modal-holder', centered: true});
    modalRef.componentInstance.name = task.displayName;
    modalRef.componentInstance.type = 'Task';

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

  onSaveChanges() {
    const tasksToUpdate = [];
    for (const task of this.publishedTasks) {
      const currentIndex = this.publishedTasks.indexOf(task);
      if (currentIndex !== task.orderIndex) {
        task.isPublished = true;
        task.orderIndex = currentIndex;
        tasksToUpdate.push(task);

      } else if (!task.isPublished) {
        task.isPublished = true;
        tasksToUpdate.push(task);
      }
    }
    for (const task of this.draftTasks) {
      if (task.isPublished) {
        task.isPublished = false;
        task.orderIndex = null;
        tasksToUpdate.push(task);
      }
    }
    this.taskService.updateTasks(tasksToUpdate)
      .subscribe(response => {
        console.log(response);
        this.orderChanged = false;
      });
  }

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
