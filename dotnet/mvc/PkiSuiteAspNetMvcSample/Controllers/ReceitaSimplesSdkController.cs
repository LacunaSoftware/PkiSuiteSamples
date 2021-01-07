using iTextSharp.text;
using iTextSharp.text.pdf;
using Lacuna.Pki;
using Lacuna.Pki.Pades;
using PkiSuiteAspNetMvcSample.Classes;
using PkiSuiteAspNetMvcSample.Models.Sdk;
using System;
using System.Collections;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace PkiSuiteAspNetMvcSample.Controllers {
	public class ReceitaSimplesSdkController : BaseController {
		private IPadesPolicyMapper GetSignaturePolicy() {

			// Get our custom trust arbitrator which accepts test certificates (see Util.GetTrustArbitrator()).
			var arbitrator = Util.GetTrustArbitrator();

			return PadesPoliciesForGeneration.GetPadesBasic(arbitrator);
		}

		private readonly string[] ufs = { "AC", "AL", "AM", "AP", "BA", "CE", "DF", "ES", "GO",
			"MA", "MG", "MS", "MT", "PA", "PB", "PE", "PI", "PR", "RJ", "RN", "RO", "RR", "RS",
			"SC", "SE", "SP", "TO" };

		// GET: ReceitaSimples
		public ActionResult Index() {
			return View(new PrescricaoDataModel {
				UFs = ufs
			});
		}

		/**
		* POST: ReceitaSimples
		* 
		* This action is called once the user enter the data for the prescrição, and generates
		* the file to be signed.
		*/
		[HttpPost]
		public ActionResult Index(PrescricaoDataModel model) {
			// Guarantees that the "App_Data" folder exists.
			if (!Directory.Exists(StorageMock.AppDataPath)) {
				Directory.CreateDirectory(StorageMock.AppDataPath);
			}
			var filename = Guid.NewGuid() + ".pdf";
			var userFile = Path.Combine(StorageMock.AppDataPath, filename);

			using (var stream = new FileStream(userFile, FileMode.OpenOrCreate)) {

				// PdfGeneration.ReceitaSimples(), to see how the custom sample pdf is generated.
				var content = PdfGeneration.ReceitaSimples(model.Name, model.Crm, model.CrmUf);

				var reader = new PdfReader(content);
				var stamper = new PdfStamper(reader, stream);

				// REQUIRED!!!
				// Add all the required receita simples metadata,
				// when value is not specified it uses empty strings.
				var infos = new Hashtable
				{
					{ DocumentType.PrescricaoMedicamento.GetValue(), "Prescrição de medicamento" },
					{ FieldName.Crm.GetValue(), model.Crm },
					{ FieldName.CrmUF.GetValue(), model.CrmUf },
					{ FieldName.CrmEspecialidade.GetValue(), "" },
					{ FieldName.Crf.GetValue(), "" },
					{ FieldName.CrfUF.GetValue(), "" },
					{ FieldName.CrfEspecialidade.GetValue(), "" }
				};

				// Add metadata to pdf
				stamper.MoreInfo = infos;
				stamper.Close();
				reader.Close();
			}
			return RedirectToAction("Start", new SignatureStartModel() {
				UserFile = filename.Replace(".", "_")
			});
		}

		// GET: ReceitaSimples/Start?userfile=<file_id>
		public ActionResult Start(string userfile) {
			return View(new SignatureStartModel() {
				UserFile = userfile
			});
		}

		/**
		* POST: ReceitaSimples/Start
		* 
		* This action is called once the user's certificate encoding has been read, and contains the 
		* logic to prepare the hash that needs to be actually signed with the user's private key
		* (the "to-sign-hash").
		*/
		[HttpPost]
		public ActionResult Start(SignatureStartModel model) {

			byte[] toSignBytes, transferData;
			SignatureAlgorithm signatureAlg;

			try {

				// Verify if the userfile exists and get its absolute path.
				string userfilePath;
				if (!StorageMock.TryGetFile(model.UserFile, out userfilePath)) {
					return HttpNotFound();
				}

				// Decode the user's certificate.
				var cert = PKCertificate.Decode(model.CertContent);

				// Get an instance of the PadesSigner class.
				var padesSigner = new PadesSigner();

				// Set the file to be signed.
				padesSigner.SetPdfToSign(userfilePath);

				// REQUIRED!
				// Provide the signer's certificate. You must sign with a valid digital
				// certificate of a doctor, who was registered on CRM. In this sample,
				// we used a sample certificate stored on server to do the execute this
				// sample.
				padesSigner.SetSigningCertificate(cert);

				// REQUIRED!
				// Define the trust arbitrator, which will configure the signer to 
				// some kind of certificate. In the case of this sample, only
				// ICP-Brasil certificates will be accepted in the defined standard.
				var trustArbitrator = new LinkedTrustArbitrator(TrustArbitrators.PkiBrazil);
#if DEBUG
				// For development purposes, we also trust in Lacuna Software's test certificates.
				var lacunaRoot = Lacuna.Pki.PKCertificate.Decode(Convert.FromBase64String("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"));
				trustArbitrator.Add(new TrustedRoots(lacunaRoot));
#endif
				// REQUIRED!
				// Use a policy accepted by ICP-Brasil. We use the trust arbitrator
				// defined above to configure the policy.
				padesSigner.SetPolicy(PadesPoliciesForGeneration.GetPadesBasic(trustArbitrator));

				// REQUIRED!
				// Use a custom signature field name. This field MUST have the 
				// "Emitente" keyword as the last keyword.
				padesSigner.SetCustomSignatureFieldName("Signature1 Emitente");

				// REQUIRED!
				// Set Certification Level to not allow changes after signed.
				padesSigner.SetCertificationLevel(PadesCertificationLevel.CertifiedNoChangesAllowed);

				// Set a visual representation for the signature.
				padesSigner.SetVisualRepresentation(PadesVisualElements.GetVisualRepresentationForPkiSdk(cert));

				// Generate the "to-sign-bytes". This method also yields the signature algorithm that must
				// be used on the client-side, based on the signature policy, as well as the "transfer data",
				// a byte-array that will be needed on the next step.
				toSignBytes = padesSigner.GetToSignBytes(out signatureAlg, out transferData);

			} catch (ValidationException ex) {
				// Some of the operations above may throw a ValidationException, for instance if the certificate
				// encoding cannot be read or if the certificate is expired.
				ModelState.AddModelError("", ex.ValidationResults.ToString());
				return View();
			}

			// On the next step (Complete action), we'll need once again some information:
			// - The thumbprint of the selected certificate.
			// - The "transfer data" used to validate the signature in complete action. Its content is stored in
			//   a temporary file (with extension .bin) to be shared with the Complete action.
			// - The "to-sign-hash" (digest of the "to-sign-bytes") to be signed. (see signature-complete-form.js)
			// - The OID of the digest algorithm to be used during the signature operation.
			// We'll store these values on TempData, which is a dictionary shared between actions.
			TempData["SignatureCompleteModel"] = new SignatureCompleteModel() {
				CertThumb = model.CertThumb,
				TransferDataFileId = StorageMock.Store(transferData, ".bin"),
				ToSignHash = signatureAlg.DigestAlgorithm.ComputeHash(toSignBytes),
				DigestAlgorithmOid = signatureAlg.DigestAlgorithm.Oid
			};

			return RedirectToAction("Complete", new { userfile = model.UserFile });
		}

		// GET: ReceitaSimples/Complete?userfile=<file_id>
		[HttpGet]
		public ActionResult Complete(string userfile) {

			// Recovery data from Index action, if returns null, it'll be redirected to Index 
			// action again.
			var model = TempData["SignatureCompleteModel"] as SignatureCompleteModel;
			if (model == null) {
				return RedirectToAction("Index", new { userfile });
			}

			return View(model);
		}

		/**
		* POST: ReceitaSimples/Complete
		* 
		* This action is called once the "to-sign-hash" are signed using the user's certificate. After signature,
		* it'll be redirect to SignatureInfo action to show the signature file.
		*/
		[HttpPost]
		public ActionResult Complete(SignatureCompleteModel model) {
			byte[] signatureContent;

			try {

				// Recover the "transfer data" content stored in a temporary file.
				byte[] transferDataContent;
				if (!StorageMock.TryGetFile(model.TransferDataFileId, out transferDataContent)) {
					return HttpNotFound();
				}

				// Get an instance of the PadesSigner class.
				var padesSigner = new PadesSigner();

				// Set the signature policy.
				padesSigner.SetPolicy(GetSignaturePolicy());

				// Set the signature computed on the client-side, along with the "transfer data" (rendered in a hidden field, see the view)
				padesSigner.SetPreComputedSignature(model.Signature, transferDataContent);

				// Call ComputeSignature(), which does all the work, including validation of the signer's certificate and of the resulting signature
				padesSigner.ComputeSignature();

				// Get the signed PDF as an array of bytes
				signatureContent = padesSigner.GetPadesSignature();

			} catch (ValidationException ex) {
				// Some of the operations above may throw a ValidationException, for instance if the certificate is revoked.
				ModelState.AddModelError("", ex.ValidationResults.ToString());
				// Return userfile to continue the signature with the same file.
				return View(model);
			}

			// On the next step (SignatureInfo action), we'll render the following information:
			// - The filename to be available to download in next action.
			// - The signer's certificate information to be rendered.
			// We'll store these values on TempData, which is a dictionary shared between actions.
			TempData["SignatureInfoModel"] = new SignatureInfoModel() {

				// Store the signature file on the folder "App_Data/" and redirects to the SignatureInfo action with the filename.
				// With this filename, it can show a link to download the signature file.
				File = StorageMock.Store(signatureContent, ".pdf")
			};

			return RedirectToAction("SignatureInfo");
		}

		// GET: ReceitaSimples/SignatureInfo
		[HttpGet]
		public ActionResult SignatureInfo() {

			// Recovery data from Conplete action, if returns null, it'll be redirected to Index 
			// action again.
			var model = TempData["SignatureInfoModel"] as SignatureInfoModel;
			if (model == null) {
				return RedirectToAction("Index");
			}

			return View(model);
		}
	}

	class PdfGeneration {
		public PdfGeneration() { }

		public static byte[] ReceitaSimples(string name, string crm, string crmUf)
		{
			string[] DefaultLabels = { "Telefone", "Endereço", "Bairro", "Cidade",
				"UF", "Nome Local de Atendimento", "CNES", "Nome do Paciente", "Prescrição", "Data de Emissão" };

			string[] DefaultValues = { "+00 (00) 0000-0000", "Complexo Hospitalar", "Bairro do Mar",
				"Brasília", "DF", "Clínica Local", "0000000", "Maria da Silva",
				"Remédio X ---------- 1 comprimido de 12 em 12 horas por 3 dias", "00/00/0000" };

			var stream = new MemoryStream();
			var document = new Document();
			var writer = PdfWriter.GetInstance(document, stream);
			document.Open();

			// Add title.
			var title = new Paragraph("RECEITUÁRIO SIMPLES", new Font(null, 20f, Font.BOLD))
			{
				Alignment = Element.ALIGN_CENTER,
			};
			document.Add(title);

			var table = new PdfPTable(6)
			{
				WidthPercentage = 100
			};

			var nameCell = new PdfPCell()
			{
				Colspan = 6,
				Border = Rectangle.NO_BORDER,
			};
			nameCell.AddElement(new Phrase("Nome do(a) médico(a):\t" + name));
			table.AddCell(nameCell);
			var crmCell = new PdfPCell()
			{
				Colspan = 6,
				Border = Rectangle.NO_BORDER,
			};
			crmCell.AddElement(new Phrase("CRM:\t" + crm));
			table.AddCell(crmCell);
			var crmUfCell = new PdfPCell()
			{
				Colspan = 6,
				Border = Rectangle.NO_BORDER,
			};
			crmUfCell.AddElement(new Phrase("CRM UF:\t" + crmUf));
			table.AddCell(crmUfCell);

			// Default values
			for (int i = 0; i < DefaultLabels.Length; i++)
			{
				var cell = new PdfPCell()
				{
					Colspan = 6,
					Border = Rectangle.NO_BORDER,
				};
				cell.AddElement(new Phrase(DefaultLabels[i] + ":\t" + DefaultValues[i]));
				table.AddCell(cell);
			}

			// Add table.
			document.Add(table);

			document.Close();
			writer.Close();

			return stream.ToArray();
		}
	}
}

