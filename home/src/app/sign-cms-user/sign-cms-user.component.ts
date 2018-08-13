import { Component, OnInit, HostBinding } from '@angular/core';

import { slidePageAnimation } from '../animations';

@Component({
  selector: 'app-sign-cms-user',
  templateUrl: './sign-cms-user.component.html',
  styleUrls: ['./sign-cms-user.component.css'],
  animations: [ slidePageAnimation ]
})
export class SignCmsUserComponent implements OnInit {
  @HostBinding('@routeAnimation') routeAnimation = true;
  @HostBinding('style.display')   display = 'block';

  constructor() { }

  ngOnInit() {
  }

}
