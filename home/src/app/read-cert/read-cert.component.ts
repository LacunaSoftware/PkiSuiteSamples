import { Component, OnInit, HostBinding } from '@angular/core';

import { slidePageAnimation } from '../animations';

@Component({
  selector: 'app-read-cert',
  templateUrl: './read-cert.component.html',
  styleUrls: ['./read-cert.component.css'],
  animations: [ slidePageAnimation ]
})
export class ReadCertComponent implements OnInit {
  @HostBinding('@routeAnimation') routeAnimation = true;
  @HostBinding('style.display')   display = 'block';

  constructor() { }

  ngOnInit() {
  }

}
