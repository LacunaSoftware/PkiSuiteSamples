import { Component, OnInit, HostBinding } from '@angular/core';

import { slidePageAnimation } from '../animations';

@Component({
  selector: 'app-validate-pdf-sig',
  templateUrl: './validate-pdf-sig.component.html',
  styleUrls: ['./validate-pdf-sig.component.css'],
  animations: [ slidePageAnimation ]
})
export class ValidatePdfSigComponent implements OnInit {
  @HostBinding('@routeAnimation') routeAnimation = true;
  @HostBinding('style.display')   display = 'block';

  constructor() { }

  ngOnInit() {
  }

}
