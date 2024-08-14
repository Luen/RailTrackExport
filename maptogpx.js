(function() {
    function createGPX(trailPaths, trailMarkers) {
        const gpxHeader = '<?xml version="1.0" encoding="UTF-8"?>' +
            '<gpx version="1.1" creator="Trail GPX Exporter" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" ' +
            'xmlns="http://www.topografix.com/GPX/1/1" xmlns:gpxtpx="http://www.garmin.com/xmlschemas/TrackPointExtension/v1" ' +
            'xsi:schemaLocation="http://www.topografix.com/GPX/1/1 http://www.topografix.com/GPX/1/1/gpx.xsd">' +
            '<metadata><name>Trail GPX</name><desc>GPX file generated from trail paths</desc><author>Trail Exporter</author></metadata>';
        const gpxFooter = '</gpx>';
        let gpxBody = '';

        // Add waypoints (trail markers)
        if (trailMarkers && trailMarkers.length > 0) {
            trailMarkers.forEach(function(marker) {
                gpxBody += '<wpt lat="' + marker.lat + '" lon="' + marker.lng + '">';
                gpxBody += '<name>' + (marker.des_plain || 'Waypoint') + '</name>';
                if (marker.elevation) {
                    gpxBody += '<ele>' + marker.elevation.replace(' m', '') + '</ele>';
                }
                if (marker.des) {
                    gpxBody += '<desc>' + marker.des + '</desc>';
                }
                gpxBody += '</wpt>';
            });
        }

        // Add track segments
        trailPaths.forEach(function(path) {
            const trackName = path.type === 'on_road' ? 'Potential Route (Dashed Line)' : (path.type || 'Trail');
            gpxBody += '<trk><name>' + trackName + '</name><trkseg>';
            path.data.forEach(function(point) {
                gpxBody += '<trkpt lat="' + point.lat + '" lon="' + point.lng + '"></trkpt>';
            });
            gpxBody += '</trkseg></trk>';
        });

        const gpxContent = gpxHeader + gpxBody + gpxFooter;
        return gpxContent;
    }

    function downloadGPX(gpxContent, filename) {
        const blob = new Blob([gpxContent], { type: 'application/gpx+xml' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    // Get the filename from the first h2 tag, falling back to the title tag
    function getFilename() {
        let filename = '';
        const h2 = document.querySelector('h2');
        if (h2) {
            filename = h2.textContent.trim();
        } else {
            const title = document.querySelector('title');
            if (title) {
                filename = title.textContent.trim();
            }
        }
        // Sanitize the filename by replacing spaces with underscores and removing special characters
        filename = filename.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_\-\.]/g, '') + '.gpx';
        return filename;
    }

    // Ensure that the correct global variables are used
    const trailPaths = window.trail_paths || [];
    const trailMarkers = window.trail_markers || [];

    if (trailPaths.length > 0) {
        const gpxContent = createGPX(trailPaths, trailMarkers);
        const filename = getFilename();
        downloadGPX(gpxContent, filename);
    } else {
        alert("No trail paths found!");
    }
})();
