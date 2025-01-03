CREATE DATABASE db_meetings;
USE db_meetings;

CREATE USER 'meetingsAdmin'@'localhost' IDENTIFIED BY 'MeetTheAdmin123';
GRANT SELECT, INSERT, DELETE, UPDATE ON db_meetings.* TO 'meetingsAdmin'@'localhost';

FLUSH PRIVILEGES;

--
-- Baza danych: `db_meetings`
--

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `agenda`
--

CREATE TABLE `agenda` (
  `id` int NOT NULL,
  `name` varchar(512) DEFAULT NULL,
  `order` int DEFAULT NULL
);

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `document`
--

CREATE TABLE `document` (
  `id` int NOT NULL,
  `doc_address` varchar(1024) DEFAULT NULL
);

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `documents_list`
--

CREATE TABLE `documents_list` (
  `id` int NOT NULL,
  `fk_meeting` int DEFAULT NULL,
  `fk_document_id` int DEFAULT NULL
);

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

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `meeting`
--

CREATE TABLE `meeting` (
  `id` int NOT NULL,
  `meeting_type` int DEFAULT NULL,
  `meeting_name` varchar(512) DEFAULT NULL,
  `start_date` date DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  `meeting_address` varchar(512) DEFAULT NULL,
  `online_address` varchar(512) DEFAULT NULL,
  `agenda` int DEFAULT NULL
);

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `meeting_type`
--

CREATE TABLE `meeting_type` (
  `id` int NOT NULL,
  `type_name` varchar(255) DEFAULT NULL
);

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `task`
--

CREATE TABLE `task` (
  `id` int NOT NULL,
  `name` varchar(512) DEFAULT NULL,
  `description` varchar(1024) DEFAULT NULL
);

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
  ADD KEY `agenda` (`agenda`);

--
-- Indeksy dla tabeli `meeting_type`
--
ALTER TABLE `meeting_type`
  ADD PRIMARY KEY (`id`);

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
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT dla tabeli `document`
--
ALTER TABLE `document`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT dla tabeli `documents_list`
--
ALTER TABLE `documents_list`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT dla tabeli `guest`
--
ALTER TABLE `guest`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT dla tabeli `guests_list`
--
ALTER TABLE `guests_list`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT dla tabeli `meeting`
--
ALTER TABLE `meeting`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT dla tabeli `meeting_type`
--
ALTER TABLE `meeting_type`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT dla tabeli `task`
--
ALTER TABLE `task`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

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
  ADD CONSTRAINT `meeting_ibfk_1` FOREIGN KEY (`agenda`) REFERENCES `agenda` (`id`);

--
-- Ograniczenia dla tabeli `meeting_type`
--
ALTER TABLE `meeting_type`
  ADD CONSTRAINT `meeting_type_ibfk_1` FOREIGN KEY (`id`) REFERENCES `meeting` (`id`);

--
-- Ograniczenia dla tabeli `tasks_list`
--
ALTER TABLE `tasks_list`
  ADD CONSTRAINT `tasks_list_ibfk_1` FOREIGN KEY (`fk_tasks`) REFERENCES `meeting` (`id`),
  ADD CONSTRAINT `tasks_list_ibfk_2` FOREIGN KEY (`fk_task_id`) REFERENCES `task` (`id`);
COMMIT;

