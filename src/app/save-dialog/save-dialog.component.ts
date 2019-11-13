import { Component, Inject, OnInit } from '@angular/core'
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'
import { ModifiedRight } from '../rights-grid/rights-grid.component'
import { RightsService } from '../services/rights.service'

export interface DialogData {
  type: 'user' | 'group'
  modified: ModifiedRight[]
}

@Component({
  selector: 'app-save-dialog',
  templateUrl: './save-dialog.component.html',
  styleUrls: ['./save-dialog.component.scss']
})
export class SaveDialogComponent implements OnInit {
  selected = ''

  fields = {
    ticket: '',
    comment: '',
    expiration: ''
  }

  constructor(
    public dialogRef: MatDialogRef<SaveDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private service: RightsService
  ) {}

  ngOnInit(): void {
    switch (this.data.type) {
      case 'user':
        this.service.selectedUser.subscribe(user => this.selected = user)
        break
      case 'group':
        this.service.selectedGroup.subscribe(group => this.selected = group)
        break
    }
  }

  onCancelClick(): void {
    this.dialogRef.close()
  }
}
