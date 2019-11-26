import { Component, OnInit, Output, EventEmitter, ViewChildren, ViewChild, QueryList, ElementRef, Input } from '@angular/core'
import { MatTableDataSource } from '@angular/material/table'
import GridComponent from '../shared/grid.class'
import { RightsService } from '../services/rights.service'
import { MatCheckboxChange, MatRadioGroup, MatSelect, MatDialog } from '@angular/material'
import { SettingsDialogComponent } from '../settings-dialog/settings-dialog.component'
import * as _ from 'lodash'
import * as moment from 'moment'
import { SystemDTO, RightDTO } from '../backend'

export interface ModifiedRight {
  type: 'allocated' | 'unallocated'
  right: RightDTO
}

export interface FilterSettings {
  ticket?: string
  createdBy?: string
  creationDate?: string
  expiration?: string
  rightDescription?: string
}

@Component({
  selector: 'app-rights-grid',
  templateUrl: './rights-grid.component.html',
  styleUrls: ['./rights-grid.component.scss']
})
export class RightsGridComponent extends GridComponent implements OnInit {
  screenHeight = window.innerHeight
  displayedColumns: string[] = ['system', 'name', 'ticket', 'createdBy', 'creationDate', 'expiration', 'rightDescription', 'select']
  systems: SystemDTO[] = []
  modified: ModifiedRight[] = []
  filterSettings: FilterSettings = {
    ticket: '',
    createdBy: '',
    creationDate: '',
    expiration: '',
    rightDescription: ''
  }

  @Input() type: 'group' | 'user'
  @Output() save = new EventEmitter<ModifiedRight>()

  @ViewChild(MatRadioGroup) radioGroup: MatRadioGroup
  @ViewChildren('filter') filterFields: QueryList<ElementRef>

  constructor(private service: RightsService, public dialog: MatDialog) { super() }

  ngOnInit(): void {
    this.setData([])
    this.service.getSystems().subscribe(systems => this.systems = systems)
  }

  // Assign the data to the data source for the table to render
  setData(data: RightDTO[]): void {
    this.setDataSource(new MatTableDataSource(data))
    data.forEach(right => {
      if (right.allocated === '1') this.selection.select(right)
    })
  }

  showSettingsDialog(): void {
    const dialogRef = this.dialog.open(SettingsDialogComponent, {
      width: '270px',
      data: _.cloneDeep(this.filterSettings)
    })

    dialogRef.afterClosed().subscribe(result => {
      if (!result) return
      if (result.expiration) result.expiration = moment(result.expiration).format('YYYY-MM-DD')
      if (result.creationDate) result.creationDate = moment(result.creationDate).format('YYYY-MM-DD')
      this.filterSettings = result
      Object.keys(result).forEach(key => this.applyFilter(result[key], key))
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
    this.filterSettings = {
      ticket: '',
      createdBy: '',
      creationDate: '',
      expiration: '',
      rightDescription: ''
    }
    this.radioGroup.value = 'all'
    this.filter = {}
    this.dataSource.filter = '{}'
  }

  checkRow(event: MatCheckboxChange, row: RightDTO): void {
    this.selection.toggle(row)
    if (row.allocated === '1' && event.checked === false) {
      this.modified.push({ type: 'unallocated', right: row })
    } else if (row.allocated === '0' && event.checked === true) {
      this.modified.push({ type: 'allocated', right: row })
    } else if (row.allocated === '0' && event.checked === false) {
      this.modified = _.reject(this.modified, { right: row })
    } else if (row.allocated === '1' && event.checked === true) {
      this.modified = _.reject(this.modified, { right: row })
    }
  }

  getColor(row: RightDTO): string {
    let modified = this.modified.find(e => e.right === row)
    if (modified) {
      return modified.type === 'allocated' ? '#50e66e' : '#f57878'
    }
    return ''
  }
}
