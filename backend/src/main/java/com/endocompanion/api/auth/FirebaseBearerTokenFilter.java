package com.endocompanion.api.auth;

import com.google.firebase.auth.FirebaseAuthException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.web.filter.OncePerRequestFilter;

public class FirebaseBearerTokenFilter extends OncePerRequestFilter {
    private final FirebaseTokenVerifier tokenVerifier;
    private final AuthenticationEntryPoint authenticationEntryPoint;

    public FirebaseBearerTokenFilter(
            FirebaseTokenVerifier tokenVerifier,
            AuthenticationEntryPoint authenticationEntryPoint) {
        this.tokenVerifier = tokenVerifier;
        this.authenticationEntryPoint = authenticationEntryPoint;
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain) throws ServletException, IOException {
        String authorization = request.getHeader("Authorization");
        if (authorization == null || !authorization.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        String idToken = authorization.substring("Bearer ".length()).trim();
        try {
            String uid = tokenVerifier.verify(idToken);
            var authentication = new UsernamePasswordAuthenticationToken(uid, null, List.of());
            SecurityContextHolder.getContext().setAuthentication(authentication);
        } catch (FirebaseAuthException exception) {
            SecurityContextHolder.clearContext();
            authenticationEntryPoint.commence(
                    request,
                    response,
                    new BadCredentialsException("Invalid Firebase ID token", exception));
            return;
        }

        filterChain.doFilter(request, response);
    }
}
