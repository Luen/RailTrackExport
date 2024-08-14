(function() {
    function createGPX(trailPaths) {
        const gpxHeader = '<?xml version="1.0" encoding="UTF-8"?>' +
            '<gpx version="1.1" creator="Trail GPX Exporter" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" ' +
            'xmlns="http://www.topografix.com/GPX/1/1" xmlns:gpxtpx="http://www.garmin.com/xmlschemas/TrackPointExtension/v1" ' +
            'xsi:schemaLocation="http://www.topografix.com/GPX/1/1 http://www.topografix.com/GPX/1/1/gpx.xsd">' +
            '<metadata><name>Trail GPX</name><desc>GPX file generated from trail paths</desc><author>Trail Exporter</author></metadata>';
        const gpxFooter = '</gpx>';
        let gpxBody = '';
        trailPaths.forEach(function(path) {
            gpxBody += '<trk><name>' + (path.type || 'Trail') + '</name><trkseg>';
            path.data.forEach(function(point) {
                gpxBody += '<trkpt lat="' + point.lat + '" lon="' + point.lng + '"></trkpt>';
            });
            gpxBody += '</trkseg></trk>';
        });
        const gpxContent = gpxHeader + gpxBody + gpxFooter;
        return gpxContent;
    }

    function downloadGPX(gpxContent, filename = 'trail.gpx') {
        const blob = new Blob([gpxContent], { type: 'application/gpx+xml' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    const trailPaths = window.trail_paths;
    if (trailPaths) {
        const gpxContent = createGPX(trailPaths);
        downloadGPX(gpxContent);
    } else {
        alert("No trail paths found!");
    }
})();
