import { MatTableDataSource, MatPaginator, MatSort, MatRadioButton, MatSelect } from '@angular/material'
import { SelectionModel } from '@angular/cdk/collections'
import { ViewChild } from '@angular/core'
import * as _ from 'lodash'

export default class GridComponent {
  dataSource: MatTableDataSource<any>
  filter: any
  selection = new SelectionModel<any>(true, [])

  @ViewChild(MatPaginator) paginator: MatPaginator
  @ViewChild(MatSort) sort: MatSort

  setDataSource(dataSource: any): void {
    const filterClone = this.dataSource ? _.clone(this.dataSource.filter) : '{}'
    this.dataSource = dataSource
    this.dataSource.paginator = this.paginator
    this.dataSource.sort = this.sort
    this.dataSource.filterPredicate = (data: any, filters: string) => {
      const parsedFilters = JSON.parse(filters)

      return Object.keys(parsedFilters)
        .map(column => {
          if (!data[column] || !parsedFilters[column]) return false
          return data[column].toLowerCase().includes(parsedFilters[column].toLowerCase())
        })
        .every(Boolean)
    }
    this.dataSource.filter = filterClone
  }

  isAllSelected(): boolean {
    const numSelected = this.selection.selected.length
    const numRows = this.dataSource.data.length
    return numSelected === numRows
  }

  masterToggle(): void {
    this.isAllSelected() ?
        this.selection.clear() :
        this.dataSource.data.forEach(row => this.selection.select(row))
  }

  checkboxLabel(row?: any): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`
  }

  applyFilter(filterValue: any, column: string): void {
    if (filterValue.source) {
      if (filterValue.source instanceof MatSelect) {
        filterValue = filterValue.source.selected.viewValue
        if (filterValue === 'All') filterValue = ''
      } else if (filterValue.source instanceof MatRadioButton) {
        filterValue = filterValue.value
        if (filterValue === 'all') filterValue = ''
      }
    }
    this.filter = {
      ...this.filter,
      [column]: filterValue
    }

    if (!filterValue) delete this.filter[column]

    this.dataSource.filter = JSON.stringify(this.filter)
  }
}
