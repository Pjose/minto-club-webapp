package com.pjdereva.minto.membership.payload.response;

import lombok.Data;

import java.time.LocalDate;

@Data
public class UserJourney {
    private Long userId;
    private String username;
    private String currentRole;
    private boolean emailVerified;
    private String accountStatus;
    private java.time.LocalDateTime registrationDate;

    private int totalApplications;
    private java.util.Map<String, String> applicationStatuses = new java.util.HashMap<>();

    private boolean isMember;
    private String membershipNumber;
    private String membershipStatus;
    private LocalDate memberSince;
}
