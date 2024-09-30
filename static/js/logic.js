var map = L.map('map').setView([0, 0], 3);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

const url = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/1.0_week.geojson';

const init = async () => {
    let data = await d3.json(url);

    L.geoJSON(data, {
        pointToLayer: (data, latlng) => L.circleMarker(latlng),
        style: ({
            properties: { mag, place, time },
            geometry: { coordinates }
        }) => {
            let depth = coordinates[2];

            return {
                radius: mag * 4,
                color: 'black',
                fillOpacity: .65,
                weight:1,
                fillColor:
                    depth > 90 ? 'red' :
                    depth > 70 ? 'darkorange' : 
                    depth > 50 ? 'orange' : 
                    depth > 30 ? 'yellow' :
                    depth > 30 ? 'lime' : 'green'
            }
        }
    }).bindPopup(({feature: {properties: { mag, place, time }}}) =>
        `<h3>
            ${place}<br>
            ${new Date(time).toLocaleString()}<br>
            Magniture: ${mag}
        </h3>`
        
    ).addTo(map);
};

const legend = L.control({position:'bottomright'});

legend.onAdd = () => {
    let div = L.DomUtil.create('div', 'legend');
    div.innerHTML = `
        <i style='background:green'></i>-10 -10<br>
        <i style='background:lime'></i> 10 - 30<br>
        <i style='background:yellow'></i> 30 - 50<br>
        <i style='background:orange'></i> 50 - 70<br>
        <i style='background:darkorange'></i> 70 - 90<br>
        <i style='background:red'></i>90+ 
    `;

    return div
};

legend.addTo(map)

init();