import { RightsGridComponent, ModifiedRight } from './../rights-grid/rights-grid.component'
import { Component, ViewChild, AfterViewInit } from '@angular/core'
import { RightsService } from '../services/rights.service'
import { MatDialog } from '@angular/material'
import { SaveDialogComponent } from '../save-dialog/save-dialog.component'

@Component({
  selector: 'app-group-rights',
  templateUrl: './group-rights.component.html',
  styleUrls: ['./group-rights.component.scss']
})
export class GroupRightsComponent implements AfterViewInit {

  selectedGroupName = ''

  @ViewChild(RightsGridComponent) grid: RightsGridComponent

  constructor(private service: RightsService, public dialog: MatDialog) { }

  ngAfterViewInit(): void {
    this.service.groupRights.subscribe(rights => this.grid.setData(rights))
    this.service.selectedGroup.subscribe(name => this.selectedGroupName = name)
  }

  showSaveDialog(modified: ModifiedRight): void {
    const dialogRef = this.dialog.open(SaveDialogComponent, {
      width: '250px',
      data: { modified, type: 'group' }
    })

    dialogRef.afterClosed().subscribe(result => {
      if (!result) return
      if (result.expiration && result.expiration._i) {
        let fields = result.expiration._i
        result.expiration = fields.year + '-' + fields.month + '-' + fields.date
      }
      console.log(result)
    })
  }
}
