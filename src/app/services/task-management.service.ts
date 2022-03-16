import {Injectable} from '@angular/core';
import {TaskModel} from '../models/task.model';

@Injectable({
  providedIn: 'root'
})
export class TaskManagementService {

  constructor() {
  }

  public setItemToLocalStorage(key: string, object: object): void {
    const objectToString = JSON.stringify(object);
    window.localStorage.setItem(key, objectToString);
  }

  public getItemFromLocalStorage(key: string): TaskModel[] {
     const item = window.localStorage.getItem(key);
     const itemToJSON = JSON.parse(item);
     return itemToJSON;
  }
}
