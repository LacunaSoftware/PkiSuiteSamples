import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ConfigurationService } from '../shared/configuration.service';
import { sampleTasks } from './sample-list';

/** The home page: the list of samples in this project. */
@Component({
  selector: 'app-home',
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: './home.html',
})
export class Home {
  protected readonly configuration = inject(ConfigurationService);
  protected readonly tasks = sampleTasks;
}
