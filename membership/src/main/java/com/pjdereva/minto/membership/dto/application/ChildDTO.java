package com.pjdereva.minto.membership.dto.application;

import lombok.*;
import lombok.experimental.SuperBuilder;

@Data
@AllArgsConstructor
@NoArgsConstructor
@SuperBuilder
@EqualsAndHashCode(callSuper = true)
public class ChildDTO extends PersonDTO {

    private Long id;
    private String childType;
    private String notes;
}
