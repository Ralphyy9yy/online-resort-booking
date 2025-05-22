CREATE TABLE admins(
    admin_id int(11) NOT NULL AUTO_INCREMENT,
    username varchar(50) NOT NULL,
    password_hash varchar(255)  NOT NULL,
    email varchar(255) UNIQUE,
    role varchar(50) DEFAULT 'admin',
    last_login TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (admin_id),
    
)ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE booking_rooms (
  id INT(11) NOT NULL AUTO_INCREMENT,
  booking_id INT(11) NOT NULL,
  room_id INT(11) NOT NULL,
  quantity INT(11) NOT NULL,
  PRIMARY KEY (id),
  KEY idx_booking_id (booking_id),
  KEY idx_room_id (room_id),
  CONSTRAINT fk_booking FOREIGN KEY (booking_id) REFERENCES bookings(booking_id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_room FOREIGN KEY (room_id) REFERENCES rooms(room_id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE bookings (
  booking_id INT(11) NOT NULL AUTO_INCREMENT,
  guest_id INT(11) DEFAULT NULL,
  room_id INT(11) DEFAULT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  booking_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  status_id INT(11) DEFAULT 1,
  status ENUM('pending', 'confirmed', 'cancelled') DEFAULT 'pending',
  PRIMARY KEY (booking_id),
  KEY idx_guest_id (guest_id),
  KEY idx_room_id (room_id),
  KEY idx_status_id (status_id),
  CONSTRAINT fk_guest FOREIGN KEY (guest_id) REFERENCES guests(guest_id) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT fk_room FOREIGN KEY (room_id) REFERENCES rooms(room_id) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE bookingstatus (
  status_id INT(11) NOT NULL AUTO_INCREMENT,
  status_name VARCHAR(50) NOT NULL UNIQUE,
  PRIMARY KEY (status_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE guest (
  id INT(11) NOT NULL AUTO_INCREMENT,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  phone_number VARCHAR(15) DEFAULT NULL,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE messages (
  id INT(11) NOT NULL AUTO_INCREMENT,
  name VARCHAR(100) DEFAULT NULL,
  email VARCHAR(100) DEFAULT NULL,
  message TEXT DEFAULT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE payments (
  payment_id INT(11) NOT NULL AUTO_INCREMENT,
  booking_id INT(11) NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  payment_date DATETIME DEFAULT CURRENT_TIMESTAMP,
  payment_method VARCHAR(50) NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'pending',
  transaction_id VARCHAR(100) DEFAULT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (payment_id),
  KEY idx_booking_id (booking_id),
  CONSTRAINT fk_booking_payment FOREIGN KEY (booking_id) REFERENCES bookings(booking_id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE rooms (
  room_id INT(11) NOT NULL AUTO_INCREMENT,
  room_type_id INT(11) DEFAULT NULL,
  price DECIMAL(10,2) NOT NULL,
  capacity INT(11) NOT NULL,
  leftRoom INT(11) NOT NULL,
  room_image VARCHAR(255) DEFAULT NULL,
  PRIMARY KEY (room_id),
  KEY idx_room_type_id (room_type_id),
  CONSTRAINT fk_room_type FOREIGN KEY (room_type_id) REFERENCES roomtypes(room_type_id) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE roomtypes (
  room_type_id INT(11) NOT NULL AUTO_INCREMENT,
  room_type_name VARCHAR(100) NOT NULL UNIQUE,
  description TEXT DEFAULT NULL,
  PRIMARY KEY (room_type_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
