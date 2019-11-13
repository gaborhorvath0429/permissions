import { RightData, System } from './../rights-grid/rights-grid.component'
import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { BehaviorSubject, of, Observable } from 'rxjs'

export interface TreeNode {
  name: string
  children?: TreeNode[]
}

export interface UserData {
  opid: string
  name: string
}
@Injectable({
  providedIn: 'root'
})
export class RightsService {

  public users = new BehaviorSubject<UserData[]>([])
  public userRights = new BehaviorSubject<RightData[]>([])
  public groupRights = new BehaviorSubject<RightData[]>([])

  public selectedUser = new BehaviorSubject<string>('')
  public selectedGroup = new BehaviorSubject<string>('')

  constructor(private http: HttpClient) { }

  public getSystems(): Observable<System[]> {
    return of([
      { id: '1', name: 'KSI Kollecto' },
      { id: '2', name: 'Faktor Kollecto' },
      { id: '3', name: 'I3 (core)' }
    ])
  }

  public getGroups(): Observable<TreeNode[]> {
    return of([
      {
        name: 'Fruit',
        children: [
          {name: 'Apple'},
          {name: 'Banana'},
          {name: 'Fruit loops'},
        ]
      }, {
        name: 'Vegetables',
        children: [
          {
            name: 'Green',
            children: [
              {name: 'Broccoli'},
              {name: 'Brussel sprouts'},
            ]
          }, {
            name: 'Orange',
            children: [
              {name: 'Pumpkins'},
              {name: 'Carrots'},
            ]
          },
        ]
      },
    ])
  }

  public getUsers(group: TreeNode): void {
    this.users.next([
      { name: 'Jóska', opid: 'joska' },
      { name: 'Feri', opid: 'feri' },
      { name: 'Dezső', opid: 'dezso' },
      { name: 'Béla', opid: 'bela' }
    ])
  }

  public getUserRights(user: UserData): void {
    this.selectedUser.next(user.name)
    let data = []
    for (let i = 0; i < 500; i++) {
      data.push({
        id: i,
        allocated: '1',
        system: 'KSI Kollecto',
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

  public getGroupRights(group: TreeNode): void {
    this.selectedGroup.next(group.name)
    let data = []
    for (let i = 0; i < 500; i++) {
      data.push({
        id: i,
        allocated: '0',
        system: 'Faktor Kollecto',
        name: 'bvnvbn',
        ticket: '658',
        creator: 'fgj fjg',
        createdAt: '2019-02-01',
        expireAt: '2019-11-31',
        description: 'dfhfgh'
      })
    }
    this.groupRights.next(data)
  }
}
