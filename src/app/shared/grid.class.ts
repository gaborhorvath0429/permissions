import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material'
import { SelectionModel } from '@angular/cdk/collections'
import { ViewChild } from '@angular/core'

export default class GridComponent {
  dataSource: MatTableDataSource<any>
  filter: any
  selection = new SelectionModel<any>(true, [])

  @ViewChild(MatPaginator) paginator: MatPaginator
  @ViewChild(MatSort) sort: MatSort

  setDataSource(dataSource: any) {
    this.dataSource = dataSource
    this.dataSource.paginator = this.paginator
    this.dataSource.sort = this.sort
    this.dataSource.filterPredicate = (data: any, filters: string) => {
      const parsedFilters = JSON.parse(filters)

      return Object.keys(parsedFilters)
        .map(column => data[column].toLowerCase().includes(parsedFilters[column].toLowerCase()))
        .reduce((acc: boolean, curr: boolean) => (acc = curr) && acc, true)
    }
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length
    const numRows = this.dataSource.data.length
    return numSelected === numRows
  }

  masterToggle() {
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

  applyFilter(filterValue: string, column: string) {
    this.filter = {
      ...this.filter,
      [column]: filterValue
    }

    if (!filterValue) delete this.filter[column]

    this.dataSource.filter = JSON.stringify(this.filter)
  }
}
