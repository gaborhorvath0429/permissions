import { Injectable } from '@angular/core'
import { BehaviorSubject, Observable } from 'rxjs'
import { GroupApiControllerService, UserApiControllerService,
  SystemApiControllerService, RightApiControllerService } from '../backend'
import { map } from 'rxjs/operators'
import * as _ from 'lodash'
import { SystemModel, GroupModel, UserModel, RightModel } from '../models'

@Injectable({
  providedIn: 'root'
})
export class RightsService {

  public users = new BehaviorSubject<UserModel[]>([])
  public userRights = new BehaviorSubject<RightModel[]>([])
  public groupRights = new BehaviorSubject<RightModel[]>([])
  public rights = new BehaviorSubject<RightModel[]>([])

  public selectedUser: UserModel | { displayName: string } = { displayName: '' }
  public selectedGroup: GroupModel | { groupName: string } = { groupName: '' }

  constructor(
    private rightService: RightApiControllerService,
    private groupService: GroupApiControllerService,
    private userService: UserApiControllerService,
    private systemService: SystemApiControllerService
  ) { }

  public getRights(): void {
    this.rightService.getGroupRights1().subscribe((rights: RightModel[]) => {
      this.rights.next(rights)
    })
  }

  public getSystems(): Observable<SystemModel[]> {
    return this.systemService.getSystems()
  }

  private transformToTree(arr: GroupModel[]): GroupModel[] {
    let nodes = {}
    return arr.filter(obj => {
        let id = obj.groupId
        let parentId = obj.parentGroupId

        nodes[id] = _.defaults(obj, nodes[id], { children: [] })
        if (parentId) (nodes[parentId] = (nodes[parentId] || { children: [] }))['children'].push(obj)

        return !parentId
    })
}

  public getGroups(): Observable<GroupModel[]> {
    return this.groupService.getGroups().pipe(
      map((groups: GroupModel[]): GroupModel[] => {
        return this.transformToTree(groups)
      })
    )
  }

  public getUsers(group: GroupModel): void {
    this.userService.getUsers(group.groupId).subscribe(
      users => this.users.next(users)
    )
  }

  public getUserRights(user: UserModel): void {
    this.selectedUser = user
    this.userService.getUserRights(user.userId).subscribe((rights: RightModel[]) => {
      this.userRights.next(this.getAllocatedRights(rights))
    })
  }

  public getGroupRights(group: GroupModel): void {
    this.selectedGroup = group
    this.groupService.getGroupRights(group.groupId).subscribe((rights: RightModel[]) => {
      this.groupRights.next(this.getAllocatedRights(rights))
    })
  }

  private getAllocatedRights(rights: RightModel[]): RightModel[] {
    let allocated = []
    _.cloneDeep(this.rights.value).forEach(right => {
      let allocatedRight = rights.find(e => e.rightId === right.rightId)
      if (allocatedRight) {
        allocatedRight.allocated = '1'
        allocated.push(allocatedRight)
      } else {
        right.allocated = '0'
        allocated.push(right)
      }
    })
    return allocated
  }

  public allocateRightForGroup(right: RightModel, fields: any): Observable<any> {
    let group = this.selectedGroup as GroupModel
    return this.groupService.setGroupRight(
      group.groupId,
      'ghorvath1', // TODO this parameter will be removed
      right.rightId,
      fields.ticket,
      fields.comment,
      fields.expiration
    )
  }

  public unAllocateRightForGroup(right: RightModel, fields: any): Observable<any> {
    let group = this.selectedGroup as GroupModel
    return this.groupService.deleteGroupRight(
      group.groupId,
      'ghorvath1', // TODO this parameter will be removed
      right.rightId,
      fields.ticket,
      fields.comment
    )
  }

  public allocateRightForUser(right: RightModel, fields: any): Observable<any> {
    let user = this.selectedUser as UserModel
    return this.userService.setUserRight(
      'ghorvath1', // TODO this parameter will be removed
      right.rightId,
      fields.ticket,
      user.userId,
      fields.comment,
      fields.expiration
    )
  }

  public unAllocateRightForUser(right: RightModel, fields: any): Observable<any> {
    let user = this.selectedUser as UserModel
    return this.userService.deleteUserRight(
      'ghorvath1', // TODO this parameter will be removed
      right.rightId,
      fields.ticket,
      user.userId,
      fields.comment
    )
  }
}
