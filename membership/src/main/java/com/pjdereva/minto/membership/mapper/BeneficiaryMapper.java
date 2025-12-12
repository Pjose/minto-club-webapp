package com.pjdereva.minto.membership.mapper;

import com.pjdereva.minto.membership.dto.application.BeneficiaryDTO;
import com.pjdereva.minto.membership.model.transaction.Beneficiary;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

import java.util.List;

@Mapper(componentModel = "spring")
public interface BeneficiaryMapper {

    BeneficiaryMapper INSTANCE = Mappers.getMapper(BeneficiaryMapper.class);

    Beneficiary toBeneficiary(BeneficiaryDTO beneficiaryDTO);

    BeneficiaryDTO toBeneficiaryDTO(Beneficiary beneficiary);

    List<BeneficiaryDTO> toBeneficiaryDTOs(List<Beneficiary> beneficiaries);
}
