import { Component } from '@angular/core'
import { MatDialogRef } from '@angular/material'

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.scss']
})
export class ConfirmDialogComponent {

  constructor(public dialogRef: MatDialogRef<ConfirmDialogComponent>) { }

  onCancelClick(): void {
    this.dialogRef.close()
  }
}
