import { Component, OnInit, HostBinding } from '@angular/core';

import { slidePageAnimation } from '../animations';

@Component({
  selector: 'app-sign-xml-server',
  templateUrl: './sign-xml-server.component.html',
  styleUrls: ['./sign-xml-server.component.css'],
  animations: [ slidePageAnimation ]
})
export class SignXmlServerComponent implements OnInit {
  @HostBinding('@routeAnimation') routeAnimation = true;
  @HostBinding('style.display')   display = 'block';

  constructor() { }

  ngOnInit() {
  }

}
