using Lacuna.Pki;
using Lacuna.Pki.Xml;
using Microsoft.Ajax.Utilities;
using Org.BouncyCastle.Utilities;
using PkiSuiteAspNetMvcSample.Classes;
using PkiSuiteAspNetMvcSample.Models.Sdk;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Management;
using System.Web;
using System.Web.Mvc;
using System.Xml;

namespace PkiSuiteAspNetMvcSample.Controllers {
    public class OpenXmlSignatureSdkController : BaseController {

        /**
		 * This action open a XML file and inspect its signatures.
		 */
        public ActionResult Index(string userfile) {

            // Our action only works if a userfile is given to work with.
            byte[] userfileContent;
            if (!StorageMock.TryGetFile(userfile, out userfileContent)) {
                return HttpNotFound();
            }
            
            // Acces any valid XmlDSig signature as long as the signer certificate is trusted.
            var policyMapper = XmlPoliciesForValidation.GetPkiBrazil();

            // open xml with the XmlSignatureEditor
            var openXml = XmlSignatureEditor.Open(userfileContent);
            // Get the current date
            var today = DateTimeOffset.UtcNow;
            var numberOfMonths = 12;
            // Calculate the date N months after today
            var nMonthsAfter = today.AddMonths(numberOfMonths);
            // filter signatures with timestamps and with AD-RA Policy
            // check if there is any ArchiveTimestamps
            // We'll only get the last signature file as we can only display one in the final view
            // you are able to extend this logic to obtain all signatures if you need to
            var signaturesWithArchiveTstamps = openXml.Signatures.LastOrDefault(s => s.ArchiveTimestamps.Any());
            if(signaturesWithArchiveTstamps == null) {
                throw new Exception("Error, no ArchiveTimestamps in this file");
            }
            var latestTimestampCertificate = signaturesWithArchiveTstamps.ArchiveTimestamps
                .OrderByDescending(t => t.EncapsulatedTimestamp.Signers.First().SigningCertificate.ValidityEnd)
                .First().EncapsulatedTimestamp.Signers.First().SigningCertificate;
            if (DateTimeOffset.UtcNow > latestTimestampCertificate.ValidityEnd) {
                throw new Exception($"Latest timestamp has already expired (date of expíration: {latestTimestampCertificate.ValidityEnd}, nothing to do");
            }

            // use a TimestampRequester
            var timestamperUrl = "INSERT YOUR URL HERE";
            // if this overload doesn't suit your needs, you can for check others
            var requester = new TimestampRequester(new Uri(timestamperUrl));
            /*
			* extend the timestamp archiving by providing
			* the signature you want to extend;
			* the TimestampRequester and;
			* the policy for the signature; 
			*/
            var signatureContent = openXml.ExtendArchiving(signaturesWithArchiveTstamps, requester, policyMapper);
            var fileResult = StorageMock.Store(signatureContent, ".xml");

            // Generate a model to be shown on the page from each XmlSignature instance retrieved from
            // GetSignatures() method above. This class can be inspected on Models/PKi/OpenXmlSignatureModel.cs
            // file. In this class, we validate each signature based on the policy mapper defined above.
            var sigModels = new XmlSignatureModel(signaturesWithArchiveTstamps, policyMapper);
            var sigList = new List<XmlSignatureModel> {sigModels};
            
            // Render the signatures' information (see file OpenXmlSignaturePki/Index.cshtml for more
            // information on the information returned).
            return View(new OpenXmlSignatureModel() {
                Signatures = sigList,
                File = fileResult,
            });
        }

        public void Resign(string userfile) {
            // Our action only works if a userfile is given to work with.
            byte[] userfileContent;
            if (!StorageMock.TryGetFile(userfile, out userfileContent)) {
                //return HttpNotFound();
            }



        }
    }
}