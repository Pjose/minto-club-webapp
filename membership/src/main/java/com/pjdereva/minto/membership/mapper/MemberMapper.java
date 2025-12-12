package com.pjdereva.minto.membership.mapper;

import com.pjdereva.minto.membership.dto.MemberDTO;
import com.pjdereva.minto.membership.model.transaction.Member;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

import java.util.List;

@Mapper(componentModel = "spring")
public interface MemberMapper {

    MemberMapper INSTANCE = Mappers.getMapper(MemberMapper.class);

    Member toMember(MemberDTO memberDTO);

    @Mapping(target = "startDate", dateFormat = "yyyy-MM-dd")
    @Mapping(target = "endDate", dateFormat = "yyyy-MM-dd")
    @Mapping(target = "renewalDate", dateFormat = "yyyy-MM-dd")
    @Mapping(target = "terminationDate", dateFormat = "yyyy-MM-dd")
    @Mapping(target = "memberCreatedAt", dateFormat = "yyyy-MM-dd HH:mm:ss")
    @Mapping(target = "memberUpdatedAt", dateFormat = "yyyy-MM-dd HH:mm:ss")
    MemberDTO toMemberDTO(Member member);

    List<MemberDTO> toMemberDTOs(List<Member> members);

}
