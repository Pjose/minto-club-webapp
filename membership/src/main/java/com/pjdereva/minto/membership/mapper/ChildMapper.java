package com.pjdereva.minto.membership.mapper;

import com.pjdereva.minto.membership.dto.application.ChildDTO;
import com.pjdereva.minto.membership.model.transaction.Child;
import com.pjdereva.minto.membership.model.transaction.ChildType;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;
import java.util.Set;

@Mapper(componentModel = "spring", uses = {ContactMapper.class, PersonMapper.class})
public interface ChildMapper {

    //ChildMapper INSTANCE = Mappers.getMapper(ChildMapper.class);

    @Mapping(target = "person.firstName", source = "childDTO.firstName")
    @Mapping(target = "person.middleName", source = "childDTO.middleName")
    @Mapping(target = "person.lastName", source = "childDTO.lastName")
    @Mapping(target = "person.dob", source = "childDTO.dob")
    @Mapping(target = "person.lifeStatus", source = "childDTO.lifeStatus")
    @Mapping(target = "person.createdAt", source = "childDTO.createdAt")
    @Mapping(target = "person.updatedAt", source = "childDTO.updatedAt")
    @Mapping(target = "person.contact", source = "childDTO.contact")
    @Mapping(target = "application", ignore = true)
    Child toChild(ChildDTO childDTO);

    @Mapping(target = "firstName", source = "child.person.firstName")
    @Mapping(target = "middleName", source = "child.person.middleName")
    @Mapping(target = "lastName", source = "child.person.lastName")
    @Mapping(target = "dob", source = "child.person.dob", dateFormat = "yyyy-MM-dd")
    @Mapping(target = "lifeStatus", source = "child.person.lifeStatus")
    @Mapping(target = "createdAt", source = "child.person.createdAt", dateFormat = "yyyy-MM-dd HH:mm:ss")
    @Mapping(target = "updatedAt", source = "child.person.updatedAt", dateFormat = "yyyy-MM-dd HH:mm:ss")
    @Mapping(target = "contact", source = "child.person.contact")
    ChildDTO toChildDTO(Child child);

    List<ChildDTO> toChildDTOs(List<Child> children);
    Set<ChildDTO> childSetToChildDTOSet(Set<Child> children);
    Set<Child> childDTOSetToChildSet(Set<ChildDTO> childrenDTOS);

    default String mapChildTypeToLabel(ChildType childType) {
        if(childType == null) {
            return null;
        }
        return childType.getLabel();
    }
}
