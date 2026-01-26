package com.pjdereva.minto.membership.payload.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ApplicationResponse {
    private boolean success;
    private String message;
    private String applicationNumber;
    private Long applicationId;
    private Long userId;
}
