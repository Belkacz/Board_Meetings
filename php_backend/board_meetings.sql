-- phpMyAdmin SQL Dump
-- version 5.1.1deb5ubuntu1
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Czas generowania: 10 Mar 2024, 14:15
-- Wersja serwera: 8.0.35-0ubuntu0.22.04.1
-- Wersja PHP: 8.1.2-1ubuntu2.14

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Baza danych: `board_meetings`
--

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `country`
--

CREATE TABLE `country` (
  `id_country` varchar(3) NOT NULL,
  `country_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Zrzut danych tabeli `country`
--

INSERT INTO `country` (`id_country`, `country_name`) VALUES
('cze', 'Czechy'),
('gpb', 'Wielka Brytania'),
('nie', 'Niemcy'),
('pol', 'Polska'),
('slo', 'Słowacja'),
('usa', 'Stany Zjednoczone Ameryki');

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `test`
--

CREATE TABLE `test` (
  `id` int NOT NULL,
  `data` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Zrzut danych tabeli `test`
--

INSERT INTO `test` (`id`, `data`) VALUES
(1, 'test 0'),
(2, 'cipsko kurwa dupa'),
(3, 'cipsko kurwa dupa'),
(4, 'cipsko kurwa dupa'),
(5, 'cipsko kurwa dupa'),
(6, 'cipsko kurwa dupa'),
(7, 'cipsko kurwa dupa'),
(8, 'cipsko kurwa dupa');

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `t_guests`
--

CREATE TABLE `t_guests` (
  `id_guests` int NOT NULL,
  `fk_id_meeting` int DEFAULT NULL,
  `fk_id_person` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Zrzut danych tabeli `t_guests`
--

INSERT INTO `t_guests` (`id_guests`, `fk_id_meeting`, `fk_id_person`) VALUES
(2, 14, 1),
(3, 14, 2),
(4, 15, 1),
(5, 15, 2),
(6, 16, 1),
(7, 16, 2),
(8, 17, 1),
(9, 17, 2),
(10, 18, 1),
(11, 18, 2),
(12, 19, 1),
(13, 19, 2),
(15, 20, 1),
(16, 20, 2),
(18, 21, 1),
(19, 21, 2),
(21, 22, 1),
(22, 22, 2),
(24, 23, 1),
(25, 23, 2),
(27, 24, 1),
(28, 24, 11),
(29, 24, 12);

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `t_meetings`
--

CREATE TABLE `t_meetings` (
  `id_meeting` int NOT NULL,
  `meeting_type` varchar(255) DEFAULT NULL,
  `meeting_name` varchar(255) DEFAULT NULL,
  `start_date` datetime DEFAULT NULL,
  `end_date` datetime DEFAULT NULL,
  `meeting_address` varchar(255) DEFAULT NULL,
  `online_address` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Zrzut danych tabeli `t_meetings`
--

INSERT INTO `t_meetings` (`id_meeting`, `meeting_type`, `meeting_name`, `start_date`, `end_date`, `meeting_address`, `online_address`) VALUES
(12, 'boardMeeting', 'picie', '1970-01-01 01:00:00', '1970-01-01 01:00:00', 'park śledzia', ''),
(13, 'boardMeeting', 'picie', '1970-01-01 01:00:00', '1970-01-01 01:00:00', 'park sledzia', ''),
(14, 'boardMeeting', 'picie', '1970-01-01 01:00:00', '1970-01-01 01:00:00', 'park sledzia', ''),
(15, 'boardMeeting', 'picie', '1970-01-01 01:00:00', '1970-01-01 01:00:00', 'park sledzia', ''),
(16, 'boardMeeting', 'picie', '1970-01-01 01:00:00', '1970-01-01 01:00:00', 'park sledzia', ''),
(17, 'boardMeeting', 'picie', '1970-01-01 01:00:00', '1970-01-01 01:00:00', 'park sledzia', ''),
(18, 'boardMeeting', 'picie', '1970-01-01 01:00:00', '1970-01-01 01:00:00', 'park sledzia', ''),
(19, 'boardMeeting', 'pciie', '1970-01-01 01:00:00', '1970-01-01 01:00:00', 'dasda', ''),
(20, 'boardMeeting', '321312', '1970-01-01 01:00:00', '1970-01-01 01:00:00', '321321', ''),
(21, 'boardMeeting', 'picie', '1970-01-01 01:00:00', '1970-01-01 01:00:00', 'park sledzia', ''),
(22, 'boardMeeting', 'picie', '1970-01-01 01:00:00', '1970-01-01 01:00:00', 'park sledzia', ''),
(23, 'boardMeeting', 'picie', '1970-01-01 01:00:00', '1970-01-01 01:00:00', 'park sledzia', ''),
(24, 'boardMeeting', 'picie', '1970-01-01 01:00:00', '1970-01-01 01:00:00', 'park sledzia', '');

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `t_meeting_tasks`
--

CREATE TABLE `t_meeting_tasks` (
  `id_meeting_tasks` int NOT NULL,
  `fk_id_meeting` int DEFAULT NULL,
  `fk_id_task` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `t_person`
--

CREATE TABLE `t_person` (
  `Id_person` int NOT NULL,
  `firstname` varchar(255) DEFAULT NULL,
  `surname` varchar(255) DEFAULT NULL,
  `contact_email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `birth_date` date DEFAULT NULL,
  `fk_id_country` varchar(3) DEFAULT NULL,
  `address` varchar(765) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Zrzut danych tabeli `t_person`
--

INSERT INTO `t_person` (`Id_person`, `firstname`, `surname`, `contact_email`, `birth_date`, `fk_id_country`, `address`) VALUES
(1, 'Wade', 'Warner', 'wade@emial.com', '1984-10-10', 'usa', 'zadupana 12'),
(2, 'Floyd', 'Miles', 'floyd@emial.com', '1987-11-11', 'usa', 'cipciańska 38'),
(10, 'Damian', 'Laskowski', 'laska@gmail.com', '1996-05-15', 'pol', NULL),
(11, 'Floyd', 'Miles', '', NULL, NULL, NULL),
(12, 'Brooklyn', 'Simmons', '', NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `t_task`
--

CREATE TABLE `t_task` (
  `id_task` int NOT NULL,
  `task_name` varchar(255) DEFAULT NULL,
  `standard_duration` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `t_users`
--

CREATE TABLE `t_users` (
  `id_user` int NOT NULL,
  `username` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Indeksy dla zrzutów tabel
--

--
-- Indeksy dla tabeli `country`
--
ALTER TABLE `country`
  ADD PRIMARY KEY (`id_country`);

--
-- Indeksy dla tabeli `test`
--
ALTER TABLE `test`
  ADD PRIMARY KEY (`id`);

--
-- Indeksy dla tabeli `t_guests`
--
ALTER TABLE `t_guests`
  ADD PRIMARY KEY (`id_guests`),
  ADD KEY `idx_fk_id_meeting` (`fk_id_meeting`),
  ADD KEY `fk_id_person_t_person` (`fk_id_person`);

--
-- Indeksy dla tabeli `t_meetings`
--
ALTER TABLE `t_meetings`
  ADD PRIMARY KEY (`id_meeting`);

--
-- Indeksy dla tabeli `t_meeting_tasks`
--
ALTER TABLE `t_meeting_tasks`
  ADD PRIMARY KEY (`id_meeting_tasks`),
  ADD KEY `rel_fk_id_task_t_task` (`fk_id_task`),
  ADD KEY `rel_fk_id_meeting_t_meeting` (`fk_id_meeting`);

--
-- Indeksy dla tabeli `t_person`
--
ALTER TABLE `t_person`
  ADD PRIMARY KEY (`Id_person`),
  ADD KEY `rel_fk_id_country_t_country` (`fk_id_country`);

--
-- Indeksy dla tabeli `t_task`
--
ALTER TABLE `t_task`
  ADD PRIMARY KEY (`id_task`);

--
-- Indeksy dla tabeli `t_users`
--
ALTER TABLE `t_users`
  ADD PRIMARY KEY (`id_user`);

--
-- AUTO_INCREMENT dla zrzuconych tabel
--

--
-- AUTO_INCREMENT dla tabeli `test`
--
ALTER TABLE `test`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT dla tabeli `t_guests`
--
ALTER TABLE `t_guests`
  MODIFY `id_guests` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=30;

--
-- AUTO_INCREMENT dla tabeli `t_meetings`
--
ALTER TABLE `t_meetings`
  MODIFY `id_meeting` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- AUTO_INCREMENT dla tabeli `t_meeting_tasks`
--
ALTER TABLE `t_meeting_tasks`
  MODIFY `id_meeting_tasks` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT dla tabeli `t_person`
--
ALTER TABLE `t_person`
  MODIFY `Id_person` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT dla tabeli `t_task`
--
ALTER TABLE `t_task`
  MODIFY `id_task` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT dla tabeli `t_users`
--
ALTER TABLE `t_users`
  MODIFY `id_user` int NOT NULL AUTO_INCREMENT;

--
-- Ograniczenia dla zrzutów tabel
--

--
-- Ograniczenia dla tabeli `t_guests`
--
ALTER TABLE `t_guests`
  ADD CONSTRAINT `fk_id_person_t_person` FOREIGN KEY (`fk_id_person`) REFERENCES `t_person` (`Id_person`) ON DELETE RESTRICT ON UPDATE CASCADE;

--
-- Ograniczenia dla tabeli `t_meeting_tasks`
--
ALTER TABLE `t_meeting_tasks`
  ADD CONSTRAINT `rel_fk_id_meeting_t_meeting` FOREIGN KEY (`fk_id_meeting`) REFERENCES `t_meetings` (`id_meeting`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `rel_fk_id_task_t_task` FOREIGN KEY (`fk_id_task`) REFERENCES `t_task` (`id_task`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Ograniczenia dla tabeli `t_person`
--
ALTER TABLE `t_person`
  ADD CONSTRAINT `rel_fk_id_country_t_country` FOREIGN KEY (`fk_id_country`) REFERENCES `country` (`id_country`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
