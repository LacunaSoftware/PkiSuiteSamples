import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-service-unavailable',
  templateUrl: './service-unavailable.component.html',
  styleUrls: ['./service-unavailable.component.css']
})
export class ServiceUnavailableComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  tryAgain() {
    localStorage.clear();
    sessionStorage.clear();
    location.reload();
  }
}
