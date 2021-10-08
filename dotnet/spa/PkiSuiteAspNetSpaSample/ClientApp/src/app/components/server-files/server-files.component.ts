import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SampleDocs } from '../../api/sample-docs';
import { SampleFilesService } from '../../services/sample-files.service';

@Component({
  selector: 'app-server-files',
  templateUrl: './server-files.component.html',
  styleUrls: ['./server-files.component.css']
})

export class ServerFilesComponent implements OnInit {

  constructor(
    @Inject(DOCUMENT) document,
    private fileService: SampleFilesService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  availableFiles: ServerFile[] = [];
  rc: string = "";
  op: string = "";
  loading: boolean = false;

  ngOnInit() {
    this.route.queryParams
      .subscribe(params => {
        this.rc = params.rc;
        this.op = params.op;
        switch (this.op) {
          case 'CosignCms':
            this.availableFiles.push(new ServerFile(SampleDocs.CmsSignedOnce, 'A sample CMS file that was signed once.'));
            this.availableFiles.push(new ServerFile(SampleDocs.CmsSignedTwice, 'A sample CMS file that was signed twice.'));
            break;
          case 'CosignPdf':
          case 'PrinterFriendly':
            this.availableFiles.push(new ServerFile(SampleDocs.PdfSignedOnce, 'A sample PDF that was signed just once.'));
            this.availableFiles.push(new ServerFile(SampleDocs.PdfSignedTwice, 'A sample PDF that was signed twice.'));
            break;
          case 'SignCms':
          case 'SignPdf':
            this.availableFiles.push(new ServerFile(SampleDocs.SamplePdf, 'A sample PDF document (size: 25kb) with no signatures.'));
            break;
          default:
            console.error("Invalid operation");
        }
      }
    );
  }

  chooseFile(chosenFileId) {
    this.loading = true;
    document.getElementById(chosenFileId.id + '-card').classList.add('border');
    document.getElementById(chosenFileId.id + '-card').classList.add('border-success');
    document.getElementById(chosenFileId.id + '-card').classList.add('text-success');
    document.getElementById(chosenFileId.id + '-choice-btn').classList.remove('btn-primary');
    document.getElementById(chosenFileId.id + '-choice-btn').classList.add('btn-success');
    document.getElementById(chosenFileId.id + '-download-btn').classList.remove('btn-outline-primary');
    document.getElementById(chosenFileId.id + '-download-btn').classList.add('btn-outline-success');

    this.fileService.getFileId(chosenFileId.id).subscribe((fileid) => {
      this.loading = false;
      if (this.op == "CosignCms") {
        this.router.navigate([this.rc, { cmsfile: fileid }]);
      } else {
        this.router.navigate([this.rc, { fileid: fileid }]);
      }
    },
      (err) => {
        console.error("File upload error: " + err.message);
        this.loading = false;
      });
  }
}

export class ServerFile {
  id: SampleDocs;
  description: string;

  constructor(doc, description) {
    this.id = doc;
    this.description = description;
  }

  getDownloadUrl() {
    return "api/Download/Sample/" + this.id.toString(10);
  }
}
