import { RightData, System, ModifiedRight } from './../rights-grid/rights-grid.component'
import { Injectable } from '@angular/core'
import { BehaviorSubject, of, Observable } from 'rxjs'
import { GroupService, UserService } from '../backend'
import { map } from 'rxjs/operators'
import * as _ from 'lodash'
export interface GroupNode {
  groupId: number
  groupName: string
  creationDate: string
  parentGroupId?: number
  children?: GroupNode[]
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

  public selectedUser: UserData | { name: string } = { name: '' }
  public selectedGroup: GroupNode | { groupName: string } = { groupName: '' }

  constructor(
    private groupService: GroupService,
    private userService: UserService
  ) { }

  public getSystems(): Observable<System[]> {
    return of([
      { id: '1', name: 'KSI Kollecto' },
      { id: '2', name: 'Faktor Kollecto' },
      { id: '3', name: 'I3 (core)' }
    ])
  }

  private transformToTree(arr: GroupNode[]): GroupNode[] {
    let nodes = {}
    return arr.filter(obj => {
        let id = obj.groupId
        let parentId = obj['parentGroupId']

        nodes[id] = _.defaults(obj, nodes[id], { children: [] })
        if (parentId) (nodes[parentId] = (nodes[parentId] || { children: [] }))['children'].push(obj)

        return !parentId
    })
}

  public getGroups(): Observable<GroupNode[]> {
    // this.groupService.getGroups().subscribe(data => console.log(data))

    let groups = [
      { creationDate: '2000-01-23T04:56:07.000+00:00', groupId: 1, groupName: 'group1', parentGroupId : 0 },
      { creationDate: '2000-01-23T04:56:07.000+00:00', groupId: 2, groupName: 'group2', parentGroupId : 0 },
      { creationDate: '2000-01-23T04:56:07.000+00:00', groupId: 3, groupName: 'group3', parentGroupId : 1 },
      { creationDate: '2000-01-23T04:56:07.000+00:00', groupId: 4, groupName: 'group4', parentGroupId : 1 },
      { creationDate: '2000-01-23T04:56:07.000+00:00', groupId: 5, groupName: 'group5', parentGroupId : 2 },
      { creationDate: '2000-01-23T04:56:07.000+00:00', groupId: 6, groupName: 'group6', parentGroupId : 2 },
      { creationDate: '2000-01-23T04:56:07.000+00:00', groupId: 7, groupName: 'group7', parentGroupId : 3 },
      { creationDate: '2000-01-23T04:56:07.000+00:00', groupId: 8, groupName: 'group8', parentGroupId : 7 },
      { creationDate: '2000-01-23T04:56:07.000+00:00', groupId: 9, groupName: 'group9', parentGroupId : 5 },
      { creationDate: '2000-01-23T04:56:07.000+00:00', groupId: 10, groupName: 'group10', parentGroupId : 6 }
    ]

    return of(this.transformToTree(groups))
  }

  public getUsers(group: GroupNode): void {
    this.users.next([
      { name: 'Jóska', opid: 'joska' },
      { name: 'Feri', opid: 'feri' },
      { name: 'Dezső', opid: 'dezso' },
      { name: 'Béla', opid: 'bela' }
    ])
  }

  public getUserRights(user: UserData): void {
    this.selectedUser = user
    let data = []
    for (let i = 0; i < 500; i++) {
      data.push({
        id: i,
        allocated: '1',
        system: 'KSI Kollecto',
        name: 'dsgsdg',
        ticket: '4364',
        createdBy: 'SADG SADgdsh',
        creationDate: '2019-01-01',
        expiration: '2019-12-31',
        rightDescription: '436437redhf'
      })
    }
    this.userRights.next(data)
  }

  public getGroupRights(group: GroupNode): void {
    this.selectedGroup = group
    let data = []
    for (let i = 0; i < 500; i++) {
      data.push({
        id: i,
        allocated: '0',
        system: 'Faktor Kollecto',
        name: 'bvnvbn',
        ticket: '658',
        createdBy: 'fgj fjg',
        creationDate: '2019-02-01',
        expiration: '2019-11-31',
        rightDescription: 'dfhfgh'
      })
    }
    this.groupRights.next(data)
  }

  public allocateRightForGroup(right: RightData, fields: any): void {
    let group = this.selectedGroup
    console.log('ALLOCATING', right)
  }

  public unAllocateRightForGroup(right: RightData, fields: any): void {
    let group = this.selectedGroup
    console.log('UNALLOCATING', right)
  }

  public allocateRightForUser(right: RightData, fields: any): void {
    let user = this.selectedUser
    console.log('ALLOCATING', right)
  }

  public unAllocateRightForUser(right: RightData, fields: any): void {
    let user = this.selectedUser
    console.log('UNALLOCATING', right)
  }
}
