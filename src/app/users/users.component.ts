import { RightsService, UserData } from './../services/rights.service'
import { Component, OnInit } from '@angular/core'

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {

  users: UserData[] = []

  constructor(private service: RightsService) { }

  ngOnInit() {
    this.service.users.subscribe(users => this.users = users)
  }

  getUserRights(opid: string) {
    this.service.getUserRights(opid)
  }

}
