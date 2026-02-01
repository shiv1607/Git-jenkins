CREATE TABLE student (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('ADMIN', 'COLLEGE', 'STUDENT') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE admins (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT UNIQUE NOT NULL,
    full_name VARCHAR(100),
    contact_number VARCHAR(20),
    profile_image TEXT,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE college (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT UNIQUE NOT NULL,
    name VARCHAR(150),
    address TEXT,
    contact_number VARCHAR(20),
    map_link TEXT,
    approved BOOLEAN DEFAULT FALSE, -- admin can approve or reject college
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE fests (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    college_id BIGINT,
    title VARCHAR(150),
    description TEXT,
    date DATE,
    seat_limit INT,
    ticket_price DECIMAL(8,2),
    image_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (college_id) REFERENCES colleges(id)
);
CREATE TABLE bookings (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    fest_id BIGINT,
    student_id BIGINT,
    booking_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    payment_status ENUM('PENDING', 'PAID') DEFAULT 'PENDING',
    razorpay_payment_id VARCHAR(255),
    FOREIGN KEY (fest_id) REFERENCES fests(id),
    FOREIGN KEY (student_id) REFERENCES users(id)
);
CREATE TABLE reviews (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    fest_id BIGINT,
    student_id BIGINT,
    rating INT CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (fest_id) REFERENCES fests(id),
    FOREIGN KEY (student_id) REFERENCES users(id)
);
