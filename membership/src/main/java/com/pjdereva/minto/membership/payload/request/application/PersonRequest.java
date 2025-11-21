package com.pjdereva.minto.membership.payload.request.application;

import com.pjdereva.minto.membership.model.transaction.LifeStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
@SuperBuilder
public class PersonRequest {

    private String firstName;
    private String lastName;
    private String middleName;
    private LocalDate dob;
    private LifeStatus lifeStatus;
    private ContactRequest contact;
}
