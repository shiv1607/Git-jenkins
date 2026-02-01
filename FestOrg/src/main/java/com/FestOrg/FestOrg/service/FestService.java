package com.FestOrg.FestOrg.service;

import com.FestOrg.FestOrg.model.ApprovalStatus;
import com.FestOrg.FestOrg.model.College;
import com.FestOrg.FestOrg.model.Fest;
import com.FestOrg.FestOrg.repository.CollegeRepository;
import com.FestOrg.FestOrg.repository.FestRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class FestService {

    @Autowired
    private FestRepository festRepository;

    @Autowired
    private CollegeRepository collegeRepository;

    public Fest createFest(Long collegeId, Fest fest) {
        College college = collegeRepository.findById(collegeId)
                .orElseThrow(() -> new RuntimeException("College not found with id " + collegeId));
        
        // Validate dates
        if (fest.getStartDate() == null || fest.getEndDate() == null) {
            throw new RuntimeException("Start date and end date are required");
        }
        
        if (fest.getStartDate().isAfter(fest.getEndDate())) {
            throw new RuntimeException("Start date cannot be after end date");
        }
        
        if (fest.getStartDate().isBefore(LocalDate.now())) {
            throw new RuntimeException("Start date cannot be in the past");
        }
        
        fest.setCollege(college);
        fest.setApprovalStatus(ApprovalStatus.PENDING);
        fest.setCreatedAt(LocalDateTime.now());
        fest.setPublic(false);

        return festRepository.save(fest);
    }

    public List<Fest> getPublicFests() {
        return festRepository.findByApprovalStatusAndIsPublic(ApprovalStatus.APPROVED, true);
    }
    
    public Fest getFestById(Long festId) {
        return festRepository.findById(festId).orElse(null);
    }

    public List<Fest> getFestsByCollegeId(Long collegeId) {
        System.out.println("DEBUG: Getting fests for college ID: " + collegeId);
        try {
            System.out.println("DEBUG: About to call findByCollegeId(" + collegeId + ")");
            List<Fest> fests = festRepository.findByCollegeId(collegeId);
            System.out.println("DEBUG: Successfully found " + fests.size() + " fests for college ID: " + collegeId);
            return fests;
        } catch (Exception e) {
            System.err.println("DEBUG: Error getting fests for college ID " + collegeId + ": " + e.getMessage());
            System.err.println("DEBUG: Exception type: " + e.getClass().getSimpleName());
            e.printStackTrace();
            throw e;
        }
    }

    public Fest updateApprovalStatus(Long festId, ApprovalStatus status) {
        Fest fest = festRepository.findById(festId)
                .orElseThrow(() -> new RuntimeException("Fest not found with ID: " + festId));
        fest.setApprovalStatus(status);
        fest.setPublic(status == ApprovalStatus.APPROVED);
        return festRepository.save(fest);
    }

    public List<Fest> getFestsByStatus(ApprovalStatus status) {
        return festRepository.findByApprovalStatus(status);
    }

    public List<Fest> getApprovedPublicFests() {
        return festRepository.findByApprovalStatusAndIsPublicTrue(ApprovalStatus.APPROVED);
    }

    public List<Fest> getFestsByStatusWithCollege(ApprovalStatus status) {
        return festRepository.findByApprovalStatusWithCollege(status);
    }
}







//package com.FestOrg.FestOrg.service;
//
//import com.FestOrg.FestOrg.model.ApprovalStatus;
//import com.FestOrg.FestOrg.model.College;
//import com.FestOrg.FestOrg.model.Fest;
//import com.FestOrg.FestOrg.repository.CollegeRepository;
//import com.FestOrg.FestOrg.repository.FestRepository;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.stereotype.Service;
//
//import java.time.LocalDateTime;
//import java.util.List;
//
//@Service
//public class FestService {
//
//    @Autowired
//    private FestRepository festRepository;
//
//    @Autowired
//    private CollegeRepository collegeRepository;
//
//    public Fest createFest(Long collegeId, Fest fest) {
//        College college = collegeRepository.findById(collegeId)
//                .orElseThrow(() -> new RuntimeException("College not found with id " + collegeId));
//        fest.setCollege(college);
//        fest.setApprovalStatus(ApprovalStatus.PENDING);
//        fest.setCreatedAt(LocalDateTime.now());
//        fest.setPublic(false); // override isPublic to false, or keep from request
//
//        return festRepository.save(fest);
//    }
//
//
//	
//	public List<Fest> getPublicFests() {
//	    return festRepository.findByApprovalStatusAndIsPublic(ApprovalStatus.APPROVED, true);
//	}
//	
//	public Fest getFestById(Long festId) {
//	    return festRepository.findById(festId).orElse(null);
//	}
//
//
////	public Fest getFestById(Long id) {
////	    return festRepository.findById(id)
////	            .orElseThrow(() -> new RuntimeException("Fest not found with id " + id));
////	}
//
//	public List<Fest> getFestsByCollegeId(Long collegeId) {
//		System.out.println("DEBUG: Getting fests for college ID: " + collegeId);
//		try {
//			
//			System.out.println("DEBUG: About to call findByCollegeId(" + collegeId + ")");
//			List<Fest> fests = festRepository.findByCollegeId(collegeId);
//			System.out.println("DEBUG: Successfully found " + fests.size() + " fests for college ID: " + collegeId);
//			return fests;
//		} catch (Exception e) {
//			System.err.println("DEBUG: Error getting fests for college ID " + collegeId + ": " + e.getMessage());
//			System.err.println("DEBUG: Exception type: " + e.getClass().getSimpleName());
//			e.printStackTrace();
//			throw e;
//		}
//	}
//
//public Fest updateApprovalStatus(Long festId, ApprovalStatus status) {
//    Fest fest = festRepository.findById(festId)
//            .orElseThrow(() -> new RuntimeException("Fest not found with ID: " + festId));
//    fest.setApprovalStatus(status);
//    fest.setPublic(status == ApprovalStatus.APPROVED);
//    return festRepository.save(fest);
//}
//
//public List<Fest> getFestsByStatus(ApprovalStatus status) {
//    return festRepository.findByApprovalStatus(status);
//}
//
//public List<Fest> getApprovedPublicFests() {
//    return festRepository.findByApprovalStatusAndIsPublicTrue(ApprovalStatus.APPROVED);
//}
//
//public List<Fest> getFestsByStatusWithCollege(ApprovalStatus status) {
//    return festRepository.findByApprovalStatusWithCollege(status);
//}
//
//}
//
