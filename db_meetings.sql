CREATE DATABASE db_meetings;
USE db_meetings;

CREATE USER 'meetingsAdmin'@'localhost' IDENTIFIED BY 'MeetTheAdmin123';
GRANT SELECT, INSERT, DELETE, UPDATE ON db_meetings.* TO 'meetingsAdmin'@'localhost';

FLUSH PRIVILEGES;
-- phpMyAdmin SQL Dump
-- version 5.1.1deb5ubuntu1
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Czas generowania: 05 Sty 2025, 20:41
-- Wersja serwera: 8.0.40-0ubuntu0.22.04.1
-- Wersja PHP: 8.1.2-1ubuntu2.20

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Baza danych: `db_meetings`
--

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `agenda`
--

CREATE TABLE `agenda` (
  `id` int NOT NULL,
  `name` varchar(512) DEFAULT NULL
);

--
-- Zrzut danych tabeli `agenda`
--

INSERT INTO `agenda` (`id`, `name`) VALUES
(1, 'Obrady 1'),
(2, 'Obrady 2'),
(3, 'Obrady 3'),
(4, 'Obrady 4');

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `document`
--

CREATE TABLE `document` (
  `id` int NOT NULL,
  `doc_address` varchar(1024) DEFAULT NULL
);

--
-- Zrzut danych tabeli `document`
--

INSERT INTO `document` (`id`, `doc_address`) VALUES
(1, '123$testFile1.txt'),
(2, '123$testFile2.txt'),
(3, 'testFile3.txt'),
(4, 'testFile4.txt');

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `documents_list`
--

CREATE TABLE `documents_list` (
  `id` int NOT NULL,
  `fk_meeting` int DEFAULT NULL,
  `fk_document_id` int DEFAULT NULL
);

--
-- Zrzut danych tabeli `documents_list`
--

INSERT INTO `documents_list` (`id`, `fk_meeting`, `fk_document_id`) VALUES
(1, 1, 1);

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `guest`
--

CREATE TABLE `guest` (
  `id` int NOT NULL,
  `name` varchar(512) DEFAULT NULL,
  `surname` varchar(512) DEFAULT NULL,
  `job_position` varchar(512) DEFAULT NULL
);

--
-- Zrzut danych tabeli `guest`
--

INSERT INTO `guest` (`id`, `name`, `surname`, `job_position`) VALUES
(1, 'Marek', 'Gorski', 'Programista'),
(2, 'Filip', 'Barszcz', 'Manager'),
(3, 'Mateusz', 'Chmielewski', 'Designer'),
(4, 'Ambir', 'Bagieński', 'Dyrektor'),
(5, 'Przemysław', 'Hanka', 'Specjalista IT'),
(6, 'Lucjan', 'Lucjan', 'Specjalista IT');

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `guests_list`
--

CREATE TABLE `guests_list` (
  `id` int NOT NULL,
  `fk_meeting` int DEFAULT NULL,
  `fk_guest_id` int DEFAULT NULL
);

--
-- Zrzut danych tabeli `guests_list`
--

INSERT INTO `guests_list` (`id`, `fk_meeting`, `fk_guest_id`) VALUES
(1, 1, 3),
(2, 1, 1),
(3, 1, 6);

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `meeting`
--

CREATE TABLE `meeting` (
  `id` int NOT NULL,
  `meeting_type` int DEFAULT NULL,
  `meeting_name` varchar(512) DEFAULT NULL,
  `start_date` datetime DEFAULT NULL,
  `end_date` datetime DEFAULT NULL,
  `meeting_address` varchar(512) DEFAULT NULL,
  `online_address` varchar(512) DEFAULT NULL,
  `agenda` int DEFAULT NULL
);

--
-- Zrzut danych tabeli `meeting`
--

INSERT INTO `meeting` (`id`, `meeting_type`, `meeting_name`, `start_date`, `end_date`, `meeting_address`, `online_address`, `agenda`) VALUES
(1, 1, 'Spotkanie testowe', '2025-01-06 20:03:50', '2025-01-06 21:37:50', 'adres1', 'online 123', 1),
(2, 1, 'test2', '2025-01-06 19:41:46', '2025-01-06 19:42:46', '123', '123', 1);

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `meeting_type`
--

CREATE TABLE `meeting_type` (
  `id` int NOT NULL,
  `type_name` varchar(255) DEFAULT NULL
);

--
-- Zrzut danych tabeli `meeting_type`
--

INSERT INTO `meeting_type` (`id`, `type_name`) VALUES
(1, 'boardMeeting'),
(2, 'generalAssembly'),
(3, 'other');

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `orders`
--

CREATE TABLE `orders` (
  `id` int NOT NULL,
  `order` varchar(512) DEFAULT NULL
);

--
-- Zrzut danych tabeli `orders`
--

INSERT INTO `orders` (`id`, `order`) VALUES
(1, 'Wstęp do spotkania'),
(2, 'Rozpoczęcie spotkania'),
(3, 'Omówienie wyników'),
(4, 'Plany na przyszły kwartał');

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `orders_list`
--

CREATE TABLE `orders_list` (
  `id` int NOT NULL,
  `fk_agenda` int DEFAULT NULL,
  `fk_order` int DEFAULT NULL
);

--
-- Zrzut danych tabeli `orders_list`
--

INSERT INTO `orders_list` (`id`, `fk_agenda`, `fk_order`) VALUES
(1, 1, 1),
(2, 1, 2),
(3, 2, 2),
(4, 2, 3),
(5, 2, 4);

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `task`
--

CREATE TABLE `task` (
  `id` int NOT NULL,
  `name` varchar(512) DEFAULT NULL,
  `description` varchar(1024) DEFAULT NULL
);

--
-- Zrzut danych tabeli `task`
--

INSERT INTO `task` (`id`, `name`, `description`) VALUES
(1, 'Wykonać analize', 'Wykonać analize danych'),
(2, 'Zaplanować przyszły kwartał', 'zaplanować zadania na nastepny kwartał'),
(3, 'Zwolnić pracowników', 'zwolnić nierobów');

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `tasks_list`
--

CREATE TABLE `tasks_list` (
  `id` int NOT NULL,
  `fk_tasks` int DEFAULT NULL,
  `fk_task_id` int DEFAULT NULL
);

--
-- Indeksy dla zrzutów tabel
--

--
-- Indeksy dla tabeli `agenda`
--
ALTER TABLE `agenda`
  ADD PRIMARY KEY (`id`);

--
-- Indeksy dla tabeli `document`
--
ALTER TABLE `document`
  ADD PRIMARY KEY (`id`);

--
-- Indeksy dla tabeli `documents_list`
--
ALTER TABLE `documents_list`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_meeting` (`fk_meeting`),
  ADD KEY `fk_document_id` (`fk_document_id`);

--
-- Indeksy dla tabeli `guest`
--
ALTER TABLE `guest`
  ADD PRIMARY KEY (`id`);

--
-- Indeksy dla tabeli `guests_list`
--
ALTER TABLE `guests_list`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_meeting` (`fk_meeting`),
  ADD KEY `fk_guest_id` (`fk_guest_id`);

--
-- Indeksy dla tabeli `meeting`
--
ALTER TABLE `meeting`
  ADD PRIMARY KEY (`id`),
  ADD KEY `agenda` (`agenda`),
  ADD KEY `meeting_type` (`meeting_type`);

--
-- Indeksy dla tabeli `meeting_type`
--
ALTER TABLE `meeting_type`
  ADD PRIMARY KEY (`id`);

--
-- Indeksy dla tabeli `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`);

--
-- Indeksy dla tabeli `orders_list`
--
ALTER TABLE `orders_list`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_order` (`fk_order`),
  ADD KEY `fk_agenda` (`fk_agenda`);

--
-- Indeksy dla tabeli `task`
--
ALTER TABLE `task`
  ADD PRIMARY KEY (`id`);

--
-- Indeksy dla tabeli `tasks_list`
--
ALTER TABLE `tasks_list`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_tasks` (`fk_tasks`),
  ADD KEY `fk_task_id` (`fk_task_id`);

--
-- AUTO_INCREMENT dla zrzuconych tabel
--

--
-- AUTO_INCREMENT dla tabeli `agenda`
--
ALTER TABLE `agenda`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT dla tabeli `document`
--
ALTER TABLE `document`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT dla tabeli `documents_list`
--
ALTER TABLE `documents_list`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT dla tabeli `guest`
--
ALTER TABLE `guest`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT dla tabeli `guests_list`
--
ALTER TABLE `guests_list`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT dla tabeli `meeting`
--
ALTER TABLE `meeting`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT dla tabeli `meeting_type`
--
ALTER TABLE `meeting_type`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT dla tabeli `orders`
--
ALTER TABLE `orders`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT dla tabeli `orders_list`
--
ALTER TABLE `orders_list`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT dla tabeli `task`
--
ALTER TABLE `task`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT dla tabeli `tasks_list`
--
ALTER TABLE `tasks_list`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- Ograniczenia dla zrzutów tabel
--

--
-- Ograniczenia dla tabeli `documents_list`
--
ALTER TABLE `documents_list`
  ADD CONSTRAINT `documents_list_ibfk_1` FOREIGN KEY (`fk_meeting`) REFERENCES `meeting` (`id`),
  ADD CONSTRAINT `documents_list_ibfk_2` FOREIGN KEY (`fk_document_id`) REFERENCES `document` (`id`);

--
-- Ograniczenia dla tabeli `guests_list`
--
ALTER TABLE `guests_list`
  ADD CONSTRAINT `guests_list_ibfk_1` FOREIGN KEY (`fk_meeting`) REFERENCES `meeting` (`id`),
  ADD CONSTRAINT `guests_list_ibfk_2` FOREIGN KEY (`fk_guest_id`) REFERENCES `guest` (`id`);

--
-- Ograniczenia dla tabeli `meeting`
--
ALTER TABLE `meeting`
  ADD CONSTRAINT `meeting_ibfk_1` FOREIGN KEY (`agenda`) REFERENCES `agenda` (`id`),
  ADD CONSTRAINT `meeting_ibfk_2` FOREIGN KEY (`meeting_type`) REFERENCES `meeting_type` (`id`);

--
-- Ograniczenia dla tabeli `orders_list`
--
ALTER TABLE `orders_list`
  ADD CONSTRAINT `orders_list_ibfk_1` FOREIGN KEY (`fk_order`) REFERENCES `orders` (`id`),
  ADD CONSTRAINT `orders_list_ibfk_2` FOREIGN KEY (`fk_agenda`) REFERENCES `agenda` (`id`);

--
-- Ograniczenia dla tabeli `tasks_list`
--
ALTER TABLE `tasks_list`
  ADD CONSTRAINT `tasks_list_ibfk_1` FOREIGN KEY (`fk_tasks`) REFERENCES `meeting` (`id`),
  ADD CONSTRAINT `tasks_list_ibfk_2` FOREIGN KEY (`fk_task_id`) REFERENCES `task` (`id`);
COMMIT;
