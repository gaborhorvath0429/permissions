import { RightsService } from './../services/rights.service'
import { Component, AfterViewInit, ViewChild } from '@angular/core'
import { RightsGridComponent, ModifiedRight } from '../rights-grid/rights-grid.component'
import { MatDialog } from '@angular/material'
import { SaveDialogComponent } from '../save-dialog/save-dialog.component'

@Component({
  selector: 'app-user-rights',
  templateUrl: './user-rights.component.html',
  styleUrls: ['./user-rights.component.scss']
})
export class UserRightsComponent implements AfterViewInit {

  selectedUserName = ''

  @ViewChild(RightsGridComponent) grid: RightsGridComponent

  constructor(private service: RightsService, public dialog: MatDialog) { }

  ngAfterViewInit(): void {
    this.service.userRights.subscribe(rights => this.grid.setData(rights))
    this.service.selectedUser.subscribe(name => this.selectedUserName = name)
  }

  showSaveDialog(modified: ModifiedRight): void {
    const dialogRef = this.dialog.open(SaveDialogComponent, {
      width: '250px',
      data: { modified, type: 'user' }
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
