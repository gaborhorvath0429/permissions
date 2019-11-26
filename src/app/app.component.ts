import { Component, OnInit } from '@angular/core'
import { RightsService } from './services/rights.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  constructor(private rightService: RightsService) { }

  ngOnInit(): void {
    this.rightService.getRights()
  }
}
