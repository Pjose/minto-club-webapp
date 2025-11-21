package com.pjdereva.minto.membership.payload.request.application;

import lombok.*;
import lombok.experimental.SuperBuilder;

@Data
@AllArgsConstructor
@NoArgsConstructor
@SuperBuilder
@EqualsAndHashCode(callSuper = true)
public class RefereeRequest extends PersonRequest {

    private String membershipNumber;
}
