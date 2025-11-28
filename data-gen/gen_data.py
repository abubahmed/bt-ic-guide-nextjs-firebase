import csv
import os
import random
import string
from datetime import datetime, timedelta
from faker import Faker
import urllib.parse
from constants import *

fake = Faker()


def random_folder_name(length=RANDOM_FOLDER_NAME_LENGTH):
    return "".join(random.choices(string.ascii_lowercase + string.digits, k=length))


def random_room_number():
    building = random.choice(string.ascii_uppercase)
    floor = random.randint(1, 6)
    number = random.randint(0, 25)
    return f"{building}{floor}{number:02d}"


def generate_unique_email(existing):
    while True:
        local_part = fake.user_name()
        domain = fake.free_email_domain()
        email = f"{local_part}@{domain}"
        if email not in existing:
            return email


def generate_persons(n):
    persons = []
    emails = set()
    for _ in range(n):
        full_name = fake.name()
        email = generate_unique_email(emails)
        emails.add(email)
        phone = fake.phone_number()

        role = random.choices(
            GENERAL_ROLES,
            weights=[70, 25, 5],
            k=1,
        )[0]
        grade = random.choice(GRADES)
        if grade in HIGH_SCHOOL_GRADES:
            school = fake.city() + " High School"
        else:
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


def generate_qr_codes(people):
    qr_rows = []
    for p in people:
        full_name = p["full_name"]
        encoded = urllib.parse.quote_plus(full_name + " | " + p["email"])
        url = f"https://api.qrserver.com/v1/create-qr-code/?size=300x300&data={encoded}"
        qr_rows.append(
            {
                "email": p["email"],
                "full_name": full_name,
                "url": url,
            }
        )
    return qr_rows


def generate_rooms(persons):
    rooms = []
    for p in persons:
        room_number = random_room_number()
        details = fake.sentence(nb_words=8)
        rooms.append(
            {
                "email": p["email"],
                "full_name": p["full_name"],
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
        slots_today = random.randint(min_slots, max_slots)

        for slot_index in range(slots_today):
            slot_start = base_start + timedelta(minutes=60 * slot_index)
            slot_end = slot_start + timedelta(minutes=50)
            start_time_str = slot_start.strftime("%H:%M")
            end_time_str = slot_end.strftime("%H:%M")

            min_events = max(1, events_per_slot_base - events_per_slot_variation)
            max_events = max(
                min_events, events_per_slot_base + events_per_slot_variation
            )
            num_events = random.randint(min_events, max_events)
            events_for_slot = []

            for _ in range(num_events):
                in_person = random.choice([True, False])
                if in_person:
                    room = random_room_number()
                    zoom_url = ""
                else:
                    room = ""
                    zoom_url = "https://zoom.example.com/j/" + str(
                        random.randint(1000000000, 9999999999)
                    )

                title = fake.sentence(nb_words=6)
                description = fake.sentence(nb_words=20)
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
):
    folder = os.path.join(DATA_FOLDER, random_folder_name())
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

    write_csv(
        folder,
        PERSONS_FILE,
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
    write_csv(folder, QRCODES_FILE, qrcodes, ["email", "full_name", "url"])
    write_csv(
        folder,
        ROOMS_FILE,
        rooms,
        ["email", "full_name", "room_number", "details"],
    )
    write_csv(
        folder,
        SCHEDULE_EVENTS_FILE,
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
    print("Generated folder:", folder)


if __name__ == "__main__":
    main()
