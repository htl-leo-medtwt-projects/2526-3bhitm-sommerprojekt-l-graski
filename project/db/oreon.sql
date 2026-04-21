-- =============================================
-- Oréon Schmuck-Onlineshop · MySQL/MariaDB Init
--
-- DB: oreon
-- MySQL User: oreon
-- MySQL Password: oreonpasswort
--
-- Dieses File erstellt:
-- - Datenbank + User/Grants
-- - Alle Tabellen (Entities)
-- - Seed-Daten (Kategorien, Produkte, Optionen)
-- - Persistenz für Login/Register-Events, Warenkorb, Config-Saves
-- =============================================

CREATE DATABASE IF NOT EXISTS oreon CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- User/Grants (bei Shared-Hosting ggf. weglassen)
CREATE USER IF NOT EXISTS 'oreon'@'%' IDENTIFIED BY 'oreonpasswort';
GRANT ALL PRIVILEGES ON oreon.* TO 'oreon'@'%';
FLUSH PRIVILEGES;

USE oreon;

-- Benutzer
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(30),
    street VARCHAR(255),
    zip VARCHAR(10),
    city VARCHAR(100),
    country VARCHAR(100) DEFAULT 'Österreich',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Login/Register Tracking
CREATE TABLE IF NOT EXISTS auth_events (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NULL,
    email VARCHAR(255) NULL,
    event ENUM('register','login','logout','failed_login') NOT NULL,
    ip_address VARCHAR(45) NULL,
    user_agent VARCHAR(255) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- Produktkategorien
CREATE TABLE IF NOT EXISTS categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    image_url VARCHAR(500)
) ENGINE=InnoDB;

INSERT IGNORE INTO categories (id, name, slug, description) VALUES
(1, 'Ringe', 'ringe', 'Individuell gestaltbare Ringe aus edlen Materialien'),
(2, 'Armbänder', 'armbaender', 'Handgefertigte Armbänder und Armreife');

-- Produkte (Basisprodukte)
CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    category_id INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    base_price DECIMAL(10,2) NOT NULL,
    image_url VARCHAR(500),
    is_active TINYINT(1) DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Konfigurationsoptionen: Art
CREATE TABLE IF NOT EXISTS option_types (
    id INT AUTO_INCREMENT PRIMARY KEY,
    category_id INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) NOT NULL,
    price_modifier DECIMAL(10,2) DEFAULT 0.00,
    UNIQUE KEY uq_option_types (category_id, slug),
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Konfigurationsoptionen: Material
CREATE TABLE IF NOT EXISTS option_materials (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) NOT NULL UNIQUE,
    price_modifier DECIMAL(10,2) DEFAULT 0.00,
    color_hex VARCHAR(7)
) ENGINE=InnoDB;

-- Konfigurationsoptionen: Größe
CREATE TABLE IF NOT EXISTS option_sizes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    category_id INT NOT NULL,
    label VARCHAR(50) NOT NULL,
    value VARCHAR(20) NOT NULL,
    price_modifier DECIMAL(10,2) DEFAULT 0.00,
    UNIQUE KEY uq_option_sizes (category_id, value),
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Konfigurationsoptionen: Form
CREATE TABLE IF NOT EXISTS option_shapes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    category_id INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) NOT NULL,
    price_modifier DECIMAL(10,2) DEFAULT 0.00,
    UNIQUE KEY uq_option_shapes (category_id, slug),
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Gravur-Option
CREATE TABLE IF NOT EXISTS option_engravings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    max_chars INT DEFAULT 20,
    price_per_char DECIMAL(10,2) DEFAULT 2.50,
    base_price DECIMAL(10,2) DEFAULT 15.00
) ENGINE=InnoDB;

-- Seed: Materialien
INSERT IGNORE INTO option_materials (name, slug, price_modifier, color_hex) VALUES
('925er Silber', 'silber', 0.00, '#C0C0C0'),
('750er Gelbgold', 'gelbgold', 120.00, '#FFD700'),
('750er Roségold', 'rosegold', 130.00, '#B76E79'),
('750er Weißgold', 'weissgold', 125.00, '#E8E8E8'),
('Platin 950', 'platin', 250.00, '#E5E4E2'),
('Titan', 'titan', 30.00, '#878681');

-- Seed: Ring-Arten
INSERT IGNORE INTO option_types (category_id, name, slug, price_modifier) VALUES
(1, 'Solitär', 'solitaer', 50.00),
(1, 'Ehering', 'ehering', 0.00),
(1, 'Verlobungsring', 'verlobungsring', 75.00),
(1, 'Statement-Ring', 'statement', 40.00),
(1, 'Siegelring', 'siegelring', 35.00);

-- Seed: Armband-Arten
INSERT IGNORE INTO option_types (category_id, name, slug, price_modifier) VALUES
(2, 'Armreif', 'armreif', 20.00),
(2, 'Gliederarmband', 'glieder', 30.00),
(2, 'Tennisarmband', 'tennis', 60.00),
(2, 'Panzerarmband', 'panzer', 25.00),
(2, 'Charm-Armband', 'charm', 15.00);

-- Seed: Ring-Größen
INSERT IGNORE INTO option_sizes (category_id, label, value, price_modifier) VALUES
(1, '48 (15.3mm)', '48', 0.00),
(1, '50 (15.9mm)', '50', 0.00),
(1, '52 (16.6mm)', '52', 0.00),
(1, '54 (17.2mm)', '54', 0.00),
(1, '56 (17.8mm)', '56', 0.00),
(1, '58 (18.5mm)', '58', 0.00),
(1, '60 (19.1mm)', '60', 0.00),
(1, '62 (19.7mm)', '62', 5.00),
(1, '64 (20.4mm)', '64', 5.00),
(1, '66 (21.0mm)', '66', 10.00);

-- Seed: Armband-Größen
INSERT IGNORE INTO option_sizes (category_id, label, value, price_modifier) VALUES
(2, 'S (16cm)', 'S', 0.00),
(2, 'M (18cm)', 'M', 0.00),
(2, 'L (20cm)', 'L', 5.00),
(2, 'XL (22cm)', 'XL', 10.00);

-- Seed: Ring-Formen
INSERT IGNORE INTO option_shapes (category_id, name, slug, price_modifier) VALUES
(1, 'Klassisch rund', 'klassisch', 0.00),
(1, 'Flach', 'flach', 0.00),
(1, 'Gewölbt', 'gewoelbt', 10.00),
(1, 'Twisted', 'twisted', 25.00),
(1, 'Hexagonal', 'hexagonal', 30.00);

-- Seed: Armband-Formen
INSERT IGNORE INTO option_shapes (category_id, name, slug, price_modifier) VALUES
(2, 'Rund', 'rund', 0.00),
(2, 'Flach', 'flach', 0.00),
(2, 'Oval', 'oval', 10.00),
(2, 'Eckig', 'eckig', 15.00);

-- Seed: Gravur-Optionen
INSERT IGNORE INTO option_engravings (name, max_chars, price_per_char, base_price) VALUES
('Einfache Gravur', 20, 2.50, 15.00),
('Schreibschrift', 15, 3.50, 20.00),
('Symbolgravur', 5, 5.00, 25.00);

-- Seed: Produkte
INSERT IGNORE INTO products (category_id, name, slug, description, base_price, image_url, is_active) VALUES
(1, 'Eternal Band', 'eternal-band', 'Ein zeitloser Ring, der Eleganz und Schlichtheit vereint. Perfekt als Ehering oder als täglicher Begleiter.', 89.00, 'img/ring-eternal.jpg', 1),
(1, 'Nova Solitaire', 'nova-solitaire', 'Der Nova Solitaire besticht durch seine klare Linie und den einzelnen, brillant gefassten Stein.', 149.00, 'img/ring-nova.jpg', 1),
(1, 'Regalia Signet', 'regalia-signet', 'Ein kraftvoller Siegelring mit individueller Gravur-Option. Statement und Tradition in einem.', 119.00, 'img/ring-regalia.jpg', 1),
(1, 'Aura Twist', 'aura-twist', 'Spielerisch verdrehtes Design – der Aura Twist ist modern, mutig und einzigartig.', 109.00, 'img/ring-aura.jpg', 1),
(2, 'Luxe Chain', 'luxe-chain', 'Ein elegantes Gliederarmband, das sich perfekt an das Handgelenk schmiegt. Zeitlose Eleganz.', 129.00, 'img/bracelet-luxe.jpg', 1),
(2, 'Celestia Bangle', 'celestia-bangle', 'Ein schlanker Armreif mit fließender Form – das Celestia ist minimalistisch und doch auffallend.', 99.00, 'img/bracelet-celestia.jpg', 1),
(2, 'Vega Tennis', 'vega-tennis', 'Das Vega Tennis-Armband glänzt mit einer durchgehenden Reihe funkelnder Steine.', 199.00, 'img/bracelet-vega.jpg', 1),
(2, 'Orion Cuff', 'orion-cuff', 'Ein breiter, offener Armreif mit markanter Oberfläche. Bold und selbstbewusst.', 159.00, 'img/bracelet-orion.jpg', 1);

-- Gespeicherte Konfigurationen
CREATE TABLE IF NOT EXISTS configurations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    product_id INT NOT NULL,
    name VARCHAR(255) DEFAULT 'Meine Konfiguration',
    type_id INT,
    material_id INT,
    size_id INT,
    shape_id INT,
    engraving_id INT,
    engraving_text VARCHAR(50),
    total_price DECIMAL(10,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    FOREIGN KEY (type_id) REFERENCES option_types(id),
    FOREIGN KEY (material_id) REFERENCES option_materials(id),
    FOREIGN KEY (size_id) REFERENCES option_sizes(id),
    FOREIGN KEY (shape_id) REFERENCES option_shapes(id),
    FOREIGN KEY (engraving_id) REFERENCES option_engravings(id)
) ENGINE=InnoDB;

-- Warenkorb
CREATE TABLE IF NOT EXISTS cart_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    product_id INT NOT NULL,
    configuration_id INT,
    unit_price DECIMAL(10,2) NULL,
    configuration_snapshot JSON NULL,
    quantity INT DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    FOREIGN KEY (configuration_id) REFERENCES configurations(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- Bestellungen
CREATE TABLE IF NOT EXISTS orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    order_number VARCHAR(20) NOT NULL UNIQUE,
    total_price DECIMAL(10,2) NOT NULL,
    status ENUM('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled') DEFAULT 'pending',
    shipping_street VARCHAR(255),
    shipping_zip VARCHAR(10),
    shipping_city VARCHAR(100),
    shipping_country VARCHAR(100),
    payment_method VARCHAR(50),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Bestellpositionen
CREATE TABLE IF NOT EXISTS order_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    product_name VARCHAR(255),
    configuration_snapshot JSON,
    quantity INT DEFAULT 1,
    unit_price DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id)
) ENGINE=InnoDB;

-- Sessions (optional)
CREATE TABLE IF NOT EXISTS sessions (
    id VARCHAR(128) PRIMARY KEY,
    user_id INT,
    data TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;
