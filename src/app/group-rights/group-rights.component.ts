import { RightsGridComponent } from './../rights-grid/rights-grid.component'
import { Component, ViewChild, AfterViewInit } from '@angular/core'
import { RightsService } from '../services/rights.service'

@Component({
  selector: 'app-group-rights',
  templateUrl: './group-rights.component.html',
  styleUrls: ['./group-rights.component.scss']
})
export class GroupRightsComponent implements AfterViewInit {

  @ViewChild(RightsGridComponent) grid: RightsGridComponent

  constructor(private service: RightsService) { }

  ngAfterViewInit(): void {

  }

}
