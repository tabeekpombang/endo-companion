package com.endocompanion.api.auth;

import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
public class SecurityConfiguration {
    @Bean
    AuthenticationEntryPoint authenticationEntryPoint() {
        return (request, response, exception) -> response.sendError(401, "Authentication required");
    }

    @Bean
    FirebaseBearerTokenFilter firebaseBearerTokenFilter(
            FirebaseTokenVerifier tokenVerifier,
            AuthenticationEntryPoint authenticationEntryPoint) {
        return new FirebaseBearerTokenFilter(tokenVerifier, authenticationEntryPoint);
    }

    @Bean
    FilterRegistrationBean<FirebaseBearerTokenFilter> firebaseBearerFilterRegistration(
            FirebaseBearerTokenFilter filter) {
        FilterRegistrationBean<FirebaseBearerTokenFilter> registration = new FilterRegistrationBean<>(filter);
        registration.setEnabled(false);
        return registration;
    }

    @Bean
    SecurityFilterChain securityFilterChain(
            HttpSecurity http,
            FirebaseBearerTokenFilter firebaseBearerTokenFilter,
            AuthenticationEntryPoint authenticationEntryPoint) throws Exception {
        return http
                .csrf(csrf -> csrf.disable())
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .exceptionHandling(exceptions -> exceptions.authenticationEntryPoint(authenticationEntryPoint))
                .authorizeHttpRequests(authorize -> authorize
                        .requestMatchers("/api/v1/**").authenticated()
                        .anyRequest().permitAll())
                .addFilterBefore(firebaseBearerTokenFilter, UsernamePasswordAuthenticationFilter.class)
                .build();
    }
}
