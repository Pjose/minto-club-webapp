package com.pjdereva.minto.membership.service;

import com.pjdereva.minto.membership.dto.MemberDTO;
import com.pjdereva.minto.membership.model.transaction.Member;
import com.pjdereva.minto.membership.model.transaction.MembershipStatus;
import com.pjdereva.minto.membership.payload.response.MemberStatistics;

import java.util.List;
import java.util.Optional;

public interface MemberService {
    public Member createMemberFromApplication(Long applicationId);
    public void activateMember(Long memberId);
    public void suspendMembership(Long memberId, String reason);
    public void terminateMembership(Long memberId, String reason);
    public MemberStatistics getMemberStatistics();

    Optional<Member> createMember(MemberDTO memberDTO);
    MemberDTO saveMember(MemberDTO memberDTO);
    List<Member> getAllMembers();
    Member getMemberById(Long id);
    Member getMemberByUserId(Long userId);
    Member getMemberByUserEmail(String email);
    MemberDTO findByEmail(String email);
    List<Member> findAllByStatus(MembershipStatus status);
    List<Member> findAllByStatusIn(List<MembershipStatus> statuses);
    boolean existById(Long id);
    Member updateMember(Member member);
    boolean deleteMemberById(Long id);

}
