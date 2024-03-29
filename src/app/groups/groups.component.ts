import { Component, OnInit, Input } from '@angular/core'
import { RightsService } from '../services/rights.service'
import { MatTreeNestedDataSource } from '@angular/material'
import { NestedTreeControl } from '@angular/cdk/tree'
import * as _ from 'lodash'
import { GroupModel } from '../models'
@Component({
  selector: 'app-groups',
  templateUrl: './groups.component.html',
  styleUrls: ['./groups.component.scss']
})
export class GroupsComponent implements OnInit {

  @Input() toolbar = true // whether we want to show the toolbar or not
  treeControl = new NestedTreeControl<GroupModel>(node => node.children)
  clonedTree: GroupModel[]
  groups = new MatTreeNestedDataSource<GroupModel>()
  hasChild = (index: number, node: GroupModel) => !!node.children && node.children.length > 0

  constructor(private service: RightsService) { }

  ngOnInit(): void {
    this.service.getGroups().subscribe(groups => {
      this.groups.data = groups
      this.treeControl.dataNodes = groups
      this.clonedTree = groups
    })
  }

  handleGroupClick(group: GroupModel): void {
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

  recursiveNodeEliminator(tree: GroupModel[], search: string): boolean {
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
