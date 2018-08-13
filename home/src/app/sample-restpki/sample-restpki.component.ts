import { Component, OnInit } from '@angular/core';

import { PayOptionsService } from '../pay-options.service';

@Component({
  selector: 'sample-restpki',
  templateUrl: './sample-restpki.component.html',
  styleUrls: ['./sample-restpki.component.css']
})
export class SampleRestpkiComponent implements OnInit {

  public choice: string;

  constructor(private payOptions: PayOptionsService) { }

  ngOnInit() {

    this.payOptions.choiceStore.subscribe((data: string) => {
      this.choice = data;
    });
  }

}
