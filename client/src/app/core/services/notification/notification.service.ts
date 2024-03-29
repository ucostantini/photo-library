import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from "@angular/material/snack-bar";

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  private config: MatSnackBarConfig = {
    horizontalPosition: "right",
    verticalPosition: "top"
  };

  constructor(private toaster: MatSnackBar) {
  }

  notifySuccess(message: string): void {
    this.toaster.open(message, 'Dismiss', this.config);
  }

  notifyError(error: string): void {
    this.toaster.open('Error : ' + error, 'Dismiss', this.config);
  }
}
