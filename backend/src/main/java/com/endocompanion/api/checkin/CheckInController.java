package com.endocompanion.api.checkin;

import jakarta.validation.Valid;
import java.util.List;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/check-ins")
public class CheckInController {
    private final CheckInService checkInService;

    public CheckInController(CheckInService checkInService) {
        this.checkInService = checkInService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public CheckInResponse create(
            @Valid @RequestBody CreateCheckInRequest request,
            Authentication authentication) {
        return checkInService.create((String) authentication.getPrincipal(), request);
    }

    @GetMapping
    public List<CheckInResponse> list(Authentication authentication) {
        return checkInService.list((String) authentication.getPrincipal());
    }

    @PutMapping("/{id}")
    public CheckInResponse update(
            @PathVariable UUID id,
            @Valid @RequestBody CreateCheckInRequest request,
            Authentication authentication) {
        return checkInService.update(id, (String) authentication.getPrincipal(), request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable UUID id, Authentication authentication) {
        checkInService.delete(id, (String) authentication.getPrincipal());
    }
}
