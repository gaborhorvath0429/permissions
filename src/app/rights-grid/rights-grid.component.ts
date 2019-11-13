import { Component, OnInit, Output, EventEmitter, ViewChildren, ViewChild, QueryList, ElementRef } from '@angular/core'
import { MatTableDataSource } from '@angular/material/table'
import GridComponent from '../shared/grid.class'
import { RightsService } from '../services/rights.service'
import { MatCheckboxChange, MatRadioGroup, MatSelect } from '@angular/material'
import * as _ from 'lodash'

export interface RightData {
  id: number
  allocated: string
  system: string
  name: string
  ticket: string
  creator: string
  createdAt: string
  expireAt: string
  description: string
  color?: string
}

export interface System {
  id: string
  name: string
}

export interface ModifiedRight {
  type: 'allocated' | 'unallocated'
  right: RightData
}

@Component({
  selector: 'app-rights-grid',
  templateUrl: './rights-grid.component.html',
  styleUrls: ['./rights-grid.component.scss']
})
export class RightsGridComponent extends GridComponent implements OnInit {
  displayedColumns: string[] = ['system', 'name', 'ticket', 'creator', 'createdAt', 'expireAt', 'description', 'select']
  systems: System[] = []
  modified: ModifiedRight[] = []

  @Output() save = new EventEmitter<ModifiedRight>()

  @ViewChild(MatRadioGroup) radioGroup: MatRadioGroup
  @ViewChildren('filter') filterFields: QueryList<ElementRef>

  constructor(private service: RightsService) { super() }

  ngOnInit(): void {
    this.setData([])
    this.service.getSystems().subscribe(systems => this.systems = systems)
  }

  // Assign the data to the data source for the table to render
  setData(data: RightData[]): void {
    this.setDataSource(new MatTableDataSource(data))
    data.forEach(right => {
      if (right.allocated === '1') this.selection.select(right)
    })
  }

  clearFilters(): void {
    this.filterFields.forEach(field => {
      if (field instanceof MatSelect) {
        field.value = 'all'
      } else if (field.nativeElement) {
        field.nativeElement.value = ''
      }
    })
    this.radioGroup.value = 'all'
    this.filter = {}
    this.dataSource.filter = '{}'
  }

  checkRow(event: MatCheckboxChange, row: RightData): void {
    this.selection.toggle(row)
    if (row.allocated === '1' && event.checked === false) {
      this.modified.push({ type: 'unallocated', right: row })
      row.color = '#f57878'
    } else if (row.allocated === '0' && event.checked === true) {
      this.modified.push({ type: 'allocated', right: row })
      row.color = '#50e66e'
    } else if (row.allocated === '0' && event.checked === false) {
      this.modified = _.reject(this.modified, { right: row })
      row.color = ''
    } else if (row.allocated === '1' && event.checked === true) {
      this.modified = _.reject(this.modified, { right: row })
      row.color = ''
    }
  }
}
