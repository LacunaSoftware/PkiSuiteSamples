import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

/**
 * Placeholder page for a sample that has not been written yet. Each sample's routes.ts points here
 * until the sample replaces it.
 */
@Component({
  selector: 'app-pending-sample',
  imports: [RouterLink],
  template: `
    <h1>{{ slug }}</h1>
    <p>This sample is not available yet.</p>
    <p><a routerLink="/">Back to the samples</a></p>
  `,
})
export class PendingSample {
  // The slug is the path of the parent route, declared in app.routes.ts.
  protected readonly slug = inject(ActivatedRoute).parent?.snapshot.routeConfig?.path ?? '';
}
