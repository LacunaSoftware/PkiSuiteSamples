import { Injectable } from '@angular/core';

import { Option } from './option';
import { BehaviorSubject } from '../../node_modules/rxjs';

@Injectable({
  providedIn: 'root'
})
export class PayOptionsService {
  
  private _choiceStore: BehaviorSubject<string>

  private _options = [
    new Option("server", "Server", "I want to pay once and use how much I want", "fa fa-server"),
    new Option("cloud", "Cloud", "I want to pay monthly for exactly how much I use", "fa fa-cloud"),
    new Option("dont-know", "Don't Know", "I just want to navigate through the samples and decide later", "fa fa-question-circle")
  ]

  constructor() { 
    this._choiceStore = new BehaviorSubject("none");
  }

  get choiceStore() {
    return this._choiceStore.asObservable();
  }

  get options() {
    return this._options;
  }

  choose(index: number) {
    for (let option of this._options) {
      if (option.state === 'active') {
        option.state = 'inactive';
      }
    }
    this._options[index].state = this._options[index].state === 'active' ? 'inative' : 'active';
    this._choiceStore.next(this._options[index].id);
  }
}
