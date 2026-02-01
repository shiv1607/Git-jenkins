import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/bookings")
public class BookingController {

    @Autowired
    private BookingService bookingService;
    
    @Autowired
    private PaymentService paymentService;

    @Autowired
    private FestRepository festRepository;
    
    @Autowired
    private BookingRepository bookingRepository;
    
    @GetMapping("/check")
    public ResponseEntity<Map<String, Boolean>> checkBooking(
            @RequestParam Long studentId,
            @RequestParam Long festId) {
        boolean exists = bookingRepository.existsByStudentIdAndFestId(studentId, festId);
        return ResponseEntity.ok(Map.of("isBooked", exists));
    }
    
    @PostMapping("/create-order")
    public Map<String, String> createOrder(@RequestBody Map<String, String> body) throws Exception {
// ... existing code ... 