package com.pjdereva.minto.membership.mapper;

import com.pjdereva.minto.membership.dto.application.RefereeDTO;
import com.pjdereva.minto.membership.dto.application.RelativeDTO;
import com.pjdereva.minto.membership.model.transaction.FamilyRelationship;
import com.pjdereva.minto.membership.model.transaction.Referee;
import com.pjdereva.minto.membership.model.transaction.Relative;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

import java.util.List;
import java.util.Set;

@Mapper(componentModel = "spring", uses = {ContactMapper.class, PersonMapper.class})
public interface RelativeMapper {

    //RelativeMapper INSTANCE = Mappers.getMapper(RelativeMapper.class);

    @Mapping(target = "person.firstName", source = "relativeDTO.firstName")
    @Mapping(target = "person.middleName", source = "relativeDTO.middleName")
    @Mapping(target = "person.lastName", source = "relativeDTO.lastName")
    @Mapping(target = "person.dob", source = "relativeDTO.dob")
    @Mapping(target = "person.lifeStatus", source = "relativeDTO.lifeStatus")
    @Mapping(target = "person.createdAt", source = "relativeDTO.createdAt")
    @Mapping(target = "person.updatedAt", source = "relativeDTO.updatedAt")
    @Mapping(target = "person.contact", source = "relativeDTO.contact")
    @Mapping(target = "application", ignore = true)
    Relative toRelative(RelativeDTO relativeDTO);

    @Mapping(target = "firstName", source = "relative.person.firstName")
    @Mapping(target = "middleName", source = "relative.person.middleName")
    @Mapping(target = "lastName", source = "relative.person.lastName")
    @Mapping(target = "dob", source = "relative.person.dob", dateFormat = "yyyy-MM-dd")
    @Mapping(target = "lifeStatus", source = "relative.person.lifeStatus")
    @Mapping(target = "createdAt", source = "relative.person.createdAt", dateFormat = "yyyy-MM-dd HH:mm:ss")
    @Mapping(target = "updatedAt", source = "relative.person.updatedAt", dateFormat = "yyyy-MM-dd HH:mm:ss")
    @Mapping(target = "contact", source = "relative.person.contact")
    RelativeDTO toRelativeDTO(Relative relative);

    List<RelativeDTO> toRelativeDTOs(List<Relative> relatives);
    Set<RelativeDTO> relativeSetToRelativeDTOSet(Set<Relative> relatives);
    Set<Relative> relativeDTOSetToRelativeSet(Set<RelativeDTO> relativeDTOS);

    default String mapFamilyRelationshipToLabel(FamilyRelationship familyRelationship) {
        if(familyRelationship == null) {
            return null;
        }
        return familyRelationship.getLabel();
    }
}
