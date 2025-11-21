package com.pjdereva.minto.membership.repository;

import com.pjdereva.minto.membership.model.Address;
import com.pjdereva.minto.membership.model.AddressType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AddressRepository extends JpaRepository<Address, Long> {

    List<Address> findByContactId(Long contactId);
    List<Address> findByContactIdAndAddressType(Long contactId, AddressType addressType);
}
