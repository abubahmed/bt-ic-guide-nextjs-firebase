import os
import pandas as pd
from dash import Dash, dash_table, html, dcc, Input, Output
from constants import *

subfolders = [
    f for f in os.listdir(DATA_FOLDER) if os.path.isdir(os.path.join(DATA_FOLDER, f))
]

app = Dash(__name__)

app.layout = html.Div(
    [
        html.H3("Select Dataset Folder"),
        dcc.Dropdown(
            id="folder-select",
            options=[{"label": f, "value": f} for f in subfolders],
            value=subfolders[0] if subfolders else None,
            style={"width": "400px"},
        ),
        dcc.Input(
            id="search",
            type="text",
            placeholder="Search...",
            style={"width": "300px", "marginTop": "20px"},
        ),
        html.Div(id="table-container", style={"marginTop": "20px"}),
    ]
)


@app.callback(
    Output("table-container", "children"),
    Input("folder-select", "value"),
    Input("search", "value"),
)
def update_table(folder, search_value):
    if not folder:
        return html.Div("No dataset folders found.")

    folder_path = os.path.join(DATA_FOLDER, folder)
    path = folder_path + "/" + SCHEDULE_EVENTS_FILE

    if not os.path.exists(path):
        return html.Div(SCHEDULE_EVENTS_FILE + " not found in folder.")

    df = pd.read_csv(path).fillna("")

    group_cols = [
        "day",
        "start_time",
        "end_time",
        "room",
        "zoom_url",
        "title",
        "description",
        "speaker",
    ]

    grouped = (
        df.groupby(group_cols)
        .agg(
            emails=("email", lambda x: list(x)),
            persons_count=("email", "count"),
        )
        .reset_index()
    )

    grouped["emails"] = grouped["emails"].apply(lambda x: ", ".join(x))

    if search_value:
        v = search_value.lower()
        grouped = grouped[
            grouped.apply(
                lambda row: row.astype(str).str.lower().str.contains(v).any(), axis=1
            )
        ]

    return dash_table.DataTable(
        columns=[
            {"name": c, "id": c}
            for c in grouped.columns
            if c != "emails" or not HIDE_EVENT_EMAILS_COLUMN
        ],
        data=grouped.to_dict("records"),
        filter_action="native",
        sort_action="native",
        page_size=ROWS_PER_PAGE_EVENTS,
        style_table={"overflowX": "scroll"},
    )


if __name__ == "__main__":
    app.run(debug=True)
