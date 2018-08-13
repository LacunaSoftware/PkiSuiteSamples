import { Component, OnInit, HostBinding } from '@angular/core';

import { slidePageAnimation } from '../animations';

@Component({
  selector: 'app-sign-multi-cms-user',
  templateUrl: './sign-multi-cms-user.component.html',
  styleUrls: ['./sign-multi-cms-user.component.css'],
  animations: [ slidePageAnimation ]
})
export class SignMultiCmsUserComponent implements OnInit {
  @HostBinding('@routeAnimation') routeAnimation = true;
  @HostBinding('style.display')   display = 'block';

  constructor() { }

  ngOnInit() {
  }

}
