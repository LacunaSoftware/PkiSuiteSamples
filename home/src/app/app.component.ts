import { 
  Component
} from '@angular/core';
import {
  trigger,
  state,
  style,
  animate,
  transition
} from '@angular/animations';

import { optionCardAnimation } from './animations'
import { PayOptionsService } from './pay-options.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: [ optionCardAnimation ]
})
export class AppComponent {
  title = 'PKI Suite ASP.NET MVC Samples';

  constructor(public payOptions: PayOptionsService) { }
}
