package com.pjdereva.minto.membership.mapper;

import com.pjdereva.minto.membership.dto.application.ChildDTO;
import com.pjdereva.minto.membership.model.transaction.Child;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

import java.util.List;

@Mapper(componentModel = "spring")
public interface ChildMapper {

    ChildMapper INSTANCE = Mappers.getMapper(ChildMapper.class);

    Child toChild(ChildDTO childDTO);

    ChildDTO toChildDTO(Child child);

    List<ChildDTO> toChildDTOs(List<Child> children);
}
