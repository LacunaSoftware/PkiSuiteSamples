import { Component, OnInit, HostBinding } from '@angular/core';

import { slidePageAnimation } from '../animations';

@Component({
  selector: 'app-issue-cert-server',
  templateUrl: './issue-cert-server.component.html',
  styleUrls: ['./issue-cert-server.component.css'],
  animations: [ slidePageAnimation ]
})
export class IssueCertServerComponent implements OnInit {
  @HostBinding('@routeAnimation') routeAnimation = true;
  @HostBinding('style.display')   display = 'block';

  constructor() { }

  ngOnInit() {
  }

}
