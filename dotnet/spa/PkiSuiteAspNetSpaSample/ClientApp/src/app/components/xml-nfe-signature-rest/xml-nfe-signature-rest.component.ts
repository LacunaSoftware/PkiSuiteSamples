import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import LacunaWebPKI, { CertificateModel } from 'web-pki';
import { Config } from '../../api/configuration';
import { CompleteSignatureRequest } from '../../api/rest/signature';
import { SignatureRestService } from '../../services/signature-rest.service';

@Component({
  selector: 'app-xml-nfe-signature-rest',
  templateUrl: './xml-nfe-signature-rest.component.html',
  styleUrls: ['./xml-nfe-signature-rest.component.css']
})
export class XmlNFeSignatureRestComponent implements OnInit {
  pki: any = new LacunaWebPKI(Config.value.webPki.license);

  loading: boolean = false;
  result: boolean = false;
  error: boolean = false;
  certificateList: CertificateModel[] = [];
  selectedCertificate: string;
  signedFileId: string;

  constructor(
    private nfeSignatureService: SignatureRestService,
    private cd: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.loading = true;
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
    this.error = true;
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

  sign() {
    this.setLoading(true);

    this.nfeSignatureService.startXmlNFeSignature().subscribe((completeRequest => {
      this.pki.signWithRestPki({
        token: completeRequest.token,
        thumbprint: this.selectedCertificate
      }).success(() => {
        this.nfeSignatureService.completeXmlNFeSignature(completeRequest).subscribe(
          (completeResponse => {
            this.signedFileId = completeResponse.signedFileId;
            this.result = true;
            this.setLoading(false);
          }),
          (err => {
            console.error('Error while completing signature: ' + err.message);
            this.error = true;
            this.setLoading(false);
          }));
      });
    }),
      (err => {
        console.error('Error while starting signature: ' + err.message);
        this.error = true;
        this.setLoading(false);
      }));
  }

  setLoading(value: boolean): void {
    this.loading = value;
    this.cd.detectChanges();
  }
}
