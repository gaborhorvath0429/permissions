import { RightsService } from './../services/rights.service'
import { Component, OnInit } from '@angular/core'
import { UserModel } from '../models'

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  users: UserModel[] = []
  search = ''

  constructor(private service: RightsService) { }

  ngOnInit() {
    this.service.users.subscribe(users => this.users = users)
  }

  getUserRights(user: UserModel) {
    this.service.getUserRights(user)
  }
}
