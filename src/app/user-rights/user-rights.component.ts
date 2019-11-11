import { RightsService } from './../services/rights.service'
import { Component, AfterViewInit, ViewChild } from '@angular/core'
import { RightsGridComponent } from '../rights-grid/rights-grid.component'

@Component({
  selector: 'app-user-rights',
  templateUrl: './user-rights.component.html',
  styleUrls: ['./user-rights.component.scss']
})
export class UserRightsComponent implements AfterViewInit {

  @ViewChild(RightsGridComponent) grid: RightsGridComponent

  constructor(private service: RightsService) { }

  ngAfterViewInit() {
    this.service.userRights.subscribe(rights => this.grid.setData(rights))
  }

}
