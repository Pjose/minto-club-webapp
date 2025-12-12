package com.pjdereva.minto.membership.dto.application;

import lombok.*;
import lombok.experimental.SuperBuilder;

@Data
@AllArgsConstructor
@NoArgsConstructor
@SuperBuilder
@EqualsAndHashCode(callSuper = true)
public class ParentDTO extends PersonDTO {

    private Long id;
    private String parentType;
    private String notes;
}
