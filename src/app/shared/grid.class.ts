import { MatTableDataSource, MatPaginator, MatSort, MatRadioButton, MatSelect } from '@angular/material'
import { SelectionModel } from '@angular/cdk/collections'
import { ViewChild } from '@angular/core'
import * as _ from 'lodash'
import * as moment from 'moment'

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
          if (!parsedFilters[column]) return false
          if (column.includes('DateFrom')) {
            return data[column.replace('From', '')] >= parsedFilters[column]
          }
          if (column.includes('DateTo')) {
            return data[column.replace('To', '')] <= parsedFilters[column]
          }
          return data[column] && data[column].toLowerCase().includes(parsedFilters[column].toLowerCase())
        })
        .every(Boolean)
    }
    this.dataSource.filter = filterClone
  }

  applyFilter(filterValue: any, column: string): void {
    if (filterValue && filterValue.source) {
      if (filterValue.source instanceof MatSelect) {
        filterValue = filterValue.source.selected.viewValue
        if (filterValue === 'All') filterValue = ''
      } else if (filterValue.source instanceof MatRadioButton) {
        filterValue = filterValue.value
        if (filterValue === 'all') filterValue = ''
      }
    }

    if (moment.isMoment(filterValue)) filterValue = moment(filterValue).format('YYYY-MM-DD')

    this.filter = {
      ...this.filter,
      [column]: filterValue
    }

    if (!filterValue) delete this.filter[column]

    this.dataSource.filter = JSON.stringify(this.filter)
  }
}
