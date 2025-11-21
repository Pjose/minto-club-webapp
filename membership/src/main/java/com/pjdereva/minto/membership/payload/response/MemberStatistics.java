package com.pjdereva.minto.membership.payload.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class MemberStatistics {
    private long totalActive;
    private long totalSuspended;
    private long totalTerminated;
}
