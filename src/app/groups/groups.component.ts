import { Component, OnInit } from '@angular/core'
import { RightsService, TreeNode } from '../services/rights.service'
import { MatTreeNestedDataSource, MatIconRegistry } from '@angular/material'
import { NestedTreeControl } from '@angular/cdk/tree'

@Component({
  selector: 'app-groups',
  templateUrl: './groups.component.html',
  styleUrls: ['./groups.component.scss']
})
export class GroupsComponent implements OnInit {

  treeControl = new NestedTreeControl<TreeNode>(node => node.children)
  groups = new MatTreeNestedDataSource<TreeNode>()
  hasChild = (_: number, node: TreeNode) => !!node.children && node.children.length > 0

  constructor(private service: RightsService, private iconRegistry: MatIconRegistry) {
  }

  ngOnInit(): void {
    this.service.getGroups().subscribe(groups => this.groups.data = groups)
  }

  handleGroupClick(groupName: string): void {
    this.service.getUsers(groupName)
    this.service.getGroupRights(groupName)
  }
}
