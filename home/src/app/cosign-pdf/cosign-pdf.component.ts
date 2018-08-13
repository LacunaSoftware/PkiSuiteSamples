import { Component, OnInit, HostBinding } from '@angular/core';

import { slidePageAnimation } from '../animations';

@Component({
  selector: 'app-cosign-pdf',
  templateUrl: './cosign-pdf.component.html',
  styleUrls: ['./cosign-pdf.component.css'],
  animations: [ slidePageAnimation ]
})
export class CosignPdfComponent implements OnInit {
  @HostBinding('@routeAnimation') routeAnimation = true;
  @HostBinding('style.display')   display = 'block';

  constructor() { }

  ngOnInit() {
  }

}
