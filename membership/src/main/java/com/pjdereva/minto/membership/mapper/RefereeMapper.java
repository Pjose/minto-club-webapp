package com.pjdereva.minto.membership.mapper;

import com.pjdereva.minto.membership.dto.application.RefereeDTO;
import com.pjdereva.minto.membership.dto.application.SiblingDTO;
import com.pjdereva.minto.membership.model.transaction.Referee;
import com.pjdereva.minto.membership.model.transaction.Sibling;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

import java.util.List;
import java.util.Set;

@Mapper(componentModel = "spring", uses = {ContactMapper.class, PersonMapper.class})
public interface RefereeMapper {

    //RefereeMapper INSTANCE = Mappers.getMapper(RefereeMapper.class);

    @Mapping(target = "person.firstName", source = "refereeDTO.firstName")
    @Mapping(target = "person.middleName", source = "refereeDTO.middleName")
    @Mapping(target = "person.lastName", source = "refereeDTO.lastName")
    @Mapping(target = "person.dob", source = "refereeDTO.dob")
    @Mapping(target = "person.lifeStatus", source = "refereeDTO.lifeStatus")
    @Mapping(target = "person.createdAt", source = "refereeDTO.createdAt")
    @Mapping(target = "person.updatedAt", source = "refereeDTO.updatedAt")
    @Mapping(target = "person.contact", source = "refereeDTO.contact")
    @Mapping(target = "application", ignore = true)
    @Mapping(target = "referenceDate", dateFormat = "yyyy-MM-dd HH:mm:ss")
    Referee toReferee(RefereeDTO refereeDTO);

    @Mapping(target = "firstName", source = "referee.person.firstName")
    @Mapping(target = "middleName", source = "referee.person.middleName")
    @Mapping(target = "lastName", source = "referee.person.lastName")
    @Mapping(target = "dob", source = "referee.person.dob", dateFormat = "yyyy-MM-dd")
    @Mapping(target = "lifeStatus", source = "referee.person.lifeStatus")
    @Mapping(target = "createdAt", source = "referee.person.createdAt", dateFormat = "yyyy-MM-dd HH:mm:ss")
    @Mapping(target = "updatedAt", source = "referee.person.updatedAt", dateFormat = "yyyy-MM-dd HH:mm:ss")
    @Mapping(target = "contact", source = "referee.person.contact")
    RefereeDTO toRefereeDTO(Referee referee);

    List<RefereeDTO> toRefereeDTOs(List<Referee> referees);
    Set<RefereeDTO> refereeSetToRefereeDTOSet(Set<Referee> referees);
    Set<Referee> refereeDTOSetToRefereeSet(Set<RefereeDTO> refereeDTOS);
}
