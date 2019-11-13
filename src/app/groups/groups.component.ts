import { Component, OnInit } from '@angular/core'
import { RightsService, TreeNode } from '../services/rights.service'
import { MatTreeNestedDataSource, MatIconRegistry } from '@angular/material'
import { NestedTreeControl } from '@angular/cdk/tree'
import * as _ from 'lodash'
@Component({
  selector: 'app-groups',
  templateUrl: './groups.component.html',
  styleUrls: ['./groups.component.scss']
})
export class GroupsComponent implements OnInit {

  treeControl = new NestedTreeControl<TreeNode>(node => node.children)
  clonedTree: TreeNode[]
  groups = new MatTreeNestedDataSource<TreeNode>()
  hasChild = (index: number, node: TreeNode) => !!node.children && node.children.length > 0

  constructor(private service: RightsService) { }

  ngOnInit(): void {
    this.service.getGroups().subscribe(groups => {
      this.groups.data = groups
      this.treeControl.dataNodes = groups
      this.clonedTree = groups
    })
  }

  handleGroupClick(group: TreeNode): void {
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

  recursiveNodeEliminator(tree: TreeNode[], search: string): boolean {
    for (let index = tree.length - 1; index >= 0; index--) {
      const node = tree[index]
      if (node.children) {
        const parentCanBeEliminated = this.recursiveNodeEliminator(node.children, search)
        if (parentCanBeEliminated) {
          if (node.name.toLocaleLowerCase().indexOf(search.toLocaleLowerCase()) === -1) {
            tree.splice(index, 1)
          }
        }
      } else {
        // Its a leaf node. No more branches.
        if (node.name.toLocaleLowerCase().indexOf(search.toLocaleLowerCase()) === -1) {
          tree.splice(index, 1)
        }
      }
    }
    return tree.length === 0
  }
}
