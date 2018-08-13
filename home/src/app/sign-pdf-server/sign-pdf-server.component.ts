import { Component, OnInit, HostBinding } from '@angular/core';

import { slidePageAnimation } from '../animations';

@Component({
  selector: 'app-sign-pdf-server',
  templateUrl: './sign-pdf-server.component.html',
  styleUrls: ['./sign-pdf-server.component.css'],
  animations: [ slidePageAnimation ]
})
export class SignPdfServerComponent implements OnInit {
  @HostBinding('@routeAnimation') routeAnimation = true;
  @HostBinding('style.display')   display = 'block';

  constructor() { }

  ngOnInit() {
  }

}
