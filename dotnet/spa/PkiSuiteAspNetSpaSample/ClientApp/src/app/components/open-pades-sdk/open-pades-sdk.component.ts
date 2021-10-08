import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OpenPadesSignatureResponse } from '../../api/sdk/pades-signature';
import { SignatureSdkService } from '../../services/signature-sdk.service';

@Component({
  selector: 'app-open-pades-sdk',
  templateUrl: './open-pades-sdk.component.html',
  styleUrls: ['./open-pades-sdk.component.css']
})
export class OpenPadesSdkComponent implements OnInit {

  public signature: OpenPadesSignatureResponse;
  public loading:boolean = true;

  constructor(
    private route: ActivatedRoute,
    private padesSignatureService: SignatureSdkService,
    @Inject(DOCUMENT) document
  ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      const userfile = params['fileid'];
      this.padesSignatureService.openPadesSignature(userfile).subscribe(
        (response => {
          this.signature = response;
          this.loading = false;
        }),
        (err => {
          console.error('Error while opening signature: ' + err.message);
        }));
    });
  }

  toggleSigner(collapsedId) {
    if (document.getElementById(collapsedId).classList.contains("expand")) {
      document.getElementById(collapsedId).classList.add("collapse");
      document.getElementById(collapsedId).classList.remove("expand");
    } else {
      document.getElementById(collapsedId).classList.add("expand");
      document.getElementById(collapsedId).classList.remove("collapse");
    }
  }

  getSummary(vr) {
    let text = 'Validation results: ';

    if ((vr.passedChecks.length + vr.errors.length + vr.warnings.length) === 0) {
      text += 'no checks performed';
    } else {
      text += (vr.passedChecks.length + vr.errors.length + vr.warnings.length) + ' checks performed';
      if (vr.errors) {
        text += ', ' + vr.errors.length + ' errors';
      }
      if (vr.warnings) {
        text += ', ' + vr.warnings.length + ' warnings';
      }
      if (vr.isValid && vr.passedChecks > 0) {
        if (!vr.errors && !vr.warnings) {
          text += ', all passed';
        } else {
          text += ', ' + vr.passedChecks.length + ' passed';
        }
      }
    }

    return text;
  };

  _joinItems(items, indentationLevel) {
    indentationLevel = indentationLevel || 0;

    let text = '';
    let isFirst = true;
    let itemIndent = '\t'.repeat(indentationLevel);

    items.forEach((item) => {
      if (isFirst) {
        isFirst = false;
      } else {
        text += '\n';
      }
      text += itemIndent + '- ';
      text += item.message;
      if (item.detail != null) {
        text += ' (' + item.detail + ')';
      }
    });

    return text;
  }

  toString(vr, indentationLevel) {
    indentationLevel = indentationLevel || 0;

    let itemIndent = '\t'.repeat(indentationLevel);
    let text = '';

    text += this.getSummary(vr);
    if (vr.errors.length != 0) {
      text += '\n' + itemIndent + 'Errors:\n';
      text += this._joinItems(vr.errors, indentationLevel + 1);
    }
    if (vr.warnings.length != 0) {
      text += '\n' + itemIndent + 'Warnings:\n';
      text += this._joinItems(vr.warnings, indentationLevel + 1);
    }
    if (vr.passedChecks && vr.passedChecks.length > 0) {
      text += '\n' + itemIndent + 'Passed Checks:\n';
      text += this._joinItems(vr.passedChecks, indentationLevel + 1);
    }

    return text;
  };
}
