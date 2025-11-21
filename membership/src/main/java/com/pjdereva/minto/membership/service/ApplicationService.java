package com.pjdereva.minto.membership.service;

import com.pjdereva.minto.membership.model.transaction.Application;
import com.pjdereva.minto.membership.model.transaction.ApplicationStatus;
import com.pjdereva.minto.membership.payload.request.application.ApplicationRequest;

import java.util.List;
import java.util.Optional;

public interface ApplicationService {
    public Application createApplicationForUser(Long userId);
    public void addPeopleAndOtherInfo(ApplicationRequest request);
    public void submitApplication(Long applicationId, Long userId);
    public void setApplicationUnderReview(Long applicationId);
    public void approveApplication(Long applicationId);
    public void rejectApplication(Long applicationId, String reason);
    public void withdrawApplication(Long applicationId, Long userId);

    Optional<Application> createApplication(Application application);
    Application saveApplication(Application application);
    List<Application> getAllApplications();
    Optional<Application> getApplicationById(Long id);
    List<Application> findAllByApplicationStatus(ApplicationStatus applicationStatus);
    boolean existById(Long id);
    Application updateApplication(Application application);
    boolean deleteApplicationById(Long id);
}
