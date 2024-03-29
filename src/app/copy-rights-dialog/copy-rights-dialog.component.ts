import { Component, Inject, ViewChild, AfterViewInit } from '@angular/core'
import { Observable } from 'rxjs'
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material'
import { GroupModel } from '../models'
import { GroupsComponent } from '../groups/groups.component'
import * as moment from 'moment'

@Component({
  selector: 'app-copy-rights-dialog',
  templateUrl: './copy-rights-dialog.component.html',
  styleUrls: ['./copy-rights-dialog.component.scss']
})
export class CopyRightsDialogComponent implements AfterViewInit {
  selected: GroupModel
  filteredOptions: Observable<GroupModel[]>

  fields = {
    ticket: '',
    comment: '',
    expiration: moment(new Date()).format('YYYY-MM-DD')
  }

  @ViewChild(GroupsComponent) groupsComponent: GroupsComponent

  constructor(
    public dialogRef: MatDialogRef<CopyRightsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public source: GroupModel
  ) { }

  ngAfterViewInit(): void {
    this.groupsComponent.handleGroupClick = this.selectGroup.bind(this)
  }

  selectGroup(group: GroupModel): void {
    this.selected = group
  }

  onCancelClick(): void {
    this.dialogRef.close()
  }
}
