import {Component, OnInit} from '@angular/core'
import {MatTableDataSource} from '@angular/material/table'
import GridComponent from '../shared/grid.class'

export interface RightData {
  system: string
  name: string
  ticket: string
  creator: string
  createdAt: string
  expireAt: string
  description: string
}

@Component({
  selector: 'app-rights-grid',
  templateUrl: './rights-grid.component.html',
  styleUrls: ['./rights-grid.component.scss']
})
export class RightsGridComponent extends GridComponent implements OnInit {
  displayedColumns: string[] = ['system', 'name', 'ticket', 'creator', 'createdAt', 'expireAt', 'description', 'select']

  constructor() {
    super()
  }

  ngOnInit(): void {
    this.setData([])
  }

  // Assign the data to the data source for the table to render
  setData(data: RightData[]): void {
    this.setDataSource(new MatTableDataSource(data))
  }
}
