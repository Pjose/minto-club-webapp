package com.pjdereva.minto.membership.service.impl;

import com.pjdereva.minto.membership.dto.MemberDTO;
import com.pjdereva.minto.membership.exception.ApplicationIdNotFoundException;
import com.pjdereva.minto.membership.exception.MemberIdNotFoundException;
import com.pjdereva.minto.membership.exception.UserEmailNotFoundException;
import com.pjdereva.minto.membership.exception.UserIdNotFoundException;
import com.pjdereva.minto.membership.mapper.MemberMapper;
import com.pjdereva.minto.membership.model.Person;
import com.pjdereva.minto.membership.model.User;
import com.pjdereva.minto.membership.model.transaction.Application;
import com.pjdereva.minto.membership.model.transaction.Member;
import com.pjdereva.minto.membership.model.transaction.MembershipStatus;
import com.pjdereva.minto.membership.payload.response.MemberStatistics;
import com.pjdereva.minto.membership.repository.ApplicationRepository;
import com.pjdereva.minto.membership.repository.MemberRepository;
import com.pjdereva.minto.membership.repository.UserRepository;
import com.pjdereva.minto.membership.service.MemberService;
import com.pjdereva.minto.membership.service.UserService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class MemberServiceImpl implements MemberService {

    private final UserRepository userRepository;
    private final MemberRepository memberRepository;
    private final ApplicationRepository applicationRepository;
    private final UserService userService;
    private final MemberMapper memberMapper;

    /**
     * Convert approved application to membership
     * This also upgrades the User from GUEST to MEMBER role
     */
    @Transactional
    public Member createMemberFromApplication(Long applicationId) {
        Application application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new RuntimeException("Application not found"));

        // Validate
        if (!application.canConvertToMember()) {
            throw new IllegalStateException("Application cannot be converted to membership");
        }

        User user = application.getUser();
        Person person = application.getPerson();

        // Create member
        Member member = Member.builder()
                .membershipNumber(generateMembershipNumber())
                .status(MembershipStatus.ACTIVE)
                .user(user)
                .person(person)
                .application(application)
                .startDate(LocalDate.now())
                .endDate(LocalDate.now().plusYears(1))
                //.membershipFee(new BigDecimal("100.00"))
                //.nextPaymentDue(LocalDate.now().plusYears(1))
                //.feePaid(false)
                //.orientationCompleted(false)
                //.cardIssued(false)
                .notes("Member created from application: " + application.getApplicationNumber())
                .build();

        member = memberRepository.save(member);

        // Upgrade user to MEMBER role
        userService.upgradeUserToMember(user.getId());

        log.info("Member {} created from application {} for user {}",
                member.getMembershipNumber(),
                application.getApplicationNumber(),
                user.getUsername());

        return member;
    }

    /**
     * Activate member after payment and orientation
     */
    @Transactional
    public void activateMember(Long memberId) {
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new RuntimeException("Member not found"));

        member.activate();
        memberRepository.save(member);
    }

    /**
     * Suspend membership
     */
    @Transactional
    public void suspendMembership(Long memberId, String reason) {
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new RuntimeException("Member not found"));

        member.suspend(reason);
        memberRepository.save(member);

        // User keeps MEMBER role but account may be suspended separately if needed
        log.info("Member {} suspended", member.getMembershipNumber());
    }

    /**
     * Terminate membership - also downgrades user back to GUEST
     */
    @Transactional
    public void terminateMembership(Long memberId, String reason) {
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new RuntimeException("Member not found"));

        member.terminate(reason);
        memberRepository.save(member);

        // Downgrade user back to GUEST role (can reapply)
        userService.downgradeMemberToGuest(member.getUser().getId());

        log.info("Member {} terminated and user downgraded to GUEST",
                member.getMembershipNumber());
    }

    /**
     * Get member statistics
     */
    @Transactional
    public MemberStatistics getMemberStatistics() {
        long totalActive = memberRepository.countByStatus(MembershipStatus.ACTIVE);
        long totalSuspended = memberRepository.countByStatus(MembershipStatus.SUSPENDED);
        long totalTerminated = memberRepository.countByStatus(MembershipStatus.TERMINATED);

        return MemberStatistics.builder()
                .totalActive(totalActive)
                .totalSuspended(totalSuspended)
                .totalTerminated(totalTerminated)
                .build();
    }

    // Helper methods
    private String generateMembershipNumber() {
        return "MEM-" + LocalDateTime.now().getYear() + "-" +
                UUID.randomUUID().toString().substring(0, 8).toUpperCase();
    }

    @Override
    public Optional<Member> createMember(MemberDTO memberDTO) {
        var application = applicationRepository.findById(memberDTO.getApplication().getId())
                .orElseThrow(() -> new ApplicationIdNotFoundException(memberDTO.getApplication().getId()));

        var user = userRepository.findById(memberDTO.getUser().getId())
                .orElseThrow(() -> new UserIdNotFoundException(memberDTO.getUser().getId()));

        if(!memberRepository.existsByUserIdOrApplicationId(memberDTO.getUser().getId(), memberDTO.getApplication().getId())){
            Member newMember = Member.builder()
                    .user(user)
                    .memberCreatedAt(LocalDateTime.now())
                    .memberUpdatedAt(LocalDateTime.now())
                    .application(application)
                    .build();
            var savedMember = memberRepository.save(newMember);
            return Optional.of(savedMember);
        } else {
            return Optional.empty();
        }
    }

    @Override
    public MemberDTO saveMember(MemberDTO memberDTO) {
        var member = memberRepository.save(memberMapper.toMember(memberDTO));
        return memberMapper.toMemberDTO(member);
    }

    @Override
    public List<Member> getAllMembers() {
        return memberRepository.findAll();
    }

    @Override
    public Member getMemberById(Long id) {
        return memberRepository.findById(id)
                .orElseThrow(() -> new MemberIdNotFoundException(id));
    }

    @Override
    public Member getMemberByUserId(Long userId) {
        return memberRepository.findByUserId(userId)
                .orElseThrow(() -> new UserIdNotFoundException(userId));
    }

    @Override
    public Member getMemberByUserEmail(String userEmail) {
        Member member = null;
        Optional<User> user = userRepository.findByEmail(userEmail);
        if(user.isPresent()) {
             User existingUser = user.get();
             member = memberRepository.findByUserId(existingUser.getId())
                     .orElseThrow(() -> new UserIdNotFoundException(existingUser.getId()));
         }
        return member;
    }

    @Override
    public MemberDTO findByEmail(String email) {
        MemberDTO memberDTO = null;
        var user = userRepository.findByEmail(email);
        if(user.isPresent()) {
            User existingUser = user.get();
            var member = memberRepository.findByUserId(existingUser.getId());
            if(member.isPresent()) {
                Member existingMember = member.get();
                memberDTO = memberMapper.toMemberDTO(existingMember);
            } else {
                throw new MemberIdNotFoundException(existingUser.getId());
            }
        } else {
            throw new UserEmailNotFoundException(email);
        }
        return memberDTO;
    }

    @Override
    public List<Member> findAllByStatus(MembershipStatus status) {
        return memberRepository.findByStatus(status);
    }

    @Override
    public List<Member> findAllByStatusIn(List<MembershipStatus> statuses) {
        return memberRepository.findByStatusIn(statuses);
    }

    @Override
    public boolean existById(Long id) {
        return memberRepository.existsById(id);
    }

    @Override
    public Member updateMember(Member member) {
        member.setMemberUpdatedAt(LocalDateTime.now());
        return memberRepository.save(member);
    }

    @Override
    public boolean deleteMemberById(Long id) {
        try {
            memberRepository.deleteById(id);
        } catch (Exception e) {
            return false;
        }
        return true;
    }
}
