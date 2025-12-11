import csv
import os
import random
import string
from datetime import datetime, timedelta
from faker import Faker
import urllib.parse
from constants import *

fake = Faker()


def random_room_number():
    building = random.choice(string.ascii_uppercase)
    floor = random.randint(1, 6)
    number = random.randint(0, 25)
    return f"{building}{floor}{number:02d}"


def generate_unique_email(existing_emails):
    while True:
        local_part = fake.user_name()
        domain = fake.free_email_domain()
        email = f"{local_part}@{domain}"
        if email not in existing_emails:
            return email


def generate_persons(num_persons):
    persons = []
    existing_emails = set()

    for _ in range(num_persons):
        full_name = fake.name()
        email = generate_unique_email(existing_emails)
        existing_emails.add(email)
        phone = fake.phone_number()

        role = random.choices(
            ROLES,
            weights=[70, 30],
            k=1,
        )[0]

        grade = random.choice(GRADES)
        school = fake.city() + " University"

        company = fake.company()
        subteam = random.choice(SUBTEAMS) if role == "staff" else ""

        persons.append(
            {
                "full_name": full_name,
                "email": email,
                "phone": phone,
                "role": role,
                "subteam": subteam,
                "school": school,
                "grade": grade,
                "company": company,
            }
        )
    return persons


def generate_qr_codes(persons):
    qr_rows = []
    for person in persons:
        full_name = person["full_name"]
        encoded_data = urllib.parse.quote_plus(full_name + " | " + person["email"])
        qr_url = f"https://api.qrserver.com/v1/create-qr-code/?size=300x300&data={encoded_data}"
        qr_rows.append(
            {
                "email": person["email"],
                "full_name": full_name,
                "url": qr_url,
            }
        )
    return qr_rows


def generate_rooms(persons):
    rooms = []
    for person in persons:
        room_number = random_room_number()
        details = fake.sentence(nb_words=ROOM_DETAILS_LENGTH)
        rooms.append(
            {
                "email": person["email"],
                "full_name": person["full_name"],
                "room_number": room_number,
                "details": details,
            }
        )
    return rooms


def generate_schedule_events(
    persons,
    num_days,
    slots_per_day_base,
    slots_per_day_variation,
    events_per_slot_base,
    events_per_slot_variation,
):
    rows = []
    base_start = datetime(2000, 1, 1, 9, 0)

    for day_index in range(num_days):
        day_label = f"Day {day_index + 1}"

        min_slots = max(1, slots_per_day_base - slots_per_day_variation)
        max_slots = max(min_slots, slots_per_day_base + slots_per_day_variation)
        slot_count_for_day = random.randint(min_slots, max_slots)

        for slot_index in range(slot_count_for_day):
            slot_start = base_start + timedelta(minutes=60 * slot_index)
            slot_end = slot_start + timedelta(minutes=50)

            start_time_str = slot_start.strftime("%H:%M")
            end_time_str = slot_end.strftime("%H:%M")

            min_events = max(1, events_per_slot_base - events_per_slot_variation)
            max_events = max(
                min_events, events_per_slot_base + events_per_slot_variation
            )
            event_count = random.randint(min_events, max_events)

            events_for_slot = []

            for _ in range(event_count):
                is_in_person = random.choice([True, False])
                if is_in_person:
                    room = random_room_number()
                    zoom_url = ""
                else:
                    room = ""
                    zoom_url = "https://zoom.example.com/j/" + str(
                        random.randint(1000000000, 9999999999)
                    )

                title = fake.sentence(nb_words=EVENT_TITLE_LENGTH)
                description = fake.sentence(nb_words=EVENT_DESCRIPTION_LENGTH)
                speaker = fake.name()

                events_for_slot.append(
                    {
                        "day": day_label,
                        "start_time": start_time_str,
                        "end_time": end_time_str,
                        "room": room,
                        "zoom_url": zoom_url,
                        "title": title,
                        "description": description,
                        "speaker": speaker,
                    }
                )

            for person in persons:
                event = random.choice(events_for_slot)
                rows.append(
                    {
                        "email": person["email"],
                        "full_name": person["full_name"],
                        "subteam": person["subteam"],
                        "day": event["day"],
                        "start_time": event["start_time"],
                        "end_time": event["end_time"],
                        "room": event["room"],
                        "zoom_url": event["zoom_url"],
                        "title": event["title"],
                        "description": event["description"],
                        "speaker": event["speaker"],
                    }
                )

    return rows


def generate_announcements(persons, num_announcements):
    admins = [person for person in persons if person["role"] == "admin"]
    rows = []
    if not admins:
        return rows

    for _ in range(num_announcements):
        admin = random.choice(admins)
        rows.append(
            {
                "created_at": int(datetime.now().timestamp() * 1000),
                "channel": random.choice(ANNOUNCEMENT_CHANNELS),
                "visibility": random.choice(VISIBILITIES),
                "title": fake.sentence(nb_words=ANNOUNCEMENT_TITLE_LENGTH),
                "message": fake.sentence(nb_words=ANNOUNCEMENT_CONTENT_LENGTH),
                "email": admin["email"],
                "full_name": admin["full_name"],
                "role": admin["role"],
                "subteam": admin["subteam"],
            }
        )
    return rows


def generate_resources(persons, num_resources):
    admins = [person for person in persons if person["role"] == "admin"]
    rows = []
    if not admins:
        return rows

    for _ in range(num_resources):
        admin = random.choice(admins)
        rows.append(
            {
                "created_at": int(datetime.now().timestamp() * 1000),
                "title": fake.sentence(nb_words=RESOURCE_TITLE_LENGTH),
                "type": random.choice(["file", "url"]),
                "url": fake.url(),
                "visibility": random.choice(VISIBILITIES),
                "email": admin["email"],
                "full_name": admin["full_name"],
                "role": admin["role"],
                "subteam": admin["subteam"],
            }
        )
    return rows


def generate_help_requests(persons, num_help_requests):
    rows = []
    for _ in range(num_help_requests):
        requester = random.choice(persons)
        rows.append(
            {
                "created_at": int(datetime.now().timestamp() * 1000),
                "help_type": random.choice(HELP_TYPES),
                "priority": random.choice(HELP_PRIORITIES),
                "status": random.choice(HELP_STATUSES),
                "details": fake.sentence(nb_words=HELP_DETAILS_LENGTH),
                "email": requester["email"],
                "full_name": requester["full_name"],
                "role": requester["role"],
                "subteam": requester["subteam"],
            }
        )
    return rows


def write_csv(path, filename, rows, fieldnames):
    with open(os.path.join(path, filename), "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(rows)


def main(
    num_people=NUM_PERSONS_GEN,
    num_days=NUM_DAYS_GEN,
    slots_per_day_base=SLOTS_PER_DAY_BASE_GEN,
    slots_per_day_variation=SLOTS_PER_DAY_VARIATION_GEN,
    events_per_slot_base=EVENTS_PER_SLOT_BASE_GEN,
    events_per_slot_variation=EVENTS_PER_SLOT_VARIATION_GEN,
    num_announcements=NUM_ANNOUNCEMENTS_GEN,
    num_resources=NUM_RESOURCES_GEN,
    num_help_requests=NUM_HELP_REQUESTS_GEN,
):
    timestamp_str = datetime.now().strftime("%Y-%m-%d_%H-%M-%S")
    folder = os.path.join("data", timestamp_str)
    os.makedirs(folder, exist_ok=True)

    persons = generate_persons(num_people)
    qrcodes = generate_qr_codes(persons)
    rooms = generate_rooms(persons)
    schedule_events = generate_schedule_events(
        persons,
        num_days,
        slots_per_day_base,
        slots_per_day_variation,
        events_per_slot_base,
        events_per_slot_variation,
    )
    announcements = generate_announcements(persons, num_announcements)
    resources = generate_resources(persons, num_resources)
    help_requests = generate_help_requests(persons, num_help_requests)

    write_csv(
        folder,
        "persons.csv",
        persons,
        [
            "full_name",
            "email",
            "phone",
            "role",
            "subteam",
            "school",
            "grade",
            "company",
        ],
    )
    write_csv(folder, "qrcodes.csv", qrcodes, ["email", "full_name", "url"])
    write_csv(
        folder,
        "rooms.csv",
        rooms,
        ["email", "full_name", "room_number", "details"],
    )
    write_csv(
        folder,
        "schedule_events.csv",
        schedule_events,
        [
            "email",
            "full_name",
            "subteam",
            "day",
            "start_time",
            "end_time",
            "room",
            "zoom_url",
            "title",
            "description",
            "speaker",
        ],
    )
    write_csv(
        folder,
        "announcements.csv",
        announcements,
        [
            "created_at",
            "channel",
            "visibility",
            "title",
            "message",
            "email",
            "full_name",
            "role",
            "subteam",
        ],
    )
    write_csv(
        folder,
        "resources.csv",
        resources,
        [
            "created_at",
            "title",
            "type",
            "url",
            "visibility",
            "email",
            "full_name",
            "role",
            "subteam",
        ],
    )
    write_csv(
        folder,
        "help-requests.csv",
        help_requests,
        [
            "created_at",
            "help_type",
            "priority",
            "status",
            "details",
            "email",
            "full_name",
            "role",
            "subteam",
        ],
    )

    print("Generated folder:", folder)


if __name__ == "__main__":
    main()
