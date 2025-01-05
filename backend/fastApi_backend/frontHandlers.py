from typing import List, Optional, Union
from meetings import (
    ShortMeeting, ExternalShortMeeting, Guest, ExternalGuest, ExistedMeeting, ExternalExistedMeeting, ExternalAgenda, Agenda, ExternalBaseMeeting
    )


def map_short_meeting_to_send(meeting: ShortMeeting) -> ExternalShortMeeting:
    return ExternalShortMeeting(
        id=meeting.id,
        meetingType=meeting.meeting_type,
        meetingName=meeting.meeting_name,
        startDate=meeting.start_date,
        endDate=meeting.end_date,
    )

def map_guests_to_send(meeting_guests: List[Guest]) -> list[ExternalGuest]:
    external_guests = []
    for guest in meeting_guests:
        external_guest = ExternalGuest(
            id=guest.id,
            name=guest.name,
            surname=guest.surname,
            jobPosition=guest.job_position,
        )
        external_guests.append(external_guest)
    return external_guests

def map_meeting_to_send(meeting: ExistedMeeting) -> ExternalExistedMeeting:
    guests = map_guests_to_send(meeting.guests)
    if meeting.agenda != None:
        mappedAgenda = map_agenda_outgoing(meeting.agenda)
    else:
        mappedAgenda = None
    return ExternalExistedMeeting(
        id=meeting.id,
        meetingName=meeting.meeting_name,
        meetingType=meeting.meeting_type,
        startDate=meeting.start_date,
        endDate=meeting.end_date,
        meetingAddress=meeting.meeting_address,
        onlineAddress=meeting.online_address,
        guests=guests,
        tasksList=meeting.tasksList,
        agenda=mappedAgenda,
        documents=meeting.documents,
    )


def at_least_one_address(meeting_address: str, online_address: str) -> bool:
    if (meeting_address and len(meeting_address) > 0) or (
        online_address and len(online_address) > 0
    ):
        return True
    else:
        return False


def map_guests_incoming(meeting_guests: list[ExternalGuest]) -> list[Guest]:
    guests = []
    for guest in meeting_guests:
        mapped_guest = Guest(
            id=guest.id,
            name=guest.name,
            surname=guest.surname,
            job_position=guest.jobPosition,
        )
        guests.append(mapped_guest)
    return guests


def map_agenda_incoming(incomingAgenda: ExternalAgenda) -> Agenda:
    return Agenda(
        id=incomingAgenda.id,
        name=incomingAgenda.agendaName,
        order=incomingAgenda.order,
    )


def map_agenda_outgoing(insideAgenda: Agenda) -> ExternalAgenda:
    return ExternalAgenda(
        id=insideAgenda.id,
        agendaName=insideAgenda.name,
        order=insideAgenda.order,
    )


def map_new_meeting_incoming(new_id: int, meeting: ExternalBaseMeeting) -> ExistedMeeting:
    mappedAgenda = None
    if meeting.agenda is not None:
        mappedAgenda = map_agenda_incoming(meeting.agenda)
    return ExistedMeeting(
        id=new_id,
        meeting_type=meeting.meetingType,
        meeting_name=meeting.meetingName,
        start_date=meeting.startDate,
        end_date=meeting.endDate,
        meeting_address=meeting.meetingAddress,
        online_address=meeting.onlineAddress,
        guests=map_guests_incoming(meeting.guests),
        tasksList=meeting.tasksList,
        agenda=mappedAgenda,
        documents=meeting.documents,
    )


def map_existed_meeting_incoming(
    new_id: int, meeting: ExternalExistedMeeting
) -> ExistedMeeting:
    mappedAgenda = None
    if meeting.agenda is not None:
        mappedAgenda = map_agenda_incoming(meeting.agenda)
    return ExistedMeeting(
        id=new_id,
        meeting_type=meeting.meetingType,
        meeting_name=meeting.meetingName,
        start_date=meeting.startDate,
        end_date=meeting.endDate,
        meeting_address=meeting.meetingAddress,
        online_address=meeting.onlineAddress,
        guests=map_guests_incoming(meeting.guests),
        tasksList=meeting.tasksList,
        agenda=mappedAgenda,
        documents=meeting.documents,
    )

def map_people_to_send(guest: Guest) -> ExternalGuest:
    return ExternalGuest(
        id=guest.id,
        name=guest.name,
        surname=guest.surname,
        jobPosition=guest.job_position,
    )

def create_agenda_id(agendas: List[Agenda]):
    if len(agendas) > 0:
        last_agenda = agendas[-1]
        last_agenda_id = last_agenda.id
    else:
        last_agenda_id = 1

    return last_agenda_id