package com.pjdereva.minto.membership.dto.application;


import com.pjdereva.minto.membership.dto.GetUserDTO;
import com.pjdereva.minto.membership.model.transaction.MaritalStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Set;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ApplicationDTO {

    private Long id;
    private String applicationNumber;
    private String applicationStatus;
    private GetUserDTO user;
    private PersonDTO person;
    private MaritalStatus maritalStatus;
    private Set<ParentDTO> parents;
    private Set<SpouseDTO> spouses;
    private Set<ChildDTO> children;
    private Set<SiblingDTO> siblings;
    private Set<RefereeDTO> referees;
    private Set<RelativeDTO> relatives;
    private Set<BeneficiaryDTO> beneficiaries;
    private String submittedDate;
    private String approvedDate;
    private String rejectedDate;
    private String notes;
    private String rejectionReason;
    private String appCreatedAt;
    private String appUpdatedAt;
    private boolean editable;
    private boolean approved;
    private boolean submitted;
}
