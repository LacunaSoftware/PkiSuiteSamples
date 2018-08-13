import { Component, OnInit, HostBinding } from '@angular/core';

import { slidePageAnimation } from '../animations';

@Component({
  selector: 'app-sign-cms-server',
  templateUrl: './sign-cms-server.component.html',
  styleUrls: ['./sign-cms-server.component.css'],
  animations: [ slidePageAnimation ]
})
export class SignCmsServerComponent implements OnInit {
  @HostBinding('@routeAnimation') routeAnimation = true;
  @HostBinding('style.display')   display = 'block';

  constructor() { }

  ngOnInit() {
  }

}
