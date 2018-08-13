import { Component, OnInit } from '@angular/core';

import { PayOptionsService } from '../pay-options.service';

@Component({
  selector: 'sample-pkisdk',
  templateUrl: './sample-pkisdk.component.html',
  styleUrls: ['./sample-pkisdk.component.css']
})
export class SamplePkisdkComponent implements OnInit {

  public choice: string;

  constructor(private payOptions: PayOptionsService) { }

  ngOnInit() {

    this.payOptions.choiceStore.subscribe((data: string) => {
      this.choice = data;
    });
  }

}
