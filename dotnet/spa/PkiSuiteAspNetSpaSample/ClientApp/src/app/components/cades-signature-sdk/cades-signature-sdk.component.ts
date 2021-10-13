import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import LacunaWebPKI, { CertificateModel } from 'web-pki';
import { CompleteCadesSignatureRequest, StartCadesSignatureRequest } from '../../api/sdk/signature';
import { SignatureSdkService } from '../../services/signature-sdk.service';
import { Config } from '../../api/configuration';


@Component({
  selector: 'app-cades-signature-sdk',
  templateUrl: './cades-signature-sdk.component.html',
  styleUrls: ['./cades-signature-sdk.component.css']
})
export class CadesSignatureSdkComponent implements OnInit {

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
    private cadesSignatureService: SignatureSdkService,
    private cd: ChangeDetectorRef
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

  certContent: string;
  toSignBytes: string;

  sign() {
    this.setLoading(true);
    this.pki.readCertificate({ thumbprint: this.selectedCertificate }).success(certContent => {
      this.certContent = certContent;
      let startRequest: StartCadesSignatureRequest = {
        userFile: this.fileId,
        isCosign: this.isCmsCosign,
        certContent: this.certContent,
        certThumb: this.selectedCertificate
      };

      this.cadesSignatureService.startCadesSignature(startRequest).subscribe(
        (startResponse => {
          this.toSignBytes = startResponse.toSignBytes;
          this.pki.signHash({
            thumbprint: this.selectedCertificate,
            hash: startResponse.toSignHash,
            digestAlgorithm: startResponse.digestAlgorithm
          }).success(signature => {

            let completeRequest: CompleteCadesSignatureRequest = {
              signature: signature,
              isCosign: this.isCmsCosign,
              userFile: this.fileId,
              toSignBytes: this.toSignBytes,
              certContent: this.certContent
            };

            this.cadesSignatureService.completeCadesSignature(completeRequest).subscribe(
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
    });
  }

  setLoading(value: boolean): void {
    this.loading = value;
    this.cd.detectChanges();
  }

}
