import { Component, OnInit, HostBinding } from '@angular/core';

import { slidePageAnimation } from '../animations';

@Component({
  selector: 'app-sign-xml-user',
  templateUrl: './sign-xml-user.component.html',
  styleUrls: ['./sign-xml-user.component.css'],
  animations: [ slidePageAnimation ]
})
export class SignXmlUserComponent implements OnInit {
  @HostBinding('@routeAnimation') routeAnimation = true;
  @HostBinding('style.display')   display = 'block';

  constructor() { }

  ngOnInit() {
  }

}
