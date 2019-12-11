import { RightsGridComponent, ModifiedRight } from './../rights-grid/rights-grid.component'
import { Component, ViewChild, AfterViewInit } from '@angular/core'
import { RightsService } from '../services/rights.service'
import { MatDialog, MatSnackBar } from '@angular/material'
import { SaveDialogComponent } from '../save-dialog/save-dialog.component'
import * as moment from 'moment'
import { CopyRightsDialogComponent } from '../copy-rights-dialog/copy-rights-dialog.component'
import { GroupModel } from '../models'
import { ModelApiResponse } from '../backend'
@Component({
  selector: 'app-group-rights',
  templateUrl: './group-rights.component.html',
  styleUrls: ['./group-rights.component.scss']
})
export class GroupRightsComponent implements AfterViewInit {

  @ViewChild(RightsGridComponent) grid: RightsGridComponent

  constructor(
    private service: RightsService,
    public dialog: MatDialog,
    private snackBar: MatSnackBar
  ) { }

  ngAfterViewInit(): void {
    this.service.groupRights.subscribe(rights => this.grid.setData(rights))
  }

  get selectedGroupName(): string {
    return this.service.selectedGroup.groupName
  }

  showSaveDialog(modified: ModifiedRight): void {
    const dialogRef = this.dialog.open(SaveDialogComponent, {
      width: '250px',
      data: { modified, type: 'group' }
    })

    dialogRef.afterClosed().subscribe(result => {
      if (!result) return
      let { fields, allocated, unallocated } = result
      if (fields.expiration) fields.expiration = moment(fields.expiration).format('YYYY-MM-DD')
      let promises: Promise<ModelApiResponse>[] = []
      allocated.forEach((allocatedRight: ModifiedRight) => {
        promises.push(this.service.allocateRightForGroup(allocatedRight.right, fields))
      })
      unallocated.forEach((unallocatedRight: ModifiedRight) => {
        promises.push(this.service.unAllocateRightForGroup(unallocatedRight.right, fields))
      })

      Promise.all(promises)
      .then(
        () => {
          this.snackBar.open('Group permissions have been successfully saved!', '', {duration: 3000})
          this.grid.modified = []
          this.service.getGroupRights(this.service.selectedGroup)
        }
      ).catch(
        err => this.snackBar.open(err.error.message, '', {duration: 3000})
      )
    })
  }

  showCopyRightsDialog(): void {
    const dialogRef = this.dialog.open(CopyRightsDialogComponent, {
      width: '825px',
      data: this.service.selectedGroup
    })

    dialogRef.afterClosed().subscribe(result => {
      if (!result || !result.target) return
      let {target, fields} = result
      let source = this.service.selectedGroup as GroupModel
      if (fields.expiration) fields.expiration = moment(fields.expiration).format('YYYY-MM-DD')
      this.service.copyGroupRights(source.groupId, target.groupId, fields).subscribe(
        res => this.snackBar.open('Group permissions have been successfully copied!', '', {duration: 3000}),
        err => this.snackBar.open(err.error.message, '', {duration: 3000})
      )
    })
  }
}
