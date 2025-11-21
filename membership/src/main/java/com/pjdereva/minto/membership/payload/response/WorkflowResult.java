package com.pjdereva.minto.membership.payload.response;

import lombok.Data;

@Data
public class WorkflowResult {
    private boolean success;
    private String message;

    // User info
    private Long userId;
    private String email;
    private String userRole;
    private boolean userIsMember;

    // Application info
    private Long applicationId;
    private String applicationNumber;
    private String applicationStatus;

    // Member info
    private Long memberId;
    private String membershipNumber;
    private String membershipStatus;
}
