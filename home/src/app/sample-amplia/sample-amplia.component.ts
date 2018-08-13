import { Component, OnInit } from '@angular/core';

import { PayOptionsService } from '../pay-options.service';

@Component({
  selector: 'sample-amplia',
  templateUrl: './sample-amplia.component.html',
  styleUrls: ['./sample-amplia.component.css']
})
export class SampleAmpliaComponent implements OnInit {

  public choice: string;

  constructor(private payOptions: PayOptionsService) { }

  ngOnInit() {

    this.payOptions.choiceStore.subscribe((data: string) => {
      this.choice = data;
    });
  }

}
