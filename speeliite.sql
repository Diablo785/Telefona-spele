-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jul 01, 2024 at 02:48 PM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `speeliite`
--

-- --------------------------------------------------------

--
-- Table structure for table `scores`
--

CREATE TABLE `scores` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `score` int(11) NOT NULL,
  `game_date` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `scores`
--

INSERT INTO `scores` (`id`, `user_id`, `score`, `game_date`) VALUES
(21, 32, 6, '2024-05-26 18:37:16'),
(22, 32, 5, '2024-05-26 18:39:40'),
(23, 32, 20, '2024-05-26 19:59:24'),
(24, 32, 5, '2024-05-26 20:27:46'),
(25, 32, 13, '2024-05-26 20:28:05'),
(26, 32, 24, '2024-05-26 22:06:00'),
(27, 32, 34, '2024-05-27 11:55:43');

-- --------------------------------------------------------

--
-- Table structure for table `skins`
--

CREATE TABLE `skins` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `price` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `skins`
--

INSERT INTO `skins` (`id`, `name`, `price`) VALUES
(1, 'Cat', 100),
(2, 'Dog', 100),
(3, 'Apple', 100),
(4, 'Globe', 200),
(5, 'Toad', 200),
(6, 'Pickle', 200),
(7, 'Rat', 500),
(8, 'Pig', 500),
(9, 'Bacha', 500),
(10, 'Junko', 1000),
(11, 'Tike', 1000),
(12, 'Xinjo', 1000);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `credits` varchar(255) DEFAULT NULL,
  `joinDate` date NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `password`, `email`, `credits`, `joinDate`) VALUES
(32, 'imants1', '$2y$10$Mq.PTSCjusJ4GGB5v7t2WO5s.Ck.ZguRtycFNWirS/Ujbz7MwIr6u', 'imants@gmail.comhg', '8101', '2024-05-16'),
(33, 'andris', '$2y$10$MO4AbN7nzNp7Zl2OvHvx0.2NcoJ9J2ImVM5nQlS03W0TrAK81Vkby', 'andris@gmail.com', '0', '2024-05-16'),
(34, 'ivars1', '$2y$10$8oIm2B5f2qqJjrylMIAgneHm5xk.xDZMmAFgoXHdLv/yVxASq6MxG', 'ivars1@gmail.com', '0', '2024-05-16'),
(35, 'dujdjdjrj', '$2y$10$6IkRIBZTJpC2.1askyf5sOcNVdckqzCRCIFYrjVZMCiwb2Dt0mNHy', 'jdjdjdj@djjdjd.djdj', '0', '2024-05-20'),
(36, 'ajhashhs', '$2y$10$YYnTVQJt5UTvKCfhTZWGsODbDUcgnZA9HRcxw883OdB3yZYM3Ohs6', 'dhhshhs@sjjs.shs', '0', '2024-05-26');

-- --------------------------------------------------------

--
-- Table structure for table `user_skins`
--

CREATE TABLE `user_skins` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `skin_id` int(11) NOT NULL,
  `skin_name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user_skins`
--

INSERT INTO `user_skins` (`id`, `user_id`, `skin_id`, `skin_name`) VALUES
(1, 32, 7, 'Rat'),
(2, 32, 8, 'Pig'),
(3, 32, 9, 'Bacha'),
(4, 32, 6, 'Pickle'),
(5, 32, 5, 'Toad');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `scores`
--
ALTER TABLE `scores`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `skins`
--
ALTER TABLE `skins`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `user_skins`
--
ALTER TABLE `user_skins`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `user_skins_ibfk_2` (`skin_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `scores`
--
ALTER TABLE `scores`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=28;

--
-- AUTO_INCREMENT for table `skins`
--
ALTER TABLE `skins`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=37;

--
-- AUTO_INCREMENT for table `user_skins`
--
ALTER TABLE `user_skins`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `scores`
--
ALTER TABLE `scores`
  ADD CONSTRAINT `scores_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `user_skins`
--
ALTER TABLE `user_skins`
  ADD CONSTRAINT `user_skins_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `user_skins_ibfk_2` FOREIGN KEY (`skin_id`) REFERENCES `skins` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
