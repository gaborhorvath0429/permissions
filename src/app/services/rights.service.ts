import { Injectable } from '@angular/core'
import { BehaviorSubject, Observable } from 'rxjs'
import { GroupApiControllerService, UserApiControllerService, UserDTO,
  GroupDTO, SystemDTO, SystemApiControllerService, RightDTO,
  RightApiControllerService } from '../backend'
import { map } from 'rxjs/operators'
import * as _ from 'lodash'

@Injectable({
  providedIn: 'root'
})
export class RightsService {

  public users = new BehaviorSubject<UserDTO[]>([])
  public userRights = new BehaviorSubject<RightDTO[]>([])
  public groupRights = new BehaviorSubject<RightDTO[]>([])
  public rights = new BehaviorSubject<RightDTO[]>([])

  public selectedUser: UserDTO | { displayName: string } = { displayName: '' }
  public selectedGroup: GroupDTO | { groupName: string } = { groupName: '' }

  constructor(
    private rightService: RightApiControllerService,
    private groupService: GroupApiControllerService,
    private userService: UserApiControllerService,
    private systemService: SystemApiControllerService
  ) { }

  public getRights(): void {
    this.rightService.getGroupRights1().subscribe((rights: RightDTO[]) => {
      this.rights.next(rights)
    })
  }

  public getSystems(): Observable<SystemDTO[]> {
    return this.systemService.getSystems()
  }

  private transformToTree(arr: GroupDTO[]): GroupDTO[] {
    let nodes = {}
    return arr.filter(obj => {
        let id = obj.groupId
        let parentId = obj.parentGroupId

        nodes[id] = _.defaults(obj, nodes[id], { children: [] })
        if (parentId) (nodes[parentId] = (nodes[parentId] || { children: [] }))['children'].push(obj)

        return !parentId
    })
}

  public getGroups(): Observable<GroupDTO[]> {
    return this.groupService.getGroups().pipe(
      map((groups: GroupDTO[]): GroupDTO[] => {
        return this.transformToTree(groups)
      })
    )
  }

  public getUsers(group: GroupDTO): void {
    this.userService.getUsers(group.groupId).subscribe(
      users => this.users.next(users)
    )
  }

  public getUserRights(user: UserDTO): void {
    this.selectedUser = user
    this.userService.getUserRights(user.userId).subscribe((rights: RightDTO[]) => {
      this.userRights.next(this.getAllocatedRights(rights))
    })
  }

  public getGroupRights(group: GroupDTO): void {
    this.selectedGroup = group
    this.groupService.getGroupRights(group.groupId).subscribe((rights: RightDTO[]) => {
      this.groupRights.next(this.getAllocatedRights(rights))
    })
  }

  private getAllocatedRights(rights: RightDTO[]): RightDTO[] {
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

  public allocateRightForGroup(right: RightDTO, fields: any): void {
    let group = this.selectedGroup
    console.log('ALLOCATING', right)
  }

  public unAllocateRightForGroup(right: RightDTO, fields: any): void {
    let group = this.selectedGroup
    console.log('UNALLOCATING', right)
  }

  public allocateRightForUser(right: RightDTO, fields: any): void {
    let user = this.selectedUser
    console.log('ALLOCATING', right)
  }

  public unAllocateRightForUser(right: RightDTO, fields: any): void {
    let user = this.selectedUser
    console.log('UNALLOCATING', right)
  }
}
