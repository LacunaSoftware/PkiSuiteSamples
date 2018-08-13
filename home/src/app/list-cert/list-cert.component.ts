import { Component, OnInit, HostBinding } from '@angular/core';

import { slidePageAnimation } from '../animations';

@Component({
  selector: 'app-list-cert',
  templateUrl: './list-cert.component.html',
  styleUrls: ['./list-cert.component.css'],
  animations: [ slidePageAnimation ]
})
export class ListCertComponent implements OnInit {
  @HostBinding('@routeAnimation') routeAnimation = true;
  @HostBinding('style.display')   display = 'block';
  hero = 'Windstrom';
  
  constructor() { 
  }

  ngOnInit() {
  }

}
