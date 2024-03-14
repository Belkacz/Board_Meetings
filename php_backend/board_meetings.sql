-- phpMyAdmin SQL Dump
-- version 5.1.1deb5ubuntu1
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Czas generowania: 14 Mar 2024, 21:43
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
(1, 'test 0');

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
(54, 33, 1),
(55, 33, 2),
(56, 33, 3);

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
(33, 'boardMeeting', 'spotkanie', '2024-03-10 14:14:50', '2024-03-10 16:16:50', 'park sledzia', '');

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `t_meeting_tasks`
--

CREATE TABLE `t_meeting_tasks` (
  `id_meeting_tasks` int NOT NULL,
  `fk_id_meeting` int DEFAULT NULL,
  `fk_id_task` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Zrzut danych tabeli `t_meeting_tasks`
--

INSERT INTO `t_meeting_tasks` (`id_meeting_tasks`, `fk_id_meeting`, `fk_id_task`) VALUES
(3, 33, 3),
(4, 33, 4);

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
(1, 'Wade', 'Warner', 'wade@emial.com', '1984-10-10', 'usa', 'uliczna 12'),
(2, 'Floyd', 'Miles', 'floyd@emial.com', '1987-11-11', 'usa', 'cipciańska 38'),
(3, 'Brooklyn', 'Simmons', 'simons@email.com', '1988-11-02', 'usa', 'broklyn st. 16'),
(4, 'Guy', 'Howkins', 'howkins@email.com', '1989-10-02', 'usa', 'broklyn st. 17'),
(5, 'Darrell', 'Steward', 'steward@email.com', '1986-01-22', 'usa', 'broklyn st. 18'),
(6, 'Wade', 'Warner2', 'wade2@emial.com', '1984-10-10', 'usa', 'uliczna 12'),
(10, 'Damian', 'Laskowski', 'laska@gmail.com', '1996-05-15', 'pol', NULL);

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `t_task`
--

CREATE TABLE `t_task` (
  `id_task` int NOT NULL,
  `task_name` varchar(255) DEFAULT NULL,
  `standard_duration` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Zrzut danych tabeli `t_task`
--

INSERT INTO `t_task` (`id_task`, `task_name`, `standard_duration`) VALUES
(3, 'New task name 1', 60),
(4, 'New task name 2', 60);

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
  MODIFY `id_guests` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=57;

--
-- AUTO_INCREMENT dla tabeli `t_meetings`
--
ALTER TABLE `t_meetings`
  MODIFY `id_meeting` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=34;

--
-- AUTO_INCREMENT dla tabeli `t_meeting_tasks`
--
ALTER TABLE `t_meeting_tasks`
  MODIFY `id_meeting_tasks` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT dla tabeli `t_person`
--
ALTER TABLE `t_person`
  MODIFY `Id_person` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT dla tabeli `t_task`
--
ALTER TABLE `t_task`
  MODIFY `id_task` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

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
