import { RightsService } from './../services/rights.service'
import { Component, OnInit } from '@angular/core'
import { UserDTO } from '../backend'

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {

  users: UserDTO[] = []
  search = ''

  constructor(private service: RightsService) { }

  ngOnInit() {
    this.service.users.subscribe(users => this.users = users)
  }

  getUserRights(user: UserDTO) {
    this.service.getUserRights(user)
  }

}
