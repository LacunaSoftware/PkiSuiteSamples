import { Component, OnInit } from '@angular/core';

import { PayOptionsService } from '../pay-options.service';

@Component({
  selector: 'sample-pkiexpress',
  templateUrl: './sample-pkiexpress.component.html',
  styleUrls: ['./sample-pkiexpress.component.css']
})
export class SamplePkiexpressComponent implements OnInit {

  public choice: string;

  constructor(private payOptions: PayOptionsService) { }

  ngOnInit() {

    this.payOptions.choiceStore.subscribe((data: string) => {
      this.choice = data;
    });
  }

}
