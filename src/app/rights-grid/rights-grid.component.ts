import { Component, OnInit, Output, EventEmitter, ViewChildren, ViewChild, QueryList, ElementRef, Input } from '@angular/core'
import { MatTableDataSource } from '@angular/material/table'
import GridComponent from '../shared/grid.class'
import { RightsService } from '../services/rights.service'
import { MatCheckboxChange, MatRadioGroup, MatSelect, MatDialog } from '@angular/material'
import { SettingsDialogComponent } from '../settings-dialog/settings-dialog.component'
import * as _ from 'lodash'
import * as moment from 'moment'
import { RightModel, SystemModel } from '../models'

export interface ModifiedRight {
  type: 'allocated' | 'unallocated'
  right: RightModel
}

export interface FilterSettings {
  ticket?: string
  lastModBy?: string
  lastModDateFrom?: string
  lastModDateTo?: string
  expirationDateFrom?: string
  expirationDateTo?: string
}

@Component({
  selector: 'app-rights-grid',
  templateUrl: './rights-grid.component.html',
  styleUrls: ['./rights-grid.component.scss']
})
export class RightsGridComponent extends GridComponent implements OnInit {
  isLoading = false
  screenHeight = window.innerHeight
  displayedColumns: string[] = ['systemDescription', 'ticket', 'lastModBy', 'lastModDate', 'expiration', 'rightDescription', 'select']
  systems: SystemModel[] = []
  modified: ModifiedRight[] = []
  filterSettings: FilterSettings = {
    ticket: '',
    lastModBy: '',
    lastModDateFrom: '',
    lastModDateTo: '',
    expirationDateFrom: '',
    expirationDateTo: '',
  }

  @Input() type: 'group' | 'user'
  @Input() canCopy?: boolean // whether we want to show the copy rights button or not
  @Output() save = new EventEmitter<ModifiedRight>()
  @Output() copyRights = new EventEmitter()

  @ViewChild(MatRadioGroup) radioGroup: MatRadioGroup
  @ViewChildren('filter') filterFields: QueryList<ElementRef>

  constructor(private service: RightsService, public dialog: MatDialog) { super() }

  ngOnInit(): void {
    this.setData([])
    this.service.getSystems().subscribe(systems => this.systems = systems)
    this.service.isLoading.subscribe(loading => this.isLoading = loading)
  }

  // Assign the data to the data source for the table to render
  setData(data: RightModel[]): void {
    this.setDataSource(new MatTableDataSource(data))
    this.modified = []
    this.service.unsavedChanges = false
    data.forEach(right => {
      if (right.allocated === '1') this.selection.select(right)
    })
    this.service.isLoading.next(false)
  }

  showSettingsDialog(): void {
    const dialogRef = this.dialog.open(SettingsDialogComponent, {
      width: '500px',
      data: _.cloneDeep(this.filterSettings)
    })

    dialogRef.afterClosed().subscribe(result => {
      if (!result) return
      if (result.expiration) result.expiration = moment(result.expiration).format('YYYY-MM-DD')
      if (result.lastModDate) result.lastModDate = moment(result.lastModDate).format('YYYY-MM-DD')
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
      lastModBy: '',
      lastModDateFrom: '',
      lastModDateTo: '',
      expirationDateFrom: '',
      expirationDateTo: ''
    }
    this.radioGroup.value = 'all'
    this.filter = {}
    this.dataSource.filter = '{}'
  }

  checkRow(event: MatCheckboxChange, row: RightModel): void {
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
    this.service.unsavedChanges = Boolean(this.modified.length)
  }

  getColor(row: RightModel): string {
    let modified = this.modified.find(e => e.right === row)
    if (modified) {
      return modified.type === 'allocated' ? '#50e66e' : '#f57878'
    }
    return ''
  }
}
