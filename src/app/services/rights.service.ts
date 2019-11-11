import { RightData } from './../rights-grid/rights-grid.component'
import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { BehaviorSubject } from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class RightsService {

  public userRights = new BehaviorSubject<RightData[]>([])

  constructor(private http: HttpClient) { }

  getUserRights() {
    let data = []
    for (let i = 0; i < 500; i++) {
      data.push({
        system: 'asd',
        name: 'dsgsdg',
        ticket: '4364',
        creator: 'SADG SADgdsh',
        createdAt: '2019-01-01',
        expireAt: '2019-12-31',
        description: '436437redhf'
      })
    }
    this.userRights.next(data)
  }
}
