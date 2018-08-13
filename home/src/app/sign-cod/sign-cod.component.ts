import { Component, OnInit, HostBinding } from '@angular/core';

import { slidePageAnimation } from '../animations';

@Component({
  selector: 'app-sign-cod',
  templateUrl: './sign-cod.component.html',
  styleUrls: ['./sign-cod.component.css'],
  animations: [ slidePageAnimation ]
})
export class SignCodComponent implements OnInit {
  @HostBinding('@routeAnimation') routeAnimation = true;
  @HostBinding('style.display')   display = 'block';

  constructor() { }

  ngOnInit() {
  }

}
