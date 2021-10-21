import { Component, NgZone, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import LacunaWebPKI, { CertificateModel } from 'web-pki';
import { CompleteSignatureRequest, StartSignatureRequest } from '../../api/rest/signature';
import { SignatureRestService } from '../../services/signature-rest.service';
import { Config } from '../../api/configuration';

@Component({
  selector: 'app-cades-signature-rest',
  templateUrl: './cades-signature-rest.component.html',
  styleUrls: ['./cades-signature-rest.component.css']
})
export class CadesSignatureRestComponent implements OnInit {

  pki: any = new LacunaWebPKI(Config.value.webPki.license);

  loading: boolean = false;
  result: boolean = false;
  error: boolean = false;
  isCmsCosign: boolean = false;
  fileId: string = "";
  certificateList: CertificateModel[] = [];
  selectedCertificate: string;
  signedFileId: string;

  constructor(
    private route: ActivatedRoute,
    private cadesSignatureService: SignatureRestService,
    private ngZone: NgZone
  ) { }

  ngOnInit() {
    this.loading = true;
    this.route.params.subscribe(params => {
      if (params['fileid'] != null) {
        this.fileId = params['fileid'];
      } else {
        this.fileId = params['cmsfile'];
        this.isCmsCosign = true;
      }
    });
    this.pki.init({
      ready: this.onWebPkiReady,
      notInstalled: this.onWebPkiNotInstalled,
      ngZone: this.ngZone,
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
    this.error = true;
    this.loading = false;
  });

  loadCertificates() {
    this.loading = true;
    this.selectedCertificate = null;
    this.pki.listCertificates().success(response => {
      this.certificateList = response;
      if (!this.certificateList || this.certificateList.length === 0) {
        console.log('No certificate was found');
      } else {
        this.selectedCertificate = this.certificateList[0].thumbprint;
      }
      this.loading = false;
    });
  };

  sign(): void {
    this.loading = true;

    let startRequest: StartSignatureRequest = {
      userFile: this.fileId,
      isCmsCosign: this.isCmsCosign
    };
    this.cadesSignatureService.startCadesSignature(startRequest).subscribe((result => {
      this.pki.signWithRestPki({
        token: result.token,
        thumbprint: this.selectedCertificate
      }).success(() => {
        let completeRequest: CompleteSignatureRequest = {
          token: result.token
        }
        this.cadesSignatureService.completeCadesSignature(completeRequest).subscribe(
          (completeResponse => {
            this.signedFileId = completeResponse.signedFileId;
            this.result = true;
            this.loading = false;
          }),
          (err => {
            console.error('Error while completing signature: ' + err.message);
            this.error = true;
            this.loading = false;
          }));
      });
    }),
      (err => {
        console.error('Error while starting signature: ' + err.message);
        this.error = true;
        this.loading = false;
      }));
  }
}
