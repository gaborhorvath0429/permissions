import { RightsGridComponent, ModifiedRight } from './../rights-grid/rights-grid.component'
import { Component, ViewChild, AfterViewInit } from '@angular/core'
import { RightsService } from '../services/rights.service'
import { MatDialog } from '@angular/material'
import { SaveDialogComponent } from '../save-dialog/save-dialog.component'
import * as moment from 'moment'
@Component({
  selector: 'app-group-rights',
  templateUrl: './group-rights.component.html',
  styleUrls: ['./group-rights.component.scss']
})
export class GroupRightsComponent implements AfterViewInit {

  @ViewChild(RightsGridComponent) grid: RightsGridComponent

  constructor(private service: RightsService, public dialog: MatDialog) { }

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
      allocated.forEach((allocatedRight: ModifiedRight) => {
        this.service.allocateRightForGroup(allocatedRight.right, fields)
      })
      unallocated.forEach((unallocatedRight: ModifiedRight) => {
        this.service.unAllocateRightForGroup(unallocatedRight.right, fields)
      })
    })
  }
}
