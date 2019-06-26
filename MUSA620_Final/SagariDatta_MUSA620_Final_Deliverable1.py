import dash
import dash_core_components as dcc
import dash_html_components as html

import numpy as np
import pandas as pd
import geopandas as gpd
from shapely.geometry import Point
from shapely.geometry import shape

import folium
import plotly.plotly as py
import plotly.graph_objs as go

#load data
hoodFinal = pd.read_csv("./finalNeighborhood.csv", error_bad_lines=False)
hoodFinal_json = gpd.read_file("./finalNeighborhood.geojson", error_bad_lines=False)
neighborhood_json = gpd.read_file("./neighborhood.geojson", error_bad_lines=False)
boroGrp = hoodFinal_json.groupby('boro_name').mean()['listings'].reset_index(name="Listings")

#initialize the app
app = dash.Dash(__name__)

#add external styling
app.css.append_css({"external_url": "https://codepen.io/chriddyp/pen/bWLwgP.css"})

#set a title
app.title = "NYC Airbnb Data Analysis"


#function to get folium map
def get_folium_choropleth(dff, var_selected):
    m2 = folium.Map(
        location=[40.7128, -74.0090],
        zoom_start=10,
        tiles='Cartodb Positron')
    #id variables
    data_id = 'ntaname'
    json_id = 'ntaname'
    #add data to map
    folium.Choropleth(
        geo_data=neighborhood_json,
        name='choropleth',
        data=dff,
        columns=[data_id, var_selected],
        key_on='feature.properties.%s' % json_id,
        fill_color='PuBuGn',
        nan_fill_color = '#ffffff00',
        fill_opacity=0.7,
        line_opacity=1,
        line_weight=0.5,
        legend_name='Value of variables selected aggregated to neighborhoods'
    ).add_to(m2)
    #return the string version of the HTML file
    return m2.get_root().render()



markdown_text = """
NYC Airbnb Data Analysis
"""

# set the layout
app.layout = html.Div([

        html.H1(markdown_text),

        html.Div([

                #div element for drop down and select bullets
                html.Div([

                    dcc.Dropdown(
                        id="variable-selector",
                        options=[
                            {'label': 'No. of Airbnb listings', 'value': 'listings'},
                            {'label': 'Airbnb listing price', 'value': 'airbnb_price'},
                            {'label': 'Airbnb reviews', 'value': 'airbnb_reviews'},
                            {'label': 'Airbnb listings available', 'value': 'airbnb_avail365'},
                            {'label': 'Property market value', 'value': 'avg_market_val'}
                        ],
                        value='listings',
                        style={"width": "60%", "margin-left":"1%"},
                        className="six columns"),

                    dcc.RadioItems(
                        id="boro-selector",
                        options=[
                            {'label': 'Manhattan', 'value': 'Manhattan'},
                            {'label': u'Brooklyn', 'value': 'Brooklyn'},
                            {'label': 'Bronx', 'value': 'Bronx'},
                            {'label': 'Queens', 'value': 'Queens'},
                            {'label': 'Staten Island', 'value': 'Staten Island'}
                        ],
                        value='Manhattan',
                        style={"width": "60%", "margin-left":"-6%"},
                        className="six columns")
            ],
        ),
        # Map Iframe
        html.Div(
            [
                html.Iframe(
                    id="map",
                    height="600",
                    width="900",
                    sandbox="allow-scripts",
                    style={"border-width": "0px", "margin-top":"3%", "margin-left":"1%",  "align": "center"},
                )
            ],

        ),
        #Div element for scatter plot
        html.Div([
        dcc.Graph(
            id='price_vs_marketval',
            figure={
                'data': [
                    go.Scatter(
                        x=hoodFinal['airbnb_price'],
                        y=hoodFinal['avg_market_val'],
                        text=hoodFinal['ntaname'],
                        mode='markers',
                        opacity=0.7,
                        marker={
                            'size': 15,
                            'line': {'width': 0.5, 'color': 'white'}
                                },
                            )
                        ],
                'layout': go.Layout(
                    xaxis={'title': 'Airbnb list price'},
                    yaxis={'title': 'Average property market value'},
                    margin={'l': 40, 'b': 40, 't': 10, 'r': 10},
                    legend={'x': 0, 'y': 1},
                    hovermode='closest'
                )
            }
        )
        ], style={"width": "40%", "margin-top": "-49%", "margin-left": "58%", "margin-right": "8%"}),
        #Div element for bar plot
        html.Div([
        dcc.Graph(
            id='barPlot',
            figure={
                'data': [
                    go.Bar(
                        x=boroGrp['boro_name'],
                        y=boroGrp['Listings'],
                        )
                        ],
                'layout': go.Layout(
                    xaxis={'title': 'Borough'},
                    yaxis={'title': 'Average (of variable selected)'},
                    margin={'l': 40, 'b': 40, 't': 10, 'r': 10},
                    hovermode='closest'
                )
            }
        )
        ], style={"width": "40%", "height":"10%", "margin-bottom":"105%", "margin-left": "57%", "margin-right": "4%"})
    ]
    )
]
)

#Call back: drop down and select variable inputs and map output
#Map changes based on variables and borough selected
@app.callback(
    dash.dependencies.Output("map", "srcDoc"),
    [dash.dependencies.Input("boro-selector", "value"),
     dash.dependencies.Input("variable-selector", "value")],
)
def results(boro_selected, var_selected):
    #filter for the correct dataframe
    dff = hoodFinal_json[hoodFinal_json['boro_name'] == boro_selected]
    #get folium map
    map = get_folium_choropleth(dff, var_selected)
    #output map
    return map


#Call back: drop down inputs and scatterplot output
#Scatter plot changes based on borough selected
@app.callback(
    dash.dependencies.Output("price_vs_marketval", "figure"),
    [dash.dependencies.Input("boro-selector", "value")],
)
def updateGraphs(boro_selected):
    #filter for the correct dataframe
    dff = hoodFinal_json[hoodFinal_json['boro_name'] == boro_selected]
    #update graph
    return {
            'data': [
                go.Scatter(
                    x=dff['airbnb_price'],
                    y=dff['avg_market_val'],
                    text=dff['ntaname'],
                    mode='markers',
                    opacity=0.7,
                    marker={
                        'size': 15,
                        'line': {'width': 0.5, 'color': 'white'}
                            },
                        )
                    ],
            'layout': go.Layout(
                xaxis={'title': 'Airbnb list price'},
                yaxis={'title': 'Average property market value'},
                margin={'l': 40, 'b': 40, 't': 10, 'r': 10},
                legend={'x': 0, 'y': 1},
                hovermode='closest'
            )
        }

#Call back: Variables selected input and bar plot is Output
#Bar plot changes as the variables selected changes
@app.callback(
    dash.dependencies.Output("barPlot", "figure"),
    [dash.dependencies.Input("variable-selector", "value")],
)
def updateBarPlot(var_selected):
    dff = hoodFinal_json.groupby('boro_name').mean()[var_selected].reset_index(name=var_selected)

    return {
            'data': [
                    go.Bar(
                        x=dff['boro_name'],
                        y=dff[var_selected],
                        )
                        ],
                'layout': go.Layout(
                    xaxis={'title': 'Borough'},
                    yaxis={'title': var_selected},
                    margin={'l': 40, 'b': 40, 't': 10, 'r': 10},
                    hovermode='closest'
                )
        }



if __name__ == "__main__":
    app.run_server(host="0.0.0.0", port=5000, debug=True)
