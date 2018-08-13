import { Component, OnInit, HostBinding } from '@angular/core';

import { slidePageAnimation } from '../animations';

@Component({
  selector: 'app-printer-friendly',
  templateUrl: './printer-friendly.component.html',
  styleUrls: ['./printer-friendly.component.css'],
  animations: [ slidePageAnimation ]
})
export class PrinterFriendlyComponent implements OnInit {
  @HostBinding('@routeAnimation') routeAnimation = true;
  @HostBinding('style.display')   display = 'block';

  constructor() { }

  ngOnInit() {
  }

}
