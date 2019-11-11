import { RightsService } from './../services/rights.service'
import { Component, OnInit } from '@angular/core'

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {

  constructor(private service: RightsService) { }

  ngOnInit() {
  }

  getUserRights() {
    this.service.getUserRights()
  }

}
