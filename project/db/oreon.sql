-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Host: db_server
-- Erstellungszeit: 16. Jun 2026 um 12:45
-- Server-Version: 9.4.0
-- PHP-Version: 8.2.27

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Datenbank: `oreon`
--

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `auth_events`
--

CREATE TABLE `auth_events` (
  `id` bigint NOT NULL,
  `user_id` int DEFAULT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `event` enum('register','login','logout','failed_login') COLLATE utf8mb4_unicode_ci NOT NULL,
  `ip_address` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `user_agent` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `cart_items`
--

CREATE TABLE `cart_items` (
  `id` int NOT NULL,
  `user_id` int NOT NULL,
  `product_id` int NOT NULL,
  `configuration_id` int DEFAULT NULL,
  `unit_price` decimal(10,2) DEFAULT NULL,
  `configuration_snapshot` json DEFAULT NULL,
  `quantity` int DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Daten für Tabelle `cart_items`
--

INSERT INTO `cart_items` (`id`, `user_id`, `product_id`, `configuration_id`, `unit_price`, `configuration_snapshot`, `quantity`, `created_at`) VALUES
(7, 2, 1, 5, 2649.00, NULL, 1, '2026-06-16 12:13:36');

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `categories`
--

CREATE TABLE `categories` (
  `id` int NOT NULL,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `image_url` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Daten für Tabelle `categories`
--

INSERT INTO `categories` (`id`, `name`, `slug`, `description`, `image_url`) VALUES
(1, 'Ringe', 'ringe', 'Individuell gestaltbare Ringe aus edlen Materialien', NULL),
(2, 'Armbänder', 'armbaender', 'Handgefertigte Armbänder und Armreife', NULL);

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `configurations`
--

CREATE TABLE `configurations` (
  `id` int NOT NULL,
  `user_id` int NOT NULL,
  `product_id` int NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT 'Meine Konfiguration',
  `type_id` int DEFAULT NULL,
  `material_id` int DEFAULT NULL,
  `size_id` int DEFAULT NULL,
  `shape_id` int DEFAULT NULL,
  `jewel_id` int DEFAULT NULL,
  `total_price` decimal(10,2) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Daten für Tabelle `configurations`
--

INSERT INTO `configurations` (`id`, `user_id`, `product_id`, `name`, `type_id`, `material_id`, `size_id`, `shape_id`, `jewel_id`, `total_price`, `created_at`, `updated_at`) VALUES
(1, 1, 3, 'Regalia Signet Konfiguration', 2, 5, 10, 5, 11, 3919.00, '2026-05-06 09:03:49', '2026-05-06 09:03:49'),
(5, 2, 1, 'Eternal Band Konfiguration', 4, 2, 8, 5, 7, 2649.00, '2026-06-16 12:11:14', '2026-06-16 12:11:14');

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `option_jewels`
--

CREATE TABLE `option_jewels` (
  `id` int NOT NULL,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` varchar(120) COLLATE utf8mb4_unicode_ci NOT NULL,
  `price_modifier` decimal(10,2) DEFAULT '0.00',
  `color_hex` varchar(7) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_special` tinyint(1) DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Daten für Tabelle `option_jewels`
--

INSERT INTO `option_jewels` (`id`, `name`, `slug`, `price_modifier`, `color_hex`, `is_special`) VALUES
(1, 'Diamant', 'diamant', 690.00, '#f5f9ff', 0),
(2, 'Saphir', 'saphir', 420.00, '#2850d8', 0),
(3, 'Rubin', 'rubin', 460.00, '#c32036', 0),
(4, 'Smaragd', 'smaragd', 480.00, '#11a66a', 0),
(5, 'Aquamarin', 'aquamarin', 340.00, '#7ad8e8', 0),
(6, 'Perle', 'perle', 300.00, '#f3eee6', 0),
(7, 'Jade', 'jade', 620.00, '#2f8f62', 1),
(8, 'Tansanit', 'tansanit', 760.00, '#5a57d9', 1),
(9, 'Alexandrit', 'alexandrit', 920.00, '#4f7d68', 1),
(10, 'Opal', 'opal', 680.00, '#b7d8ff', 1),
(11, 'Paraiba-Turmalin', 'paraiba-turmalin', 1250.00, '#33dcd0', 1);

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `option_materials`
--

CREATE TABLE `option_materials` (
  `id` int NOT NULL,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `price_modifier` decimal(10,2) DEFAULT '0.00',
  `color_hex` varchar(7) COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Daten für Tabelle `option_materials`
--

INSERT INTO `option_materials` (`id`, `name`, `slug`, `price_modifier`, `color_hex`) VALUES
(1, '925er Silber', 'silber', 0.00, '#C0C0C0'),
(2, '750er Gelbgold', 'gelbgold', 620.00, '#FFD700'),
(3, '750er Roségold', 'rosegold', 650.00, '#B76E79'),
(4, '750er Weißgold', 'weissgold', 640.00, '#E8E8E8'),
(5, 'Platin 950', 'platin', 980.00, '#E5E4E2'),
(6, 'Titan', 'titan', 340.00, '#878681');

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `option_shapes`
--

CREATE TABLE `option_shapes` (
  `id` int NOT NULL,
  `category_id` int NOT NULL,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `price_modifier` decimal(10,2) DEFAULT '0.00'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Daten für Tabelle `option_shapes`
--

INSERT INTO `option_shapes` (`id`, `category_id`, `name`, `slug`, `price_modifier`) VALUES
(1, 1, 'Klassisch rund', 'klassisch', 60.00),
(2, 1, 'Flach', 'flach', 50.00),
(3, 1, 'Gewölbt', 'gewoelbt', 110.00),
(4, 1, 'Twisted', 'twisted', 200.00),
(5, 1, 'Hexagonal', 'hexagonal', 240.00),
(6, 2, 'Rund', 'rund', 55.00),
(7, 2, 'Flach', 'flach', 45.00),
(8, 2, 'Oval', 'oval', 100.00),
(9, 2, 'Eckig', 'eckig', 140.00);

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `option_sizes`
--

CREATE TABLE `option_sizes` (
  `id` int NOT NULL,
  `category_id` int NOT NULL,
  `label` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `value` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `price_modifier` decimal(10,2) DEFAULT '0.00'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Daten für Tabelle `option_sizes`
--

INSERT INTO `option_sizes` (`id`, `category_id`, `label`, `value`, `price_modifier`) VALUES
(1, 1, '48 (15.3mm)', '48', 0.00),
(2, 1, '50 (15.9mm)', '50', 30.00),
(3, 1, '52 (16.6mm)', '52', 40.00),
(4, 1, '54 (17.2mm)', '54', 50.00),
(5, 1, '56 (17.8mm)', '56', 60.00),
(6, 1, '58 (18.5mm)', '58', 70.00),
(7, 1, '60 (19.1mm)', '60', 80.00),
(8, 1, '62 (19.7mm)', '62', 110.00),
(9, 1, '64 (20.4mm)', '64', 130.00),
(10, 1, '66 (21.0mm)', '66', 160.00),
(11, 2, 'S (16cm)', 'S', 0.00),
(12, 2, 'M (18cm)', 'M', 40.00),
(13, 2, 'L (20cm)', 'L', 65.00),
(14, 2, 'XL (22cm)', 'XL', 100.00);

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `option_types`
--

CREATE TABLE `option_types` (
  `id` int NOT NULL,
  `category_id` int NOT NULL,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `price_modifier` decimal(10,2) DEFAULT '0.00'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Daten für Tabelle `option_types`
--

INSERT INTO `option_types` (`id`, `category_id`, `name`, `slug`, `price_modifier`) VALUES
(1, 1, 'Solitär', 'solitaer', 420.00),
(2, 1, 'Ehering', 'ehering', 520.00),
(3, 1, 'Verlobungsring', 'verlobungsring', 500.00),
(4, 1, 'Statement-Ring', 'statement', 370.00),
(5, 1, 'Siegelring', 'siegelring', 360.00),
(6, 2, 'Armreif', 'armreif', 240.00),
(7, 2, 'Gliederarmband', 'glieder', 290.00),
(8, 2, 'Tennisarmband', 'tennis', 460.00),
(9, 2, 'Panzerarmband', 'panzer', 270.00),
(10, 2, 'Charm-Armband', 'charm', 230.00);

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `orders`
--

CREATE TABLE `orders` (
  `id` int NOT NULL,
  `user_id` int NOT NULL,
  `order_number` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `total_price` decimal(10,2) NOT NULL,
  `status` enum('pending','confirmed','processing','shipped','delivered','cancelled') COLLATE utf8mb4_unicode_ci DEFAULT 'pending',
  `shipping_street` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `shipping_zip` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `shipping_city` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `shipping_country` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `payment_method` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `notes` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Daten für Tabelle `orders`
--

INSERT INTO `orders` (`id`, `user_id`, `order_number`, `total_price`, `status`, `shipping_street`, `shipping_zip`, `shipping_city`, `shipping_country`, `payment_method`, `notes`, `created_at`, `updated_at`) VALUES
(1, 1, 'ORN-4A286D', 3919.00, 'pending', 'i', 'a', 'w', 'Österreich', 'rechnung', '', '2026-05-08 07:40:56', '2026-05-08 07:40:56'),
(2, 2, 'ORN-7A98A8', 2589.00, 'pending', 'Wiener straße 1', '4020', 'Linz', 'Österreich', 'rechnung', '', '2026-05-12 11:01:36', '2026-05-12 11:01:36'),
(3, 2, 'ORN-FC22E0', 2699.00, 'pending', 'Wiener straße 1', '4020', 'Linz', 'Österreich', 'rechnung', '', '2026-06-16 12:09:01', '2026-06-16 12:09:01'),
(4, 2, 'ORN-5C7C74', 4828.00, 'pending', 'Wiener straße 1', '4020', 'Linz', 'Österreich', 'rechnung', '', '2026-06-16 12:11:46', '2026-06-16 12:11:46');

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `order_items`
--

CREATE TABLE `order_items` (
  `id` int NOT NULL,
  `order_id` int NOT NULL,
  `product_id` int NOT NULL,
  `product_name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `configuration_snapshot` json DEFAULT NULL,
  `quantity` int DEFAULT '1',
  `unit_price` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Daten für Tabelle `order_items`
--

INSERT INTO `order_items` (`id`, `order_id`, `product_id`, `product_name`, `configuration_snapshot`, `quantity`, `unit_price`) VALUES
(1, 2, 3, 'Regalia Signet', '{\"type_name\": \"Solitär\", \"jewel_name\": \"Diamant\", \"jewel_slug\": \"diamant\", \"shape_name\": \"Klassisch rund\", \"size_label\": \"48 (15.3mm)\", \"category_slug\": \"ringe\", \"material_name\": \"750er Roségold\"}', 1, 2589.00),
(2, 3, 1, 'Eternal Band', '{\"type_name\": \"Statement-Ring\", \"jewel_name\": \"Jade\", \"jewel_slug\": \"jade\", \"shape_name\": \"Hexagonal\", \"size_label\": \"66 (21.0mm)\", \"category_slug\": \"ringe\", \"material_name\": \"750er Gelbgold\"}', 1, 2699.00),
(3, 4, 1, 'Eternal Band', '{\"type_name\": \"Statement-Ring\", \"jewel_name\": \"Jade\", \"jewel_slug\": \"jade\", \"shape_name\": \"Hexagonal\", \"size_label\": \"62 (19.7mm)\", \"category_slug\": \"ringe\", \"material_name\": \"750er Gelbgold\"}', 1, 2649.00),
(4, 4, 1, 'Eternal Band', '{\"type_name\": \"Statement-Ring\", \"jewel_name\": \"Perle\", \"jewel_slug\": \"perle\", \"shape_name\": \"Klassisch rund\", \"size_label\": \"62 (19.7mm)\", \"category_slug\": \"ringe\", \"material_name\": \"750er Roségold\"}', 1, 2179.00);

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `products`
--

CREATE TABLE `products` (
  `id` int NOT NULL,
  `category_id` int NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `base_price` decimal(10,2) NOT NULL,
  `image_url` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Daten für Tabelle `products`
--

INSERT INTO `products` (`id`, `category_id`, `name`, `slug`, `description`, `base_price`, `image_url`, `is_active`, `created_at`) VALUES
(1, 1, 'Eternal Band', 'eternal-band', 'Ein zeitloser Ring, der Eleganz und Schlichtheit vereint. Perfekt als Ehering oder als täglicher Begleiter.', 1248.96, 'img/ring-eternal.jpg', 1, '2026-05-06 08:14:42'),
(2, 1, 'Nova Solitaire', 'nova-solitaire', 'Der Nova Solitaire besticht durch seine klare Linie und den einzelnen, brillant gefassten Stein.', 1338.56, 'img/ring-nova.jpg', 1, '2026-05-06 08:14:42'),
(3, 1, 'Regalia Signet', 'regalia-signet', 'Ein kraftvoller Siegelring mit individueller Gravur-Option. Statement und Tradition in einem.', 1300.16, 'img/ring-regalia.jpg', 1, '2026-05-06 08:14:42'),
(4, 1, 'Aura Twist', 'aura-twist', 'Spielerisch verdrehtes Design – der Aura Twist ist modern, mutig und einzigartig.', 1280.96, 'img/ring-aura.jpg', 1, '2026-05-06 08:14:42'),
(5, 2, 'Luxe Chain', 'luxe-chain', 'Ein elegantes Gliederarmband, das sich perfekt an das Handgelenk schmiegt. Zeitlose Eleganz.', 1164.96, 'img/bracelet-luxe.jpg', 1, '2026-05-06 08:14:42'),
(6, 2, 'Celestia Bangle', 'celestia-bangle', 'Ein schlanker Armreif mit fließender Form – das Celestia ist minimalistisch und doch auffallend.', 1126.56, 'img/bracelet-celestia.jpg', 1, '2026-05-06 08:14:42'),
(7, 2, 'Vega Tennis', 'vega-tennis', 'Das Vega Tennis-Armband glänzt mit einer durchgehenden Reihe funkelnder Steine.', 1158.56, 'img/bracelet-vega.jpg', 1, '2026-05-06 08:14:42'),
(8, 2, 'Orion Cuff', 'orion-cuff', 'Ein breiter, offener Armreif mit markanter Oberfläche. Bold und selbstbewusst.', 1228.96, 'img/bracelet-orion.jpg', 1, '2026-05-06 08:14:42');

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `sessions`
--

CREATE TABLE `sessions` (
  `id` varchar(128) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` int DEFAULT NULL,
  `data` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `expires_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `users`
--

CREATE TABLE `users` (
  `id` int NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password_hash` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `first_name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `last_name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(30) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `street` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `zip` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `city` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `country` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT 'Österreich',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Daten für Tabelle `users`
--

INSERT INTO `users` (`id`, `email`, `password_hash`, `first_name`, `last_name`, `phone`, `street`, `zip`, `city`, `country`, `created_at`, `updated_at`) VALUES
(1, 'lukas.graski@gmail.com', '$2y$10$NXVL.cPxEX8lUti/i18OYeYwR7zqcy2SIz4xuKyv/WOPsVDwDM3Zq', 'lukas', 'graski', NULL, NULL, NULL, NULL, 'Österreich', '2026-05-06 08:16:01', '2026-05-06 08:16:01'),
(2, 'test@test.com', '$2a$12$nNJeri8443PkOIc2pXl/GetEx50Ekq/BgjxZF015fMHCck6WAnGje', 'Test', 'Test', '+43 660 000000', 'Wiener straße 1', '4020', 'Linz', 'Österreich', '2026-05-12 10:52:54', '2026-05-12 10:52:54');

--
-- Indizes der exportierten Tabellen
--

--
-- Indizes für die Tabelle `auth_events`
--
ALTER TABLE `auth_events`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indizes für die Tabelle `cart_items`
--
ALTER TABLE `cart_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `product_id` (`product_id`),
  ADD KEY `configuration_id` (`configuration_id`);

--
-- Indizes für die Tabelle `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `slug` (`slug`);

--
-- Indizes für die Tabelle `configurations`
--
ALTER TABLE `configurations`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `product_id` (`product_id`),
  ADD KEY `type_id` (`type_id`),
  ADD KEY `material_id` (`material_id`),
  ADD KEY `size_id` (`size_id`),
  ADD KEY `shape_id` (`shape_id`),
  ADD KEY `jewel_id` (`jewel_id`);

--
-- Indizes für die Tabelle `option_jewels`
--
ALTER TABLE `option_jewels`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `slug` (`slug`),
  ADD UNIQUE KEY `uq_option_jewels_name` (`name`);

--
-- Indizes für die Tabelle `option_materials`
--
ALTER TABLE `option_materials`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `slug` (`slug`);

--
-- Indizes für die Tabelle `option_shapes`
--
ALTER TABLE `option_shapes`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_option_shapes` (`category_id`,`slug`);

--
-- Indizes für die Tabelle `option_sizes`
--
ALTER TABLE `option_sizes`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_option_sizes` (`category_id`,`value`);

--
-- Indizes für die Tabelle `option_types`
--
ALTER TABLE `option_types`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_option_types` (`category_id`,`slug`);

--
-- Indizes für die Tabelle `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `order_number` (`order_number`),
  ADD KEY `user_id` (`user_id`);

--
-- Indizes für die Tabelle `order_items`
--
ALTER TABLE `order_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `order_id` (`order_id`),
  ADD KEY `product_id` (`product_id`);

--
-- Indizes für die Tabelle `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `slug` (`slug`),
  ADD KEY `category_id` (`category_id`);

--
-- Indizes für die Tabelle `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indizes für die Tabelle `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT für exportierte Tabellen
--

--
-- AUTO_INCREMENT für Tabelle `auth_events`
--
ALTER TABLE `auth_events`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT für Tabelle `cart_items`
--
ALTER TABLE `cart_items`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT für Tabelle `categories`
--
ALTER TABLE `categories`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT für Tabelle `configurations`
--
ALTER TABLE `configurations`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT für Tabelle `option_jewels`
--
ALTER TABLE `option_jewels`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT für Tabelle `option_materials`
--
ALTER TABLE `option_materials`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT für Tabelle `option_shapes`
--
ALTER TABLE `option_shapes`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT für Tabelle `option_sizes`
--
ALTER TABLE `option_sizes`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT für Tabelle `option_types`
--
ALTER TABLE `option_types`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT für Tabelle `orders`
--
ALTER TABLE `orders`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT für Tabelle `order_items`
--
ALTER TABLE `order_items`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT für Tabelle `products`
--
ALTER TABLE `products`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT für Tabelle `users`
--
ALTER TABLE `users`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Constraints der exportierten Tabellen
--

--
-- Constraints der Tabelle `auth_events`
--
ALTER TABLE `auth_events`
  ADD CONSTRAINT `auth_events_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints der Tabelle `cart_items`
--
ALTER TABLE `cart_items`
  ADD CONSTRAINT `cart_items_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `cart_items_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `cart_items_ibfk_3` FOREIGN KEY (`configuration_id`) REFERENCES `configurations` (`id`) ON DELETE SET NULL;

--
-- Constraints der Tabelle `configurations`
--
ALTER TABLE `configurations`
  ADD CONSTRAINT `configurations_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `configurations_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `configurations_ibfk_3` FOREIGN KEY (`type_id`) REFERENCES `option_types` (`id`),
  ADD CONSTRAINT `configurations_ibfk_4` FOREIGN KEY (`material_id`) REFERENCES `option_materials` (`id`),
  ADD CONSTRAINT `configurations_ibfk_5` FOREIGN KEY (`size_id`) REFERENCES `option_sizes` (`id`),
  ADD CONSTRAINT `configurations_ibfk_6` FOREIGN KEY (`shape_id`) REFERENCES `option_shapes` (`id`),
  ADD CONSTRAINT `configurations_ibfk_7` FOREIGN KEY (`jewel_id`) REFERENCES `option_jewels` (`id`);

--
-- Constraints der Tabelle `option_shapes`
--
ALTER TABLE `option_shapes`
  ADD CONSTRAINT `option_shapes_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE CASCADE;

--
-- Constraints der Tabelle `option_sizes`
--
ALTER TABLE `option_sizes`
  ADD CONSTRAINT `option_sizes_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE CASCADE;

--
-- Constraints der Tabelle `option_types`
--
ALTER TABLE `option_types`
  ADD CONSTRAINT `option_types_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE CASCADE;

--
-- Constraints der Tabelle `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints der Tabelle `order_items`
--
ALTER TABLE `order_items`
  ADD CONSTRAINT `order_items_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `order_items_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`);

--
-- Constraints der Tabelle `products`
--
ALTER TABLE `products`
  ADD CONSTRAINT `products_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE CASCADE;

--
-- Constraints der Tabelle `sessions`
--
ALTER TABLE `sessions`
  ADD CONSTRAINT `sessions_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
