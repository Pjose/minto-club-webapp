package com.pjdereva.minto.membership.mapper;

import com.pjdereva.minto.membership.dto.application.BeneficiaryDTO;
import com.pjdereva.minto.membership.dto.application.PersonDTO;
import com.pjdereva.minto.membership.model.Person;
import com.pjdereva.minto.membership.model.transaction.Beneficiary;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;
import java.util.Set;

@Mapper(componentModel = "spring", uses = {ContactMapper.class, PersonMapper.class})
public interface BeneficiaryMapper {

    @Mapping(target = "person.firstName", source = "beneficiaryDTO.firstName")
    @Mapping(target = "person.middleName", source = "beneficiaryDTO.middleName")
    @Mapping(target = "person.lastName", source = "beneficiaryDTO.lastName")
    @Mapping(target = "person.dob", source = "beneficiaryDTO.dob")
    @Mapping(target = "person.lifeStatus", source = "beneficiaryDTO.lifeStatus")
    @Mapping(target = "person.createdAt", source = "beneficiaryDTO.createdAt")
    @Mapping(target = "person.updatedAt", source = "beneficiaryDTO.updatedAt")
    @Mapping(target = "person.contact", source = "beneficiaryDTO.contact")
    @Mapping(target = "application", ignore = true)
    Beneficiary toBeneficiary(BeneficiaryDTO beneficiaryDTO);

    @Mapping(target = "firstName", source = "beneficiary.person.firstName")
    @Mapping(target = "middleName", source = "beneficiary.person.middleName")
    @Mapping(target = "lastName", source = "beneficiary.person.lastName")
    @Mapping(target = "dob", source = "beneficiary.person.dob", dateFormat = "yyyy-MM-dd")
    @Mapping(target = "lifeStatus", source = "beneficiary.person.lifeStatus")
    @Mapping(target = "createdAt", source = "beneficiary.person.createdAt", dateFormat = "yyyy-MM-dd HH:mm:ss")
    @Mapping(target = "updatedAt", source = "beneficiary.person.updatedAt", dateFormat = "yyyy-MM-dd HH:mm:ss")
    @Mapping(target = "contact", source = "beneficiary.person.contact")
    BeneficiaryDTO toBeneficiaryDTO(Beneficiary beneficiary);

    List<BeneficiaryDTO> toBeneficiaryDTOs(List<Beneficiary> beneficiaries);
    Set<BeneficiaryDTO> beneficiarySetToBeneficiaryDTOSet(Set<Beneficiary> beneficiaries);
    Set<Beneficiary> beneficiaryDTOSetToBeneficiarySet(Set<BeneficiaryDTO> beneficiaryDTOS);
}
