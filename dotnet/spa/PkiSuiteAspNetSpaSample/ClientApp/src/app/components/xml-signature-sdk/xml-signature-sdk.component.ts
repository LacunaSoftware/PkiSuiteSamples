import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CertificateModel, LacunaWebPKI } from 'web-pki';
import { Config } from '../../api/configuration';
import { CompleteXmlSignatureRequest, StartXmlSignatureRequest } from '../../api/sdk/xml-signature';
import { SignatureSdkService } from '../../services/signature-sdk.service';

@Component({
  selector: 'app-xml-signature-sdk',
  templateUrl: './xml-signature-sdk.component.html',
  styleUrls: ['./xml-signature-sdk.component.css']
})
export class XmlSignatureSdkComponent implements OnInit {
  pki: any = new LacunaWebPKI(Config.value.webPki.license);

  loading: boolean = false;
  result: boolean = false;
  error: boolean = false;
  fileId: string = "";
  certificateList: CertificateModel[] = [];
  selectedCertificate: string;
  signedFileId: string;

  constructor(
    private xmlSignatureService: SignatureSdkService,
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
      let startReques: StartXmlSignatureRequest = {
        certContent: certContent,
      }
      this.xmlSignatureService.startXmlSignature(startReques).subscribe(
        (startResponse => {
          this.pki.signHash({
            thumbprint: this.selectedCertificate,
            hash: startResponse.toSignHash,
            digestAlgorithm: startResponse.digestAlgorithm
          }).success(signature => {

            let completeRequest: CompleteXmlSignatureRequest = {
              signature: signature,
              transferDataFileId: startResponse.transferDataId
            };

            this.xmlSignatureService.completeXmlSignature(completeRequest).subscribe(
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
