package com.pjdereva.minto.membership.payload.request.application;

import lombok.*;
import lombok.experimental.SuperBuilder;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
@NoArgsConstructor
@SuperBuilder
@EqualsAndHashCode(callSuper = true)
public class BeneficiaryRequest extends PersonRequest {

    private BigDecimal percentage;
    private String relationship;
}
