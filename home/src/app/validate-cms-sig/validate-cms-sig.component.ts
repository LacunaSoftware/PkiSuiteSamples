import { Component, OnInit, HostBinding } from '@angular/core';

import { slidePageAnimation } from '../animations';

@Component({
  selector: 'app-validate-cms-sig',
  templateUrl: './validate-cms-sig.component.html',
  styleUrls: ['./validate-cms-sig.component.css'],
  animations: [ slidePageAnimation ]
})
export class ValidateCmsSigComponent implements OnInit {
  @HostBinding('@routeAnimation') routeAnimation = true;
  @HostBinding('style.display')   display = 'block';

  constructor() { }

  ngOnInit() {
  }

}
