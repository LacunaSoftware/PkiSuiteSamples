import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import LacunaWebPKI, { CertificateModel } from 'web-pki';
import { Config } from '../../api/configuration';
import { StartSignatureRequest, CompleteSignatureRequest } from '../../api/sdk/signature';
import { SignatureSdkService } from '../../services/signature-sdk.service';

@Component({
  selector: 'app-xml-nfe-signature-sdk',
  templateUrl: './xml-nfe-signature-sdk.component.html',
  styleUrls: ['./xml-nfe-signature-sdk.component.css']
})
export class XmlNFeSignatureSdkComponent implements OnInit {
  pki: any = new LacunaWebPKI(Config.value.webPki.license);

  loading: boolean = false;
  result: boolean = false;
  error: boolean = false;
  fileId: string = "";
  certificateList: CertificateModel[] = [];
  selectedCertificate: string;
  signedFileId: string;

  constructor(
    private nfeSignatureService: SignatureSdkService,
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
    this.pki.readCertificate({ thumbprint: this.selectedCertificate }).success(certContent => {
      let startReques: StartSignatureRequest = {
        certContent: certContent,
      }
      this.nfeSignatureService.startXmlNFeSignature(startReques).subscribe(
        (startResponse => {
          this.pki.signHash({
            thumbprint: this.selectedCertificate,
            hash: startResponse.toSignHash,
            digestAlgorithm: startResponse.digestAlgorithm
          }).success(signature => {

            let completeRequest: CompleteSignatureRequest = {
              signature: signature,
              transferDataId: startResponse.transferDataId
            };

            this.nfeSignatureService.completeXmlNFeSignature(completeRequest).subscribe(
              (completeResponse => {
                this.signedFileId = completeResponse.signedFileId;
                this.result = true;
                this.setLoading(false);
              }), (err => {
                console.error('Error while completing signature: ' + err.message);
                this.error = true;
                this.setLoading(false);
              }));
          });
        }), (err => {
          console.error('Error while starting signature: ' + err.message);
          this.error = true;
          this.setLoading(false);
        }))

    });
  }

  setLoading(value: boolean): void {
    this.loading = value;
    this.cd.detectChanges();
  }
}
