package com.pjdereva.minto.membership.mapper;

import com.pjdereva.minto.membership.dto.application.RelativeDTO;
import com.pjdereva.minto.membership.model.transaction.Relative;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

import java.util.List;

@Mapper(componentModel = "spring")
public interface RelativeMapper {

    RelativeMapper INSTANCE = Mappers.getMapper(RelativeMapper.class);

    @Mapping(target = "application", ignore = true)
    Relative toRelative(RelativeDTO relativeDTO);

    RelativeDTO toRelativeDTO(Relative relative);

    List<RelativeDTO> toRelativeDTOs(List<Relative> relatives);
}
