package com.pjdereva.minto.membership.dto.application;

import lombok.*;
import lombok.experimental.SuperBuilder;

@Data
@AllArgsConstructor
@NoArgsConstructor
@SuperBuilder
@EqualsAndHashCode(callSuper = true)
public class RefereeDTO extends PersonDTO {

    private Long id;
    private String membershipNumber;
    private String comments;
    private String notes;
    private String referenceDate;
    private boolean contacted;
}
