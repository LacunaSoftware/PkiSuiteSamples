using Lacuna.Pki.Xml;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Xml;

namespace PkiSuiteAspNetMvcSample.Models.Sdk {
	public class XmlSignatureModel {

		public XmlSignedEntityTypes Type { get; set; }
		public XmlElementModel SignedElement { get; set; }
		public SignatureAlgorithmAndValueModel Signature { get; set; }
		public SignaturePolicyIdentifierModel SignaturePolicy { get; set; }
		public CertificateModel Certificate { get; set; }
		public DateTimeOffset? SigningTime { get; set; }
		public DateTimeOffset? CertifiedDateReference { get; set; }
		public List<CadesTimestampModel> Timestamps { get; set; }
		public ValidationResultsModel ValidationResults { get; set; }

		public XmlSignatureModel(XmlSignature signature, IXmlPolicyMapperBySignature policyMapper = null) {

			Type = signature.SignedEntityType;
			SigningTime = signature.SigningTime;
			if (signature.SignedElement != null) {
				SignedElement = new XmlElementModel(signature.SignedElement);
			}
			if (signature.SignatureAlgorithm != null && signature.SignatureValue != null) {
				Signature = new SignatureAlgorithmAndValueModel(signature.SignatureAlgorithm, signature.SignatureValue);
			}
			if (signature.PolicyIdentifier != null) {
				SignaturePolicy = new SignaturePolicyIdentifierModel(signature.PolicyIdentifier);
			}
			if (signature.SigningCertificate != null) {
				Certificate = new CertificateModel(signature.SigningCertificate);
			}
			if (signature.SignatureTimestamps.Any()) {
				CertifiedDateReference = signature.SignatureTimestamps.First().EncapsulatedTimestamp.GenTime;
				Timestamps = signature.SignatureTimestamps.Select(ts => new CadesTimestampModel(ts.EncapsulatedTimestamp)).ToList();
			}

			// Validate signature according to the provided policy.
			if (policyMapper != null) {
				var vr = signature.Validate(policyMapper);
				ValidationResults = new ValidationResultsModel(vr);
			}
		}
	}

	public class XmlElementModel {
		public string NamespaceUri { get; set; }
		public List<XmlAttributeModel> Attributes { get; set; }
		public string LocalName { get; set; }

		public XmlElementModel(XmlElement element) {
			NamespaceUri = element.NamespaceURI;
			LocalName = element.LocalName;
			Attributes = new List<XmlAttributeModel>();
			if (element.Attributes != null && element.Attributes.Count > 0) {
				for (int i = 0; i < element.Attributes.Count; i++) {
					Attributes.Add(new XmlAttributeModel(element.Attributes[i]));
				}
			}
		}
	}

	public class XmlAttributeModel {
		public string LocalName { get; set; }
		public string Value { get; set; }
		public string NamespaceUri { get; set; }

		public XmlAttributeModel(XmlAttribute attribute) {
			LocalName = attribute.LocalName;
			Value = attribute.Value;
			NamespaceUri = attribute.NamespaceURI;
		}
	}
}