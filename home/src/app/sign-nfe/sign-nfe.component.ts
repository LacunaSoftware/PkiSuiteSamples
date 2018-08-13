import { Component, OnInit, HostBinding } from '@angular/core';

import { slidePageAnimation } from '../animations';

@Component({
  selector: 'app-sign-nfe',
  templateUrl: './sign-nfe.component.html',
  styleUrls: ['./sign-nfe.component.css'],
  animations: [ slidePageAnimation ]
})
export class SignNfeComponent implements OnInit {
  @HostBinding('@routeAnimation') routeAnimation = true;
  @HostBinding('style.display')   display = 'block';

  constructor() { }

  ngOnInit() {
  }

}
