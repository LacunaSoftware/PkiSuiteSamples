import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';

/**
 * The page for any path that is not a sample. The server answers every path with the Angular app,
 * so without this page a wrong link would quietly show the home page instead.
 */
@Component({
  selector: 'app-not-found',
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    <h1>Page not found</h1>
    <p>There is no sample at this address.</p>
    <p><a routerLink="/">Back to the samples</a></p>
  `,
})
export class NotFound {}
