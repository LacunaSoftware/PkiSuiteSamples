import { Component, NgZone, OnInit } from '@angular/core';
import LacunaWebPKI, { CertificateModel } from 'web-pki';
import { Config } from '../../api/configuration';
import { SignatureRestService } from '../../services/signature-rest.service';

@Component({
  selector: 'app-xml-signature-rest',
  templateUrl: './xml-signature-rest.component.html',
  styleUrls: ['./xml-signature-rest.component.css']
})
export class XmlSignatureRestComponent implements OnInit {
  pki: any = new LacunaWebPKI(Config.value.webPki.license);

  loading: boolean = false;
  result: boolean = false;
  error: boolean = false;
  fileId: string = "";
  certificateList: CertificateModel[] = [];
  selectedCertificate: string;
  signedFileId: string;

  constructor(
    private xmlSignatureService: SignatureRestService,
    private ngZone: NgZone
  ) { }

  ngOnInit() {
    this.loading = true;
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

  sign() {
    this.loading = true;

    this.xmlSignatureService.startXmlSignature().subscribe((completeRequest => {
      this.pki.signWithRestPki({
        token: completeRequest.token,
        thumbprint: this.selectedCertificate
      }).success(() => {
        this.xmlSignatureService.completeXmlSignature(completeRequest).subscribe(
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
