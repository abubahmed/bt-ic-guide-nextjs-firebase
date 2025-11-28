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

    persons = pd.read_csv(folder_path + "/" + PERSONS_FILE).fillna("")
    qrcodes = pd.read_csv(folder_path + "/" + QRCODES_FILE).fillna("")
    rooms = pd.read_csv(folder_path + "/" + ROOMS_FILE).fillna("")

    qrcodes = qrcodes.rename(columns={"url": "qr_url"})
    rooms = rooms.rename(columns={"room": "room_number"})

    merged = persons.merge(qrcodes[["email", "qr_url"]], on="email", how="left")
    merged = merged.merge(rooms[["email", "room_number"]], on="email", how="left")

    if search_value:
        v = search_value.lower()
        merged = merged[
            merged.apply(
                lambda row: row.astype(str).str.lower().str.contains(v).any(), axis=1
            )
        ]

    return dash_table.DataTable(
        columns=[{"name": c, "id": c} for c in merged.columns],
        data=merged.to_dict("records"),
        filter_action="native",
        sort_action="native",
        page_size=ROWS_PER_PAGE_PERSONS,
        style_table={"overflowX": "scroll"},
    )


if __name__ == "__main__":
    app.run(debug=True)
