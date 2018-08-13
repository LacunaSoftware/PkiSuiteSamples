import { Component, OnInit, HostBinding } from '@angular/core';

import { slidePageAnimation } from '../animations';

@Component({
  selector: 'app-issue-cert-user',
  templateUrl: './issue-cert-user.component.html',
  styleUrls: ['./issue-cert-user.component.css'],
  animations: [ slidePageAnimation ]
})
export class IssueCertUserComponent implements OnInit {
  @HostBinding('@routeAnimation') routeAnimation = true;
  @HostBinding('style.display')   display = 'block';

  constructor() { }

  ngOnInit() {
  }

}
