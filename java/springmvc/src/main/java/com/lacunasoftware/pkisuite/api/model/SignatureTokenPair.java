package com.lacunasoftware.pkisuite.api.model;
import java.util.List;

public class SignatureTokenPair {
    private String signature;
    private String token;

    // Constructor
    public SignatureTokenPair(String signature, String token) {
        this.signature = signature;
        this.token = token;
    }

    // Getters and Setters
    public String getSignature() {
        return signature;
    }

    public void setSignature(String signature) {
        this.signature = signature;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }
}
