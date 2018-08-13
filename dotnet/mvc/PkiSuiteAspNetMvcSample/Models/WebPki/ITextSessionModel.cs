using iTextSharp.text.pdf;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;

namespace PkiSuiteAspNetMvcSample.Models.WebPki {
	public class ITextSessionModel {
		public PdfSignatureAppearance SignatureApperance { get; set; }
		public MemoryStream SignedPdfStream { get; set; }
		public byte[] RangeDigest { get; set; }
	}
}