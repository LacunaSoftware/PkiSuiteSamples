import { Component, OnInit } from '@angular/core';

import { PayOptionsService } from '../pay-options.service';

@Component({
  selector: 'sample-webpki',
  templateUrl: './sample-webpki.component.html',
  styleUrls: ['./sample-webpki.component.css']
})
export class SampleWebpkiComponent implements OnInit {

  public choice: string;

  constructor(private payOptions: PayOptionsService) { }

  ngOnInit() {

    this.payOptions.choiceStore.subscribe((data: string) => {
      this.choice = data;
    });
  }

}
