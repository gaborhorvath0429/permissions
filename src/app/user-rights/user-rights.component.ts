import { RightsService } from './../services/rights.service'
import { Component, AfterViewInit, ViewChild } from '@angular/core'
import { RightsGridComponent, ModifiedRight } from '../rights-grid/rights-grid.component'
import { MatDialog, MatSnackBar } from '@angular/material'
import { SaveDialogComponent } from '../save-dialog/save-dialog.component'
import { ModelApiResponse } from '../backend'
import * as moment from 'moment'

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
      this.service.isLoading.next(true)
      let { fields, allocated, unallocated } = result
      if (fields.expiration) fields.expiration = moment(fields.expiration).format('YYYY-MM-DD')
      let promises: Promise<ModelApiResponse>[] = []
      allocated.forEach((allocatedRight: ModifiedRight) => {
        promises.push(this.service.allocateRightForUser(allocatedRight.right, fields))
      })
      unallocated.forEach((unallocatedRight: ModifiedRight) => {
        promises.push(this.service.unAllocateRightForUser(unallocatedRight.right, fields))
      })

      Promise.all(promises)
      .then(
        () => {
          this.snackBar.open('User permissions have been successfully saved!', '', {duration: 3000})
          this.grid.modified = []
          this.service.getUserRights(this.service.selectedUser)
        }
      ).catch(
        err => {
          this.snackBar.open(err.error.message, '', {duration: 3000})
          this.service.isLoading.next(false)
        }
      )
    })
  }
}
