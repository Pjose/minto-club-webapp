package com.pjdereva.minto.membership.mapper;

import com.pjdereva.minto.membership.dto.application.PersonDTO;
import com.pjdereva.minto.membership.dto.application.SpouseDTO;
import com.pjdereva.minto.membership.model.Person;
import com.pjdereva.minto.membership.model.transaction.MaritalStatus;
import com.pjdereva.minto.membership.model.transaction.Spouse;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

import java.util.List;
import java.util.Set;

@Mapper(componentModel = "spring", uses = {PersonMapper.class, ContactMapper.class})
public interface SpouseMapper {

    //SpouseMapper INSTANCE = Mappers.getMapper(SpouseMapper.class);

    @Mapping(target = "person.firstName", source = "spouseDTO.firstName")
    @Mapping(target = "person.middleName", source = "spouseDTO.middleName")
    @Mapping(target = "person.lastName", source = "spouseDTO.lastName")
    @Mapping(target = "person.dob", source = "spouseDTO.dob")
    @Mapping(target = "person.lifeStatus", source = "spouseDTO.lifeStatus")
    @Mapping(target = "person.createdAt", source = "spouseDTO.createdAt")
    @Mapping(target = "person.updatedAt", source = "spouseDTO.updatedAt")
    @Mapping(target = "person.contact", source = "spouseDTO.contact")
    @Mapping(target = "application", ignore = true)
    Spouse toSpouse(SpouseDTO spouseDTO);

    @Mapping(target = "firstName", source = "spouse.person.firstName")
    @Mapping(target = "middleName", source = "spouse.person.middleName")
    @Mapping(target = "lastName", source = "spouse.person.lastName")
    @Mapping(target = "dob", source = "spouse.person.dob", dateFormat = "yyyy-MM-dd")
    @Mapping(target = "lifeStatus", source = "spouse.person.lifeStatus")
    @Mapping(target = "createdAt", source = "spouse.person.createdAt", dateFormat = "yyyy-MM-dd HH:mm:ss")
    @Mapping(target = "updatedAt", source = "spouse.person.updatedAt", dateFormat = "yyyy-MM-dd HH:mm:ss")
    @Mapping(target = "contact", source = "spouse.person.contact")
    SpouseDTO toSpouseDTO(Spouse spouse);

    List<SpouseDTO> toSpouseDTOs(List<Spouse> spouses);
    Set<SpouseDTO> spouseSetToSpouseDTOSet(Set<Spouse> spouses);
    Set<Person> spouseDTOSetToSpouseSet(Set<SpouseDTO> spouseDTOS);

    default String mapMaritalStatusToLabel(MaritalStatus maritalStatus) {
        if(maritalStatus == null) {
            return null;
        }
        return maritalStatus.getLabel();
    }
}
