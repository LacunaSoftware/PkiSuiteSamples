import { Component, OnInit, HostBinding } from '@angular/core';

import { slidePageAnimation } from '../animations';

@Component({
  selector: 'app-validate-xml-sig',
  templateUrl: './validate-xml-sig.component.html',
  styleUrls: ['./validate-xml-sig.component.css'],
  animations: [ slidePageAnimation ]
})
export class ValidateXmlSigComponent implements OnInit {
  @HostBinding('@routeAnimation') routeAnimation = true;
  @HostBinding('style.display')   display = 'block';

  constructor() { }

  ngOnInit() {
  }

}
