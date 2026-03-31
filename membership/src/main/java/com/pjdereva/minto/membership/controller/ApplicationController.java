package com.pjdereva.minto.membership.controller;

import com.pjdereva.minto.membership.dto.GetUserDTO;
import com.pjdereva.minto.membership.exception.ApplicationIdNotFoundException;
import com.pjdereva.minto.membership.mapper.ApplicationMapper;
import com.pjdereva.minto.membership.mapper.UserMapper;
import com.pjdereva.minto.membership.model.User;
import com.pjdereva.minto.membership.model.transaction.Application;
import com.pjdereva.minto.membership.model.transaction.ApplicationStatus;
import com.pjdereva.minto.membership.dto.application.ApplicationDTO;
import com.pjdereva.minto.membership.payload.response.ApplicationResponse;
import com.pjdereva.minto.membership.payload.response.DraftResponse;
import com.pjdereva.minto.membership.service.impl.ApplicationServiceImpl;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@Slf4j
@RestController
@RequiredArgsConstructor
@CrossOrigin(origins = "${frontend.url}")
@RequestMapping("/api/v1/applications")
public class ApplicationController {

    private final ApplicationServiceImpl applicationService;
    private final ApplicationMapper applicationMapper;
    private final UserMapper userMapper;

    @GetMapping
    public ResponseEntity<List<Application>> getAllApplications() {
        List<Application> applications = applicationService.getAllApplications();
        return ResponseEntity.ok(applications);
    }

    @GetMapping("/dto")
    public ResponseEntity<List<ApplicationDTO>> getAllApplicationsDTO() {
        List<Application> applications = applicationService.getAllApplications();
        return ResponseEntity.ok(applicationMapper.toApplicationDTOs(applications));
    }

    @GetMapping("/id/{id}")
    public ResponseEntity<?> getApplicationById(@PathVariable Long id) {
        var application = applicationService.findById(id);
        return application.map(value -> new ResponseEntity<>(value, HttpStatus.OK))
                .orElseThrow(() -> new ApplicationIdNotFoundException(id));
    }

    @GetMapping("/dto/id/{id}")
    public ResponseEntity<?> getApplicationDTOById(@PathVariable Long id) {
        var application = applicationService.findById(id);
        return application.map(value -> new ResponseEntity<>(applicationMapper.toApplicationDTO(value), HttpStatus.OK))
                .orElseThrow(() -> new ApplicationIdNotFoundException(id));
    }

    @GetMapping("/dto/user")
    public ResponseEntity<List<ApplicationDTO>> findAllDTOsByUser(
            Principal currentUser) {

        var user = (User) ((UsernamePasswordAuthenticationToken) currentUser).getPrincipal();

        log.info("Finding all applications for user: {} {}", user.getFirstName(), user.getLastName());

        List<ApplicationDTO> applications = applicationService.findAllByUser(user.getId());
        return ResponseEntity.ok(applications);
    }

    // TODO: Fix repository SQL
    @GetMapping("/person/{id}")
    public ResponseEntity<?> getApplicationByIdWithPersonAndContact(@PathVariable Long id) {
        var applicationDTO = applicationService.findByIdWithPersonAndContact(id);
        return applicationDTO.map(value -> new ResponseEntity<>(value, HttpStatus.OK))
                .orElseThrow(() -> new ApplicationIdNotFoundException(id));
    }

    @GetMapping("/status/{appStatus}")
    public ResponseEntity<List<ApplicationDTO>> getAllByApplicationStatus(
            @PathVariable String appStatus
    ) {
        List<Application> applications = applicationService.findAllByApplicationStatus(ApplicationStatus.fromLabel(appStatus));
        return ResponseEntity.ok(applicationMapper.toApplicationDTOs(applications));
    }

    @GetMapping("/status/in/{appStatuses}")
    public ResponseEntity<List<ApplicationDTO>> getAllByApplicationStatusIn(
            @PathVariable List<String> appStatuses
    ) {
        List<ApplicationStatus> statuses = appStatuses.stream()
                .map(ApplicationStatus::fromLabel)
                .toList();
        List<Application> applications = applicationService.findAllByApplicationStatusIn(statuses);
        return ResponseEntity.ok(applicationMapper.toApplicationDTOs(applications));
    }

    /**
     * Get all applications by user.
     * GET /api/v1/applications/user?id=
     */
    @GetMapping("/user")
    public ResponseEntity<?> getAllByUser(@RequestParam Long id) {
        try {
            List<ApplicationDTO> applications = applicationService.findAllByUser(id);

            return ResponseEntity.ok(applications);

        } catch (Exception e) {
            log.error("Error getting all applications for user.", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Load draft application
     * GET /api/v1/applications/load?userId=
     */
    @GetMapping("/load")
    public ResponseEntity<ApplicationDTO> loadApplicationByUserId(
            @RequestParam Long userId,
            Principal currentUser
    ) {
        var principal = (User) ((UsernamePasswordAuthenticationToken) currentUser).getPrincipal();

        log.info("Loading application for user with id: {}, by {} {}.",
                userId, principal.getFirstName(), principal.getLastName());

        try {
            ApplicationDTO draft = applicationService.loadDraft(userId, principal);

            return ResponseEntity.ok(draft);

        } catch (Exception e) {
            log.error("Error loading application", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Save or update draft application
     * POST /api/v1/applications
     */
    @PostMapping
    public ResponseEntity<DraftResponse> saveApplication(@RequestBody ApplicationDTO applicationDTO,
                                                         Principal currentUser
    ) {
        var principal = (User) ((UsernamePasswordAuthenticationToken) currentUser).getPrincipal();
        var user = userMapper.toUser(applicationDTO.getUser());
        log.info("Saving application for user: {} {}, by {} {}.",
                user.getFirstName(), user.getLastName(),
                principal.getFirstName(), principal.getLastName());

        try {
            ApplicationDTO application = applicationService.saveDraft(user, applicationDTO);

            DraftResponse response = DraftResponse.builder()
                    .success(true)
                    .message("Application saved successfully")
                    .applicationId(application.getId())
                    .applicationNumber(application.getApplicationNumber())
                    .build();

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            log.error("Error saving application", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(DraftResponse.builder()
                            .success(false)
                            .message("Failed to save application: " + e.getMessage())
                            .build());
        }
    }

    /*
    @PostMapping
    public ResponseEntity<?> createApplication(@RequestBody Application application) {
        Optional<Application> app = Optional.empty();
        try {
            app = applicationService.createApplication(application);
        } catch (Exception ex) {
            return ResponseEntity.unprocessableEntity().body(ex.getMessage());
        }
        return ResponseEntity.ok(app);
    }
     */

    /**
     * Submit draft application
     * POST /api/v1/applications/submit
     */
    @PostMapping("/submit")
    public ResponseEntity<DraftResponse> submitDraft(
            @RequestBody ApplicationDTO applicationDTO,
            Principal currentUser
    ) {
        var principal = (User) ((UsernamePasswordAuthenticationToken) currentUser).getPrincipal();
        var user = userMapper.toUser(applicationDTO.getUser());

        log.info("Submitting application for user: {} {}, by {} {}.",
                user.getFirstName(), user.getLastName(),
                principal.getFirstName(), principal.getLastName());

        try {
            ApplicationDTO application = applicationService.submitDraft(user, applicationDTO, principal);
            log.info("✓ Application submitted: {}", application.getApplicationNumber());

            DraftResponse response = DraftResponse.builder()
                    .success(true)
                    .message("Application submitted successfully")
                    .applicationId(application.getId())
                    .applicationNumber(application.getApplicationNumber())
                    .build();

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error saving application", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(DraftResponse.builder()
                            .success(false)
                            .message("Failed to submit application: " + e.getMessage())
                            .build());
        }
    }

    @PatchMapping
    public ResponseEntity<?> updateApplication(@RequestBody ApplicationDTO applicationDTO) {
        var application = applicationMapper.toApplication(applicationDTO);
        var app = applicationService.updateApplication(application);
        return ResponseEntity.ok(applicationMapper.toApplicationDTO(app));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteApplicationById(@PathVariable Long id) {
        if(!applicationService.existById(id)) {
            return ResponseEntity.badRequest()
                    .body("Error: Application with id: " + id + " does not exist.");
        }
        boolean response = false;
        try {
            response = applicationService.deleteApplicationById(id);
        } catch (RuntimeException e) {
            return ResponseEntity.internalServerError().body(e.getMessage());
        }
        if(response)
            return ResponseEntity.ok("Application with id " + id + " has been deleted successfully.");
        else
            return ResponseEntity.unprocessableEntity().body("Error: Something went wrong in the database!");
    }

    @PostMapping("/create")
    public ResponseEntity<?> createApplicationForUser(@RequestBody ApplicationDTO applicationDTO) {
        Application app = null;
        try {
            app = applicationService.createApplicationForUser(applicationDTO.getUser().getId());
        } catch (Exception e) {
            return ResponseEntity.unprocessableEntity().body(e.getMessage());
        }
        return ResponseEntity.ok(applicationMapper.toApplicationDTO(app));
    }

    @PostMapping("/add-people")
    public ResponseEntity<?> addPeopleAndOtherInfo(@RequestBody ApplicationDTO applicationDTO) {
        try {
            log.info("applicationDTO: {}", applicationDTO);
            applicationService.addPeopleAndOtherInfo(applicationDTO);
        } catch (Exception e) {
            log.error("Add people failed: {}", e.getMessage());
            return ResponseEntity.unprocessableEntity().body(e.getMessage());
        }
        return ResponseEntity.ok("Family members, referees and beneficiaries added to application " +
                applicationDTO.getApplicationNumber());
    }

    /*
    @PostMapping("/submit")
    public ResponseEntity<?> submitApplication(@RequestBody ApplicationDTO applicationDTO) {
        try {
            applicationService.submitApplication(applicationDTO.getId(),
                    applicationDTO.getUser().getId());

            ApplicationResponse response = ApplicationResponse.builder()
                    .success(true)
                    .message("Application " + applicationDTO.getApplicationNumber() + " submitted successfully.")
                    .applicationId(applicationDTO.getId())
                    .applicationNumber(applicationDTO.getApplicationNumber())
                    .userId(applicationDTO.getUser().getId())
                    .build();

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error submitting application ", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApplicationResponse.builder()
                            .success(false)
                            .message("Failed to submit application: " + e.getMessage())
                            .build());
        }
    }
    */

    @PostMapping("/review")
    public ResponseEntity<?> setApplicationUnderReview(
            @RequestBody ApplicationDTO applicationDTO,
            Principal currentUser
    ) {
        // TODO: Fix authorization using security configuration
        var user = (User) ((UsernamePasswordAuthenticationToken) currentUser).getPrincipal();

        try {
            if(user.isAdmin() || user.isStaff()) {
                applicationService.setApplicationUnderReview(applicationDTO.getId());
            } else {
                log.error("Error: User is unauthorized to set application status to under review.");
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body(ApplicationResponse.builder()
                                .success(false)
                                .message("Unauthorized access. User can't set application status to under review.")
                                .build());
            }

            ApplicationResponse response = ApplicationResponse.builder()
                    .success(true)
                    .message("Application successfully set to under review.")
                    .applicationId(applicationDTO.getId())
                    .applicationNumber(applicationDTO.getApplicationNumber())
                    .userId(applicationDTO.getUser().getId())
                    .build();

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error setting application status to under review. ", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApplicationResponse.builder()
                            .success(false)
                            .message("Failed to set application status to under review: " + e.getMessage())
                            .build());
        }
    }

    @PostMapping("/approve")
    public ResponseEntity<?> approveApplication(
            @RequestBody ApplicationDTO applicationDTO,
            Principal currentUser
    ) {
        // TODO: Fix authorization using security configuration
        var user = (User) ((UsernamePasswordAuthenticationToken) currentUser).getPrincipal();

        try {
            if(user.isAdmin() || user.isStaff()) {
                applicationService.approveApplication(applicationDTO.getId());
            } else {
                log.error("Error: User is unauthorized to approve application.");
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body(ApplicationResponse.builder()
                                .success(false)
                                .message("User unauthorized to approve application.")
                                .build());
            }

            ApplicationResponse response = ApplicationResponse.builder()
                .success(true)
                .message("Application approved successfully.")
                .applicationId(applicationDTO.getId())
                .applicationNumber(applicationDTO.getApplicationNumber())
                .userId(applicationDTO.getUser().getId())
                .build();

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error approving application. ", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApplicationResponse.builder()
                            .success(false)
                            .message("Failed to approve application: " + e.getMessage())
                            .build());
        }
    }

    @PostMapping("/reject")
    public ResponseEntity<?> rejectApplication(
            @RequestBody ApplicationDTO applicationDTO,
            Principal currentUser
    ) {
        // TODO: Fix authorization using security configuration
        var user = (User) ((UsernamePasswordAuthenticationToken) currentUser).getPrincipal();

        try {
            if(user.isAdmin() || user.isStaff()) {
                applicationService.rejectApplication(applicationDTO.getId(),
                        applicationDTO.getRejectionReason());
            } else {
                log.error("Error: User is unauthorized to reject application.");
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body(ApplicationResponse.builder()
                                .success(false)
                                .message("User unauthorized to reject application.")
                                .build());
            }

            ApplicationResponse response = ApplicationResponse.builder()
                    .success(true)
                    .message("Application rejected successfully. Rejection reason:" + applicationDTO.getRejectionReason())
                    .applicationId(applicationDTO.getId())
                    .applicationNumber(applicationDTO.getApplicationNumber())
                    .userId(applicationDTO.getUser().getId())
                    .build();

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error rejecting application. ", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApplicationResponse.builder()
                            .success(false)
                            .message("Failed to reject application: " + e.getMessage())
                            .build());
        }
    }

    @PostMapping("/return")
    public ResponseEntity<?> returnApplication(
            @RequestBody ApplicationDTO applicationDTO,
            Principal currentUser
    ) {
        // TODO: Fix authorization using security configuration
        var user = (User) ((UsernamePasswordAuthenticationToken) currentUser).getPrincipal();

        try {
            if(user.isAdmin() || user.isStaff()) {
                applicationService.returnApplication(applicationDTO.getId(),
                        applicationDTO.getNotes());
            } else {
                log.error("Error: User is unauthorized to return application.");
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body(ApplicationResponse.builder()
                                .success(false)
                                .message("User unauthorized to return application.")
                                .build());
            }

            ApplicationResponse response = ApplicationResponse.builder()
                    .success(true)
                    .message("Application returned successfully. Reason:" + applicationDTO.getNotes())
                    .applicationId(applicationDTO.getId())
                    .applicationNumber(applicationDTO.getApplicationNumber())
                    .userId(applicationDTO.getUser().getId())
                    .build();

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error returning application. ", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApplicationResponse.builder()
                            .success(false)
                            .message("Failed to return application: " + e.getMessage())
                            .build());
        }
    }

    @PostMapping("/withdraw")
    public ResponseEntity<?> withdrawApplication(@RequestBody ApplicationDTO applicationDTO) {
        try {
            applicationService.withdrawApplication(applicationDTO.getId(),
                    applicationDTO.getUser().getId());

            ApplicationResponse response = ApplicationResponse.builder()
                    .success(true)
                    .message("Application withdrawn successfully.")
                    .applicationId(applicationDTO.getId())
                    .applicationNumber(applicationDTO.getApplicationNumber())
                    .userId(applicationDTO.getUser().getId())
                    .build();

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error withdrawing application. ", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApplicationResponse.builder()
                            .success(false)
                            .message("Failed to withdraw application: " + e.getMessage())
                            .build());
        }
    }

}
