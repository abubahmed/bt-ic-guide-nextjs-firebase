NUM_PERSONS_GEN = 500
NUM_ANNOUNCEMENTS_GEN = 50
NUM_RESOURCES_GEN = 50
NUM_HELP_REQUESTS_GEN = 50

NUM_DAYS_GEN = 3
SLOTS_PER_DAY_BASE_GEN = 5
SLOTS_PER_DAY_VARIATION_GEN = 1
EVENTS_PER_SLOT_BASE_GEN = 2
EVENTS_PER_SLOT_VARIATION_GEN = 1

HIDE_EVENT_EMAILS_COLUMN = True

GRADES = [
    "freshman",
    "sophomore",
    "junior",
    "senior",
    "graduate",
    "other",
]
ROLES = ["attendee", "staff"]
SUBTEAMS = [
    "logistics",
    "registration",
    "technology",
    "security",
    "operations",
    "finance",
]

ROWS_PER_PAGE_PERSONS = 50
ROWS_PER_PAGE_EVENTS = 50

ANNOUNCEMENT_CHANNELS = ["email", "website"]
VISIBILITIES = ["attendee", "staff", "shared"]
HELP_PRIORITIES = ["low", "medium", "high"]
HELP_STATUSES = ["pending", "resolved", "failure"]
HELP_TYPES = ["question", "urgent", "other"]

ANNOUNCEMENT_TITLE_LENGTH = 5
ANNOUNCEMENT_CONTENT_LENGTH = 25
RESOURCE_TITLE_LENGTH = 5
HELP_DETAILS_LENGTH = 25
ROOM_DETAILS_LENGTH = 5
EVENT_TITLE_LENGTH = 5
EVENT_DESCRIPTION_LENGTH = 10
