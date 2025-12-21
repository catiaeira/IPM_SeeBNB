export const ClusterRenderer = {
  render: ({ count, position }) => {

    let color = '#d6f07ad9';   
    if (count > 100) color = '#ffe36bf6'; 
    if (count > 250) color = '#ffb45cf6'; 
    if (count > 500) color = '#ff2a2aff'; 

    const size = Math.min(40 + Math.floor(count / 10), 70);

    const svg = window.btoa(`
      <svg fill="${color}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 240">
        <circle cx="120" cy="120" opacity=".6" r="80" />
        <circle cx="120" cy="120" opacity=".3" r="115" />
      </svg>`);

    return new window.google.maps.Marker({
      position,
      icon: {
        url: `data:image/svg+xml;base64,${svg}`,
        scaledSize: new window.google.maps.Size(size, size),
        // anchoring the icon to the center
        anchor: new window.google.maps.Point(size / 2, size / 2),
        labelOrigin: new window.google.maps.Point(size / 2, size / 2)
      },
      label: {
        text: String(count),
        color: "white",
        fontSize: count > 100 ? "14px" : "11px", // bigger text for bigger clusters
        fontWeight: "bold"
      },
      zIndex: Number(window.google.maps.Marker.MAX_ZINDEX) + count,
    });
  }
};