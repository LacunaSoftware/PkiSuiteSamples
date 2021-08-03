import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigurationModel, Config } from '../api/configuration';

const configKey = 'configuration';

@Injectable()
export class StartupService {

  initError: any = null;

  constructor(
    private http: HttpClient
  ) {
  }

  init(): Promise<any> {

    return new Promise<any>((resolve) => { // no "reject" argument because we MUST NOT REJECT this promise

      console.debug('Fetching configuration');

      this.getConfig().then(config => {

        console.info('Configuration fetched: ', config);
        Config.initialize(config);

        resolve();

      }, err => {

        console.warn('Error fetching application configuration: ' + err);
        this.initError = err;
        resolve(); // this is intentional (app is initialized, but with error)

      });
    });
  }

  private getConfig(): Promise<ConfigurationModel> {
    return new Promise<ConfigurationModel>((resolve, reject) => {
      let configJson = sessionStorage.getItem(configKey);
      if (configJson) {
        resolve(JSON.parse(configJson));
      } else {
        this.http.get<ConfigurationModel>('/api/configuration').subscribe(config => {
          sessionStorage.setItem(configKey, JSON.stringify(config));
          resolve(config);
        }, reject);
      }
    });
  }
}
