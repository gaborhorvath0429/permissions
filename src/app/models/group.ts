export interface GroupModel {
  children?: GroupModel[]
  creationDate?: string
  groupId?: number
  groupName?: string
  parentGroupId?: number
}
