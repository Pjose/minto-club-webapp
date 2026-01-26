package com.pjdereva.minto.membership.payload.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class MemberResponse {
    private boolean success;
    private String message;
    private String membershipNumber;
    private Long memberId;
    private Long applicationId;
    private String userFullName;
}
