import { RightsService, UserData } from './../services/rights.service'
import { Component, OnInit } from '@angular/core'

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {

  users: UserData[] = []
  search = ''

  constructor(private service: RightsService) { }

  ngOnInit() {
    this.service.users.subscribe(users => this.users = users)
  }

  getUserRights(user: UserData) {
    this.service.getUserRights(user)
  }

}
