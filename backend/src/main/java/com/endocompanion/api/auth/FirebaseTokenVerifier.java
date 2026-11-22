package com.endocompanion.api.auth;

import com.google.firebase.auth.FirebaseAuthException;

public interface FirebaseTokenVerifier {
    String verify(String idToken) throws FirebaseAuthException;
}
