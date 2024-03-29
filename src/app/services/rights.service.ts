import { Injectable } from '@angular/core'
import { BehaviorSubject, Observable } from 'rxjs'
import { GroupApiControllerService, UserApiControllerService,
  SystemApiControllerService, RightApiControllerService, ModelApiResponse } from '../backend'
import { map, tap } from 'rxjs/operators'
import * as _ from 'lodash'
import { SystemModel, GroupModel, UserModel, RightModel } from '../models'
import { MatDialog } from '@angular/material'
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component'

// Decorator function for detecting unsaved changes and prompting if we want to leave or not.
function CheckForUnsavedChanges(target: object, key: string | symbol, descriptor: PropertyDescriptor) {
  const original = descriptor.value
  descriptor.value = function(...args: any[]) {
    if (this.unsavedChanges) {
      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        width: '300px'
      })
      dialogRef.afterClosed().subscribe((result: boolean) => {
        if (result) original.apply(this, args)
      })
    } else {
      original.apply(this, args)
    }
  }
}

@Injectable({
  providedIn: 'root'
})
export class RightsService {
  public isLoading = new BehaviorSubject<boolean>(false)

  public users = new BehaviorSubject<UserModel[]>([])
  public groups = new BehaviorSubject<GroupModel[]>([])
  public userRights = new BehaviorSubject<RightModel[]>([])
  public groupRights = new BehaviorSubject<RightModel[]>([])
  public rights = new BehaviorSubject<RightModel[]>([])

  public selectedUser: UserModel | { displayName: string } = { displayName: '' }
  public selectedGroup: GroupModel | { groupName: string } = { groupName: '' }

  public unsavedChanges = false

  constructor(
    public dialog: MatDialog,
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
      tap((groups: GroupModel[]): void => this.groups.next(groups)),
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

  @CheckForUnsavedChanges
  public getUserRights(user: UserModel): void {
    this.isLoading.next(true)
    this.selectedUser = user
    this.userService.getUserRights(user.userId).subscribe((rights: RightModel[]) => {
      this.userRights.next(this.getAllocatedRights(rights))
    })
  }

  @CheckForUnsavedChanges
  public getGroupRights(group: GroupModel): void {
    this.isLoading.next(true)
    this.selectedGroup = group
    this.groupService.getGroupRights(group.groupId).subscribe((rights: RightModel[]) => {
      this.groupRights.next(this.getAllocatedRights(rights))
    })
  }

  public copyGroupRights(sourceGroupId: number, targetGroupId: number, fields: any): Observable<ModelApiResponse> {
    return this.groupService.copyGroupRights(targetGroupId, sourceGroupId, fields.ticket, fields.comment, fields.expiration)
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

  public allocateRightForGroup(right: RightModel, fields: any): Promise<ModelApiResponse> {
    let group = this.selectedGroup as GroupModel
    return this.groupService.setGroupRight(
      group.groupId,
      right.rightId,
      fields.ticket,
      fields.comment,
      fields.expiration
    ).toPromise()
  }

  public unAllocateRightForGroup(right: RightModel, fields: any): Promise<ModelApiResponse> {
    let group = this.selectedGroup as GroupModel
    return this.groupService.deleteGroupRight(
      group.groupId,
      right.rightId,
      fields.ticket,
      fields.comment
    ).toPromise()
  }

  public allocateRightForUser(right: RightModel, fields: any): Promise<ModelApiResponse> {
    let user = this.selectedUser as UserModel
    return this.userService.setUserRight(
      right.rightId,
      fields.ticket,
      user.userId,
      fields.comment,
      fields.expiration
    ).toPromise()
  }

  public unAllocateRightForUser(right: RightModel, fields: any): Promise<ModelApiResponse> {
    let user = this.selectedUser as UserModel
    return this.userService.deleteUserRight(
      right.rightId,
      fields.ticket,
      user.userId,
      fields.comment
    ).toPromise()
  }
}
