import {FormControl, ValidationErrors} from '@angular/forms';

export class Validation {
  static checkDueDateValidator(dueDateControl: FormControl): ValidationErrors {
    const dueDateValue = new Date(dueDateControl.value);
    const currentDate = new Date();
    if (dueDateValue.getDate() < currentDate.getDate()) {
      return {invalidDueDate: true};
    }
    return null;
  }
}
