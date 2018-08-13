import { Component, OnInit, HostBinding } from '@angular/core';

import { slidePageAnimation } from '../animations';

@Component({
  selector: 'app-auth-cert',
  templateUrl: './auth-cert.component.html',
  styleUrls: ['./auth-cert.component.css'],
  animations: [ slidePageAnimation ]
})
export class AuthCertComponent implements OnInit {
  @HostBinding('@routeAnimation') routeAnimation = true;
  @HostBinding('style.display')   display = 'block';

  constructor() { }

  ngOnInit() {
  }

}
