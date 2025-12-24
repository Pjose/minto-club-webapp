package com.pjdereva.minto.membership.mapper;

import com.pjdereva.minto.membership.dto.application.ApplicationDTO;
import com.pjdereva.minto.membership.model.transaction.Application;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

import java.util.List;

@Mapper(componentModel = "spring", uses = {PersonMapper.class, ParentMapper.class, SpouseMapper.class,
ChildMapper.class, SiblingMapper.class, RefereeMapper.class, RelativeMapper.class, BeneficiaryMapper.class,
UserMapper.class})
public interface ApplicationMapper {

    //ApplicationMapper INSTANCE = Mappers.getMapper(ApplicationMapper.class);

    @Mapping(target = "member", ignore = true)
    Application toApplication(ApplicationDTO applicationDTO);

    @Mapping(target = "submittedDate", dateFormat = "yyyy-MM-dd HH:mm:ss")
    @Mapping(target = "approvedDate", dateFormat = "yyyy-MM-dd HH:mm:ss")
    @Mapping(target = "rejectedDate", dateFormat = "yyyy-MM-dd HH:mm:ss")
    @Mapping(target = "appCreatedAt", dateFormat = "yyyy-MM-dd HH:mm:ss")
    @Mapping(target = "appUpdatedAt", dateFormat = "yyyy-MM-dd HH:mm:ss")
    ApplicationDTO toApplicationDTO(Application application);

    List<ApplicationDTO> toApplicationDTOs(List<Application> applications);
}
