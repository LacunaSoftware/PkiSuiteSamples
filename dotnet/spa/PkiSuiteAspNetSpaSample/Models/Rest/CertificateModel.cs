using Lacuna.RestPki.Client;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace PkiSuiteAspNetSpaSample.Models.Rest {

	public class CertificateSummary {
		public string Thumbprint { get; set; }
		public string SubjectCommonName { get; set; }

		public CertificateSummary(PKCertificate cert) {
			SubjectCommonName = cert.SubjectName.CommonName;
			Thumbprint = string.Join("", cert.ThumbprintSHA1.HexValue);
		}
	}

	public class CertificateModel : CertificateSummary {
		public NameModel SubjectName { get; set; }
		public string EmailAddress { get; set; }
		public CertificateModel Issuer { get; set; }
		public NameModel IssuerName { get; set; }
		public string IssuerDisplayName { get; set; }
		public string SerialNumber { get; set; }
		public DateTimeOffset ValidityStart { get; set; }
		public DateTimeOffset ValidityEnd { get; set; }
		public PkiBrazilCertificateModel PkiBrazil { get; set; }
		public PkiItalyCertificateModel PkiItaly { get; set; }
		public DigestAlgorithmAndValueModel ThumbprintSHA256 { get; set; }
		public DigestAlgorithmAndValueModel ThumbprintSHA1 { get; set; }

		public CertificateModel(PKCertificate cert) : base(cert) {

			IssuerDisplayName = cert.IssuerName.CommonName;
			SerialNumber = cert.SerialNumber.ToString();
			EmailAddress = cert.EmailAddress;
			ValidityStart = cert.ValidityStart;
			ValidityEnd = cert.ValidityEnd;
			ThumbprintSHA256 = new DigestAlgorithmAndValueModel(cert.ThumbprintSHA256);
			ThumbprintSHA1 = new DigestAlgorithmAndValueModel(cert.ThumbprintSHA1);


			if (cert.SubjectName != null) {
				SubjectName = new NameModel(cert.SubjectName);
			}
			if (cert.IssuerName != null) {
				IssuerName = new NameModel(cert.IssuerName);
			}
			if (cert.PkiBrazil != null) {
				PkiBrazil = new PkiBrazilCertificateModel(cert.PkiBrazil);
			}
			if (cert.Issuer != null) {
				Issuer = new CertificateModel(cert.Issuer);
			}
		}

	}

	public class NameModel {

		public string String { get; set; }
		public string Country { get; set; }
		public string Organization { get; set; }
		public string OrganizationUnit { get; set; }
		public string DNQualifier { get; set; }
		public string StateName { get; set; }
		public string CommonName { get; set; }
		public string SerialNumber { get; set; }
		public string Locality { get; set; }
		public string Title { get; set; }
		public string Surname { get; set; }
		public string GivenName { get; set; }
		public string Initials { get; set; }
		public string Pseudonym { get; set; }
		public string GenerationQualifier { get; set; }
		public string EmailAddress { get; set; }

		public NameModel(Name n) {
			String = n.ToString();
			Country = n.Country;
			Organization = n.Organization;
			DNQualifier = n.DNQualifier;
			StateName = n.StateName;
			CommonName = n.CommonName;
			SerialNumber = n.SerialNumber;
			Locality = n.Locality;
			Title = n.Title;
			Surname = n.Surname;
			Initials = n.Initials;
			Pseudonym = n.Pseudonym;
			GenerationQualifier = n.GenerationQualifier;
			EmailAddress = n.EmailAddress;
		}
	}


	public enum PkiBrazilCertificateTypes {
		Unknown = 0,
		A1 = 1,
		A2 = 2,
		A3 = 3,
		A4 = 4,
		S1 = 5,
		S2 = 6,
		S3 = 7,
		S4 = 8,
		T3 = 9,
		T4 = 10
	}

	public class PkiBrazilCertificateModel {

		public PkiBrazilCertificateTypes CertificateType { get; set; }
		public string Cpf { get; set; }
		public string Cnpj { get; set; }
		public string Responsavel { get; set; }
		public string DateOfBirth { get; set; }
		public string CompanyName { get; set; }
		public string OabUF { get; set; }
		public string OabNumero { get; set; }
		public string RGEmissor { get; set; }
		public string RGEmissorUF { get; set; }
		public string RGNumero { get; set; }

		public PkiBrazilCertificateModel(PkiBrazilCertificateFields c) {
			CertificateType = (PkiBrazilCertificateTypes)c.CertificateType;
			Cpf = c.Cpf;
			Cnpj = c.Cnpj;
			Responsavel = c.Responsavel;
			DateOfBirth = c.DateOfBirth?.ToString("yyyy-MM-dd");
			Responsavel = c.Responsavel;
			OabUF = c.OabUF;
			OabNumero = c.OabNumero;
			RGEmissor = c.RGEmissor;
			RGEmissorUF = c.RGEmissorUF;
			RGNumero = c.RGNumero;
		}
	}

	public enum PkiItalyCertificateTypes {
		Undefined = 0,
		Cns,
		DigitalSignature
	}

	public class PkiItalyCertificateModel {

		public PkiItalyCertificateTypes CertificateType { get; set; }
		public string CodiceFiscale { get; set; }
		public string IdCarta { get; set; }

		public PkiItalyCertificateModel(PkiItalyCertificateFields cert) {
			CertificateType = (PkiItalyCertificateTypes)cert.CertificateType;
			CodiceFiscale = cert.CodiceFiscale;
			IdCarta = cert.IdCarta;
		}

	}
}