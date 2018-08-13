import { Component, OnInit, HostBinding } from '@angular/core';

import { slidePageAnimation } from '../animations';

@Component({
  selector: 'app-sign-multi-cms-server',
  templateUrl: './sign-multi-cms-server.component.html',
  styleUrls: ['./sign-multi-cms-server.component.css'],
  animations: [ slidePageAnimation ]
})
export class SignMultiCmsServerComponent implements OnInit {
  @HostBinding('@routeAnimation') routeAnimation = true;
  @HostBinding('style.display')   display = 'block';

  constructor() { }

  ngOnInit() {
  }

}
