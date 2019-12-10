import { Component, OnInit } from '@angular/core'
import { RightsService } from './services/rights.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  groupRightsHidden = false
  userRightsHidden = true

  constructor(private rightService: RightsService) { }

  ngOnInit(): void {
    this.rightService.getRights()
    this.rightService.userRights.subscribe(() => {
      this.groupRightsHidden = true
      this.userRightsHidden = false
    })
    this.rightService.groupRights.subscribe(() => {
      this.userRightsHidden = true
      this.groupRightsHidden = false
    })
  }
}
