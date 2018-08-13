import { Component, OnInit, HostBinding } from '@angular/core';

import { slidePageAnimation } from '../animations';
import { PayOptionsService } from '../pay-options.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  animations: [ slidePageAnimation ]
})
export class HomeComponent implements OnInit {
  @HostBinding('@routeAnimation') routeAnimation = true;
  @HostBinding('style.display')   display = 'block';

  public choice: string;

  constructor(private payOptions: PayOptionsService) {

  }

  ngOnInit() {
    this.payOptions.choiceStore.subscribe((data) => {
      this.choice = data;
    });
  }

}
