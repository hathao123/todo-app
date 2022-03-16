import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {TaskModel} from '../../models/task.model';
import {TaskManagementService} from '../../services/task-management.service';
import {Validation} from './validation';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.scss']
})
export class TaskComponent implements OnInit {

  @Input() isDetailInfo: boolean;
  @Input() task: TaskModel;
  public taskForm: FormGroup;
  public titleControl: FormControl;
  public descriptionControl: FormControl;
  public dueDateControl: FormControl;
  public priorityControl: FormControl;
  public taskIdControl: FormControl;

  @Output() triggerCreateOrUpdate = new EventEmitter();
  @Output() updateTask = new EventEmitter();

  constructor() {
  }

  public ngOnInit(): void {
    this.buildTaskForm();
  }

  public buildTaskForm(): void {
    this.titleControl = new FormControl('', [Validators.required]);
    this.descriptionControl = new FormControl();
    this.dueDateControl = new FormControl('', [Validation.checkDueDateValidator]);
    this.priorityControl = new FormControl();
    this.taskIdControl = new FormControl();
    this.taskForm = new FormGroup({
      taskId: this.taskIdControl,
      title: this.titleControl,
      description: this.descriptionControl,
      dueDate: this.dueDateControl,
      priority: this.priorityControl
    });
    this.patchValueToForm();
  }

  public patchValueToForm(): void {
    const taskDetail = this.task ? true : false;
    this.dueDateControl.patchValue(taskDetail ? this.task.dueDate : this.getFormatDate());
    this.priorityControl.patchValue(taskDetail ? this.task.priority : 'NORMAL');
    this.titleControl.patchValue(taskDetail ? this.task.title : '');
    this.descriptionControl.patchValue(taskDetail ? this.task.description : '');
    this.taskIdControl.patchValue(taskDetail ? this.task.taskId : this.genTaskID());
  }

  public getFormatDate(): string {
    const today = new Date();
    const year = today.getFullYear();
    let month = String(today.getMonth() + 1);
    let day = String(today.getDate());

    if (Number(day) < 10) {
      day = '0' + day;
    }
    if (Number(month) < 10) {
      month = '0' + month;
    }
    return `${year}-${month}-${day}`;
  }

  public createOrUpdateTask(): void {
    this.taskForm.markAllAsTouched();
    if (this.taskForm.invalid) {
      return;
    }
    const task = this.taskForm.value;
    console.log(task);
    if (this.task) {
      console.log('a');
      this.updateTask.emit(task);
    }
    this.triggerCreateOrUpdate.emit(task);
    this.titleControl.setValidators(null);
    this.dueDateControl.setValidators(null);
    this.patchValueToForm();
  }

  public genTaskID(): string {
    const timeStamp = new Date().getDay() + new Date().getMilliseconds();
    return `TASK${timeStamp}`;
  }

}
