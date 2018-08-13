import { Component, OnInit, HostBinding } from '@angular/core';

import { slidePageAnimation } from '../animations';

@Component({
  selector: 'app-sign-multi-pdf-server',
  templateUrl: './sign-multi-pdf-server.component.html',
  styleUrls: ['./sign-multi-pdf-server.component.css'],
  animations: [ slidePageAnimation ]
})
export class SignMultiPdfServerComponent implements OnInit {
  @HostBinding('@routeAnimation') routeAnimation = true;
  @HostBinding('style.display')   display = 'block';

  constructor() { }

  ngOnInit() {
  }

}
