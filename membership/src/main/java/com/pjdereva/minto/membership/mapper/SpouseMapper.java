package com.pjdereva.minto.membership.mapper;

import com.pjdereva.minto.membership.dto.application.SpouseDTO;
import com.pjdereva.minto.membership.model.transaction.Spouse;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

import java.util.List;

@Mapper(componentModel = "spring", uses = {PersonMapper.class, ContactMapper.class})
public interface SpouseMapper {

    SpouseMapper INSTANCE = Mappers.getMapper(SpouseMapper.class);

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
    @Mapping(target = "dob", source = "spouse.person.dob")
    @Mapping(target = "lifeStatus", source = "spouse.person.lifeStatus")
    @Mapping(target = "createdAt", source = "spouse.person.createdAt")
    @Mapping(target = "updatedAt", source = "spouse.person.updatedAt")
    @Mapping(target = "contact", source = "spouse.person.contact")
    SpouseDTO toSpouseDTO(Spouse spouse);

    List<SpouseDTO> toSpouseDTOs(List<Spouse> spouses);

}
