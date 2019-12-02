import { RightsService } from './../services/rights.service'
import { Component, AfterViewInit, ViewChild } from '@angular/core'
import { RightsGridComponent, ModifiedRight } from '../rights-grid/rights-grid.component'
import { MatDialog, MatSnackBar } from '@angular/material'
import { SaveDialogComponent } from '../save-dialog/save-dialog.component'

@Component({
  selector: 'app-user-rights',
  templateUrl: './user-rights.component.html',
  styleUrls: ['./user-rights.component.scss']
})
export class UserRightsComponent implements AfterViewInit {

  @ViewChild(RightsGridComponent) grid: RightsGridComponent

  constructor(
    private service: RightsService,
    public dialog: MatDialog,
    private snackBar: MatSnackBar
  ) { }

  ngAfterViewInit(): void {
    this.service.userRights.subscribe(rights => this.grid.setData(rights))
  }

  get selectedUserName(): string {
    return this.service.selectedUser.displayName
  }

  showSaveDialog(modified: ModifiedRight): void {
    const dialogRef = this.dialog.open(SaveDialogComponent, {
      width: '250px',
      data: { modified, type: 'user' }
    })

    dialogRef.afterClosed().subscribe(result => {
      if (!result) return
      let { fields, allocated, unallocated } = result
      if (fields.expiration && fields.expiration._i) {
        let dateFields = fields.expiration._i
        fields.expiration = dateFields.year + '-' + dateFields.month + '-' + dateFields.date
      }
      allocated.forEach((allocatedRight: ModifiedRight) => {
        this.service.allocateRightForUser(allocatedRight.right, fields).subscribe(
          res => this.snackBar.open('User permissions have been successfully saved!', '', {duration: 3000}),
          err => this.snackBar.open(err.error.message, '', {duration: 3000})
        )
      })
      unallocated.forEach((unallocatedRight: ModifiedRight) => {
        this.service.unAllocateRightForUser(unallocatedRight.right, fields).subscribe(
          res => this.snackBar.open('User permissions have been successfully saved!', '', {duration: 3000}),
          err => this.snackBar.open(err.error.message, '', {duration: 3000})
        )
      })
    })
  }
}
