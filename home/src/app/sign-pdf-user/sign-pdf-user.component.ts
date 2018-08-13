import { Component, OnInit, HostBinding } from '@angular/core';

import { slidePageAnimation } from '../animations';

@Component({
  selector: 'app-sign-pdf-user',
  templateUrl: './sign-pdf-user.component.html',
  styleUrls: ['./sign-pdf-user.component.css'],
  animations: [ slidePageAnimation ]
})
export class SignPdfUserComponent implements OnInit {
  @HostBinding('@routeAnimation') routeAnimation = true;
  @HostBinding('style.display')   display = 'block';

  constructor() { }

  ngOnInit() {
  }

}
