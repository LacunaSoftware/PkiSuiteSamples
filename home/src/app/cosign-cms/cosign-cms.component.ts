import { Component, OnInit, HostBinding } from '@angular/core';
import { slidePageAnimation } from '../animations';

@Component({
  selector: 'app-cosign-cms',
  templateUrl: './cosign-cms.component.html',
  styleUrls: ['./cosign-cms.component.css'],
  animations: [ slidePageAnimation ]
})
export class CosignCmsComponent implements OnInit {
  @HostBinding('@routeAnimation') routeAnimation = true;
  @HostBinding('style.display')   display = 'block';

  constructor() { }

  ngOnInit() {
  }

}
