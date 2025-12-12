package com.pjdereva.minto.membership.dto.application;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@Data
@AllArgsConstructor
@NoArgsConstructor
@SuperBuilder
public class PersonDTO {

    private Long id;
    private String firstName;
    private String middleName;
    private String lastName;
    private String dob;
    private String lifeStatus;
    private String createdAt;
    private String updatedAt;
    private ContactDTO contact;
}
