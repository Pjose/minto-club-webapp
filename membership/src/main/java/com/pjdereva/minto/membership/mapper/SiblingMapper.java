package com.pjdereva.minto.membership.mapper;

import com.pjdereva.minto.membership.dto.application.SiblingDTO;
import com.pjdereva.minto.membership.model.transaction.Sibling;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

import java.util.List;

@Mapper(componentModel = "spring")
public interface SiblingMapper {

    SiblingMapper INSTANCE = Mappers.getMapper(SiblingMapper.class);

    Sibling toSibling(SiblingDTO siblingDTO);

    SiblingDTO toSiblingDTO(Sibling sibling);

    List<SiblingDTO> toSiblingDTOs(List<Sibling> siblings);
}
