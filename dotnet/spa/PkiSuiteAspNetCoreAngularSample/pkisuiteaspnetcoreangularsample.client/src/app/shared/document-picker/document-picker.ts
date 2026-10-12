import { Component, inject, input, output, signal } from '@angular/core';
import { errorMessage } from '../error-message';
import { FilesService } from '../files.service';
import { SampleDocument, sampleDocumentDescriptions } from '../sample-documents';

/**
 * Lets the user choose the document a sample works on: one of the sample documents bundled with
 * the server, or a file of their own. Either way the document ends up in the server's storage, and
 * the picker emits its file id.
 *
 * Usage: `<app-document-picker [samples]="['SamplePdf']" accept=".pdf" (picked)="onPicked($event)" />`
 */
@Component({
  selector: 'app-document-picker',
  templateUrl: './document-picker.html',
  styleUrl: './document-picker.css',
})
export class DocumentPicker {
  protected readonly files = inject(FilesService);
  protected readonly descriptions = sampleDocumentDescriptions;

  /** The sample documents to offer. */
  readonly samples = input.required<SampleDocument[]>();
  /** Accepted file types for uploads, as in the `accept` attribute of a file input (".pdf"). */
  readonly accept = input<string>('');
  /** Emits the file id of the chosen document. */
  readonly picked = output<string>();

  protected readonly busy = signal(false);
  protected readonly error = signal<string | null>(null);

  protected useSample(document: SampleDocument): Promise<void> {
    return this.pick(() => this.files.useSample(document));
  }

  protected upload(event: Event): Promise<void> {
    const file = (event.target as HTMLInputElement).files?.[0];
    return file ? this.pick(() => this.files.upload(file)) : Promise.resolve();
  }

  private async pick(getFileId: () => Promise<string>): Promise<void> {
    this.busy.set(true);
    this.error.set(null);
    try {
      this.picked.emit(await getFileId());
    } catch (error) {
      this.error.set(errorMessage(error));
    } finally {
      this.busy.set(false);
    }
  }
}
