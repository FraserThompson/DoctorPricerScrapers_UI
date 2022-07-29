# DoctorPricer Scrapers UI

Bootstrapped via create-react-app.

## Dev

Change the `apiUrl` in `app_config.json` to point to your local `dp_server` instance then run:

`npm run serve`

Now it'll be running on http://localhost:8080

## Deploy

`npm run build`

Commit and push to master then run:

`npm run deploy`


## Obtaining regions

This was fiddly so I'll document it here.

1. Get the GeoJSON data with this: https://nominatim.openstreetmap.org/search.php?q=Region+New+Zealand&polygon_geojson=1&format=json
1. Simplify it with https://mapshaper.org/