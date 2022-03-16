import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {TaskModel} from '../../models/task.model';
import {TaskManagementService} from '../../services/task-management.service';
import {cloneDeep} from 'lodash-es';
import {of, Subject, Subscription} from 'rxjs';
import {debounceTime, switchMap} from 'rxjs/operators';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss']
})
export class TaskListComponent implements OnInit, OnDestroy {
  public searchKey: string;
  @Input() tasks: TaskModel[];
  @Output() updateTaskSelected = new EventEmitter();
  private searchSubject$ = new Subject<string>();
  private readonly subscription: Subscription;

  constructor(private taskManagementService: TaskManagementService) {
    this.subscription = new Subscription();
  }

  public ngOnInit(): void {
    this.tasks.sort((taskFirst, taskSecond) => {
      // @ts-ignore
      return new Date(taskFirst.dueDate).getDate() - new Date(taskSecond.dueDate).getDate();
    });
    const tasks = cloneDeep(this.tasks);
    const searchByTitleSubscription = this.searchSubject$.pipe(
      debounceTime(300),
      switchMap(keyWord => {
        this.searchKey = keyWord;
        this.tasks = tasks.filter(task => {
          return task.title.includes(this.searchKey);
        });
        return of(this.tasks);
      })
    ).subscribe();
    this.subscription.add(searchByTitleSubscription);
  }

  public openTaskDetail(task: TaskModel): void {
    task.opened = !task.opened;
  }

  public onCheckedChange(task: TaskModel): void {
    task.checked = !task.checked;
  }

  public removeTask(index: number): void {
    this.tasks.splice(index, 1);
    this.taskManagementService.setItemToLocalStorage('tasks', this.tasks);
  }

  public enableBulkAction(): boolean {
    if (!this.tasks || !this.tasks.length) {
      return false;
    }
    return this.tasks.some(task => {
      return task.checked;
    });
  }

  public removeTasksSelected(): void {
    const tasks = cloneDeep(this.tasks);
    this.tasks = tasks.filter(task => {
      return !task.checked;
    });
    this.taskManagementService.setItemToLocalStorage('tasks', this.tasks);
  }

  public searchTaskByTitle(event: Event): void {
    const keyWord = (event.target as HTMLInputElement).value;
    this.searchSubject$.next(keyWord);
  }

  public updateTask(taskUpdated: TaskModel): void {
    this.updateTaskSelected.emit(taskUpdated);
  }

  public ngOnDestroy(): void {
    if (this.subscription && !this.subscription.closed) {
      this.subscription.unsubscribe();
    }
  }

}
