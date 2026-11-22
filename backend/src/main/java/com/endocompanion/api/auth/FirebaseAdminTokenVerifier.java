package com.endocompanion.api.auth;

import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseAuthException;
import org.springframework.stereotype.Component;

@Component
public class FirebaseAdminTokenVerifier implements FirebaseTokenVerifier {
    private final FirebaseAuth firebaseAuth;

    public FirebaseAdminTokenVerifier(FirebaseAuth firebaseAuth) {
        this.firebaseAuth = firebaseAuth;
    }

    @Override
    public String verify(String idToken) throws FirebaseAuthException {
        return firebaseAuth.verifyIdToken(idToken).getUid();
    }
}
