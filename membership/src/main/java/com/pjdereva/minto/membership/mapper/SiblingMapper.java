package com.pjdereva.minto.membership.mapper;

import com.pjdereva.minto.membership.dto.application.SiblingDTO;
import com.pjdereva.minto.membership.model.transaction.Sibling;
import com.pjdereva.minto.membership.model.transaction.SiblingType;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;
import java.util.Set;

@Mapper(componentModel = "spring", uses = {ContactMapper.class, PersonMapper.class})
public interface SiblingMapper {

    //SiblingMapper INSTANCE = Mappers.getMapper(SiblingMapper.class);

    @Mapping(target = "person.firstName", source = "siblingDTO.firstName")
    @Mapping(target = "person.middleName", source = "siblingDTO.middleName")
    @Mapping(target = "person.lastName", source = "siblingDTO.lastName")
    @Mapping(target = "person.dob", source = "siblingDTO.dob")
    @Mapping(target = "person.lifeStatus", source = "siblingDTO.lifeStatus")
    @Mapping(target = "person.createdAt", source = "siblingDTO.createdAt")
    @Mapping(target = "person.updatedAt", source = "siblingDTO.updatedAt")
    @Mapping(target = "person.contact", source = "siblingDTO.contact")
    @Mapping(target = "application", ignore = true)
    Sibling toSibling(SiblingDTO siblingDTO);

    @Mapping(target = "firstName", source = "sibling.person.firstName")
    @Mapping(target = "middleName", source = "sibling.person.middleName")
    @Mapping(target = "lastName", source = "sibling.person.lastName")
    @Mapping(target = "dob", source = "sibling.person.dob", dateFormat = "yyyy-MM-dd")
    @Mapping(target = "lifeStatus", source = "sibling.person.lifeStatus")
    @Mapping(target = "createdAt", source = "sibling.person.createdAt", dateFormat = "yyyy-MM-dd HH:mm:ss")
    @Mapping(target = "updatedAt", source = "sibling.person.updatedAt", dateFormat = "yyyy-MM-dd HH:mm:ss")
    @Mapping(target = "contact", source = "sibling.person.contact")
    SiblingDTO toSiblingDTO(Sibling sibling);

    List<SiblingDTO> toSiblingDTOs(List<Sibling> siblings);
    Set<SiblingDTO> siblingSetToSiblingDTOSet(Set<Sibling> siblings);
    Set<Sibling> siblingDTOSetToSiblingSet(Set<SiblingDTO> siblingDTOS);

    default String mapSiblingTypeToLabel(SiblingType siblingType) {
        if(siblingType == null) {
            return null;
        }
        return siblingType.getLabel();
    }
}
