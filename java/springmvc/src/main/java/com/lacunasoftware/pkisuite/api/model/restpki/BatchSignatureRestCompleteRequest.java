package com.lacunasoftware.pkisuite.api.model.restpki;

import java.util.Base64;
import java.util.regex.Pattern;

public class BatchSignatureRestCompleteRequest {
    private String signatureBase64;
    private byte[] signatureBytes;
    private String token;

    // Regular expression for Base64 validation
    private static final Pattern BASE64_PATTERN = Pattern.compile("^(?:[A-Za-z0-9+/]{4})*" +
                                                                  "(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$");

    // Getter and setter for Base64 signature
    public String getSignatureBase64() {
        return signatureBase64;
    }

    public void setSignatureBase64(String input) {
        if (isBase64Encoded(input)) {
            // If the input is valid Base64, store it directly
            this.signatureBase64 = input;
            this.signatureBytes = Base64.getDecoder().decode(input);
        } else {
            // If the input is not Base64, encode it
            this.signatureBytes = input.getBytes(); // Assume input is raw string data
            this.signatureBase64 = Base64.getEncoder().encodeToString(this.signatureBytes);
        }
    }

    // Getter for the decoded byte array
    public byte[] getSignatureBytes() {
        if(this.signatureBytes != null){
            return signatureBytes;
        }
        setSignatureBase64(signatureBase64);
        return signatureBytes;
    }

    // Getter and setter for token
    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    // Utility method to check if a string is Base64-encoded
    private boolean isBase64Encoded(String input) {
        if (input == null || input.isEmpty()) {
            return false; // Null or empty string is not valid Base64
        }
        return BASE64_PATTERN.matcher(input).matches();
    }
}
