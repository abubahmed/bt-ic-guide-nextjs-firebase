DATA_FOLDER = "data"
PERSONS_FILE = "persons.csv"
QRCODES_FILE = "qrcodes.csv"
ROOMS_FILE = "rooms.csv"
SCHEDULE_EVENTS_FILE = "schedule_events.csv"
ANNOUNCEMENT_FILE = "announcements.csv"
RESOURCE_FILE = "resources.csv"
HELP_REQUEST_FILE = "help-requests.csv"

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
    "ninth grade",
    "tenth grade",
    "eleventh grade",
    "twelfth grade",
    "freshman",
    "sophomore",
    "junior",
    "senior",
    "masters",
    "phd",
    "other",
]
HIGH_SCHOOL_GRADES = ["ninth grade", "tenth grade", "eleventh grade", "twelfth grade"]
GENERAL_ROLES = ["attendee", "staff", "admin"]
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

CHANNELS = ["email", "website"]
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
