import {Component, OnInit} from '@angular/core';
import {TaskModel} from './models/task.model';
import {TaskManagementService} from './services/task-management.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  title = 'frontend-test';
  tasks: TaskModel[] = [];

  constructor(private taskManagementService: TaskManagementService) {
  }

  public ngOnInit(): void {
    this.tasks = this.taskManagementService.getItemFromLocalStorage('tasks') || [];
  }

  public triggerCreateOrUpdate(task: TaskModel): void {
    this.tasks = this.taskManagementService.getItemFromLocalStorage('tasks');
    this.tasks.push(task);
    this.taskManagementService.setItemToLocalStorage('tasks', this.tasks);
  }

  public updateTaskSelected(taskDetail: TaskModel): void {
    this.tasks = this.taskManagementService.getItemFromLocalStorage('tasks');
    const indexTaskUpdated = this.tasks.findIndex((task) => {
      return task.taskId === taskDetail.taskId;
    });
    this.tasks.splice(indexTaskUpdated, 1, taskDetail);
    this.taskManagementService.setItemToLocalStorage('tasks', this.tasks);
  }

}

