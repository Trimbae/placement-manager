import {Component, OnInit} from '@angular/core';
import {TaskService} from '../services/task-service/task.service';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import {Router} from '@angular/router';

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

  originalPublishedTasks: any;
  originalDraftTasks: any;

  constructor(private taskService: TaskService, private router: Router) { }

  ngOnInit(): void {
    this.getTasks();
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
    this.router.navigate(['/edit', task.taskId, task.name]);
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

  onSaveChanges() {
    const tasksToUpdate = [];
    for (const task of this.publishedTasks) {
      const currentIndex = this.publishedTasks.indexOf(task);
      if (currentIndex !== task.orderIndex) {
        // tasksToUpdate.push({taskId: task.taskId, isPublished: true, orderIndex: currentIndex});
        task.isPublished = true;
        task.orderIndex = currentIndex;
        tasksToUpdate.push(task);

      } else if (!task.isPublished) {
        // tasksToUpdate.push({taskId: task.taskId, isPublished: true});
        task.isPublished = true;
        tasksToUpdate.push(task);
      }
    }
    for (const task of this.draftTasks) {
      if (task.isPublished) {
        // tasksToUpdate.push({taskId: task.taskId, isPublished: false, orderIndex: null});
        task.isPublished = false;
        task.orderIndex = null;
        tasksToUpdate.push(task);
      }
    }
    console.log(tasksToUpdate);
    this.taskService.updateTasks(tasksToUpdate)
      .subscribe(response => {
        console.log(response);
        this.orderChanged = false;
      });
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

}
