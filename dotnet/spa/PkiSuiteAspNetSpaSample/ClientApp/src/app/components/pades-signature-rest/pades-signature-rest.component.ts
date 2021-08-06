import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import LacunaWebPKI, { CertificateModel } from 'web-pki';
import { CompletePadesSignatureRequest, CompletePadesSignatureResponse, StartPadesSignatureRequest } from '../../api/rest/pades-signature';
import { PadesSignatureService } from '../../services/rest/pades-signature.service';
import { Config } from '../../api/configuration';

@Component({
  selector: 'app-pades-signature-rest',
  templateUrl: './pades-signature-rest.component.html',
  styleUrls: ['./pades-signature-rest.component.css']
})
export class PadesSignatureRestComponent implements OnInit {

  pki: any = new LacunaWebPKI(Config.value.webPki.license);

  loading: boolean = false;
  result: boolean = false;
  error: boolean = false;
  fileId: string = "";
  certificateList: CertificateModel[] = [];
  selectedCertificate: string;
  signedFileId: string;

  constructor(
    private route: ActivatedRoute,
    private padesSignatureService: PadesSignatureService,
    private cd: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.loading = true;
    this.route.params.subscribe(params => {
      this.fileId = params['fileid'];
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

  sign() {
    this.setLoading(true);

    let startRequest: StartPadesSignatureRequest = {
      userFile: this.fileId
    };
    this.padesSignatureService.startPadesSignature(startRequest).subscribe((result => {
      this.pki.signWithRestPki({
        token: result.token,
        thumbprint: this.selectedCertificate
      }).success(() => {
        let completeRequest: CompletePadesSignatureRequest = {
          token: result.token
        }
        this.padesSignatureService.completePadesSignature(completeRequest).subscribe(
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
