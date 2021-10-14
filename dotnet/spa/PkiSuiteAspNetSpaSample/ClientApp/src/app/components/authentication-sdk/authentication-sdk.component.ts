import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import LacunaWebPKI, { CertificateModel } from 'web-pki';
import { Config } from '../../api/configuration';
import { CompleteAuthenticationRequest } from '../../api/sdk/signature';
import * as cert from '../../api/certificate';
import { ValidationResultsModel } from '../../api/validation-results';
import { SignatureSdkService } from '../../services/signature-sdk.service';

@Component({
  selector: 'app-authentication-sdk',
  templateUrl: './authentication-sdk.component.html',
  styleUrls: ['./authentication-sdk.component.css']
})
export class AuthenticationSdkComponent implements OnInit {

  pki: any = new LacunaWebPKI(Config.value.webPki.license);

  public loading: boolean = true;
  public result: boolean = false;
  public success: boolean = true;
  public vr: ValidationResultsModel;
  public certificate: cert.CertificateModel;
  public certificateList: CertificateModel[] = [];
  public selectedCertificate: string;
  public error: boolean = false;

  constructor(
    private authenticationService: SignatureSdkService,
    private cd: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.pki.init({
      ready: this.onWebPkiReady,
      notInstalled: this.onWebPkiNotInstalled,
      defaultFail: this.onWebPkiError
    });
  }

  private onWebPkiReady: () => void = (() => {
    this.loadCertificates();
  });

  private onWebPkiNotInstalled: () => void = (() => {
    console.log('Web PKI not installed');
    this.loading = false;
    this.pki.redirectToInstallPage();
  });

  private onWebPkiError: (ex) => void = ((ex) => {
    console.error('Web PKI error: ' + ex.message);
    this.setLoading(false);
  });

  loadCertificates() {
    this.setLoading(true);
    this.selectedCertificate = null;
    this.pki.listCertificates().success(response => {
      this.certificateList = response;
      if (!this.certificateList || this.certificateList.length === 0) {
        console.log('No certificate was found');
      } else {
        this.selectedCertificate = this.certificateList[0].thumbprint;
      }
      this.setLoading(false);
    });
  };

  reset() {
    this.setLoading(true);
    this.result = false;
    this.loadCertificates();
  }

  sign() {
    this.setLoading(true);

    this.authenticationService.startAuthentication().subscribe((result => {
      this.pki.signData({
        data: result.nonce,
        digestAlgorithm: result.digestAlgorithm,
        thumbprint: this.selectedCertificate
      }).success((signature) => {
        this.pki.readCertificate({ thumbprint: this.selectedCertificate }).success(certContent => {
          let completeRequest: CompleteAuthenticationRequest = {
            nonce: result.nonce,
            certificate: certContent,
            signature: signature,
          };
          this.authenticationService.completeAuthentication(completeRequest).subscribe(
            (completeResponse => {
              this.success = completeResponse.isValid;
              this.vr = completeResponse.validationResults;
              this.certificate = completeResponse.certificate;
              this.result = true;
              this.setLoading(false);
            }),
            (err => {
              console.error('Error while completing authentication: ' + err.message);
              this.error = true;
              this.setLoading(false);
            })
          );
        });
      });
    }),
      (err => {
        console.error('Error while starting authentication: ' + err.message);
        this.error = true;
        this.setLoading(false);
      })
    );
  }

  setLoading(value: boolean): void {
    this.loading = value;
    this.cd.detectChanges();
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
