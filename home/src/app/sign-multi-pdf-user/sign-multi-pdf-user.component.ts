import { Component, OnInit, HostBinding } from '@angular/core';

import { slidePageAnimation } from '../animations';

@Component({
  selector: 'app-sign-multi-pdf-user',
  templateUrl: './sign-multi-pdf-user.component.html',
  styleUrls: ['./sign-multi-pdf-user.component.css'],
  animations: [ slidePageAnimation ]
})
export class SignMultiPdfUserComponent implements OnInit {
  @HostBinding('@routeAnimation') routeAnimation = true;
  @HostBinding('style.display')   display = 'block';

  constructor() { }

  ngOnInit() {
  }

}
