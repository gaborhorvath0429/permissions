import { Component, OnInit } from '@angular/core'
import { RightsService } from '../services/rights.service'
import { MatTreeNestedDataSource } from '@angular/material'
import { NestedTreeControl } from '@angular/cdk/tree'
import * as _ from 'lodash'
import { GroupDTO } from '../backend'
@Component({
  selector: 'app-groups',
  templateUrl: './groups.component.html',
  styleUrls: ['./groups.component.scss']
})
export class GroupsComponent implements OnInit {

  treeControl = new NestedTreeControl<GroupDTO>(node => node.children)
  clonedTree: GroupDTO[]
  groups = new MatTreeNestedDataSource<GroupDTO>()
  hasChild = (index: number, node: GroupDTO) => !!node.children && node.children.length > 0

  constructor(private service: RightsService) { }

  ngOnInit(): void {
    this.service.getGroups().subscribe(groups => {
      this.groups.data = groups
      this.treeControl.dataNodes = groups
      this.clonedTree = groups
    })
  }

  handleGroupClick(group: GroupDTO): void {
    this.service.getUsers(group)
    this.service.getGroupRights(group)
  }

  search(value: string): void {
    const clonedTreeLocal = _.cloneDeep(this.clonedTree)
    this.recursiveNodeEliminator(clonedTreeLocal, value)
    this.groups.data = clonedTreeLocal
    this.treeControl.dataNodes = clonedTreeLocal
    value ? this.treeControl.expandAll() : this.treeControl.collapseAll()
  }

  recursiveNodeEliminator(tree: GroupDTO[], search: string): boolean {
    for (let index = tree.length - 1; index >= 0; index--) {
      const node = tree[index]
      if (node.children) {
        const parentCanBeEliminated = this.recursiveNodeEliminator(node.children, search)
        if (parentCanBeEliminated) {
          if (node.groupName.toLocaleLowerCase().indexOf(search.toLocaleLowerCase()) === -1) {
            tree.splice(index, 1)
          }
        }
      } else {
        // Its a leaf node. No more branches.
        if (node.groupName.toLocaleLowerCase().indexOf(search.toLocaleLowerCase()) === -1) {
          tree.splice(index, 1)
        }
      }
    }
    return tree.length === 0
  }
}
