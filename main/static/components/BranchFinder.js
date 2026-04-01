function BranchFinder() {
  const initialData = window.allBranches || window.branchData || [];
  const [userLoc, setUserLoc] = React.useState(null);
  const [sortedBranches, setSortedBranches] = React.useState(initialData);
  const [searchText, setSearchText] = React.useState("");
  const [nearest, setNearest] = React.useState(null);
  const mapRef = React.useRef(null);
  const routingRef = React.useRef(null);
  const bufferRef = React.useRef(null);
  const userMarkerRef = React.useRef(null);
  const markersLayerRef = React.useRef(L.layerGroup());
  const getDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  };
  // Hàm dùng chung để cập nhật vị trí gốc (Origin) và tính toán lại danh sách
  const handleLocationUpdate = (lat, lng, isGPS = false) => {
    const uLoc = { lat, lng };
    setUserLoc(uLoc);
    if (userMarkerRef.current) mapRef.current.removeLayer(userMarkerRef.current);
    // Sử dụng marker màu đỏ để phân biệt với chi nhánh
    const redIcon = L.icon({
        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
    });
    userMarkerRef.current = L.marker([lat, lng], { icon: redIcon })
        .addTo(mapRef.current)
        .bindPopup(isGPS ? "Vị trí của bạn" : "Vị trí xuất phát")
        .openPopup();
    const result = initialData.map(b => ({
      ...b,
      dist: getDistance(lat, lng, b.lat, b.lng)
    })).sort((a, b) => a.dist - b.dist);
    setSortedBranches(result);
    setNearest(result[0]);
  };
  const handleSearch = (text) => {
    setSearchText(text);
    const filtered = initialData.filter(b =>
      b.name.toLowerCase().includes(text.toLowerCase()) ||
      b.address.toLowerCase().includes(text.toLowerCase())
    );
    setSortedBranches(filtered);
  };
  React.useEffect(() => {
    if (!mapRef.current) {
      mapRef.current = L.map('map-container', { 
          cursor: true // Cho phép đổi kiểu chuột
      }).setView([10.7769, 106.7009], 12);
      const street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(mapRef.current);
      const satellite = L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png');
      L.control.layers({ "Bản đồ đường": street, "Vệ tinh": satellite }).addTo(mapRef.current);
      markersLayerRef.current.addTo(mapRef.current);
      // SỰ KIỆN CLICK BẢN ĐỒ: Chọn vị trí bất kỳ
      mapRef.current.on('click', (e) => {
        handleLocationUpdate(e.latlng.lat, e.latlng.lng, false);
      });
    }
    markersLayerRef.current.clearLayers();
    initialData.forEach(branch => {
      L.marker([branch.lat, branch.lng])
        .addTo(markersLayerRef.current)
        .bindPopup(`<b>${branch.name}</b><br>${branch.address}`);
    });
  }, [initialData]);
  const showBuffer = (branch) => {
    if (bufferRef.current) mapRef.current.removeLayer(bufferRef.current);
    bufferRef.current = L.circle([branch.lat, branch.lng], {
      radius: 3000,
      color: '#7C9885',
      fillOpacity: 0.1
    }).addTo(mapRef.current);
  };
  const showRoute = (branch) => {
    if (!userLoc) { alert("Hãy click vào bản đồ hoặc nhấn 'Tìm chi nhánh gần tôi' để chọn điểm xuất phát"); return; }
    if (routingRef.current) mapRef.current.removeControl(routingRef.current);
    routingRef.current = L.Routing.control({
      waypoints: [L.latLng(userLoc.lat, userLoc.lng), L.latLng(branch.lat, branch.lng)],
      lineOptions: { styles: [{ color: '#7C9885', weight: 5 }] },
      addWaypoints: false,
      createMarker: () => null
    }).addTo(mapRef.current);
  };
  const handleFindMe = () => {
    navigator.geolocation.getCurrentPosition((pos) => {
      const { latitude, longitude } = pos.coords;
      mapRef.current.flyTo([latitude, longitude], 14);
      handleLocationUpdate(latitude, longitude, true);
    });
  };
  return (
    <div className="flex flex-col lg:flex-row gap-6">
      <div className="lg:w-1/3 space-y-4">
        <div className="relative">
          <input
            type="text"
            placeholder="🔎 Tìm chi nhánh..."
            value={searchText}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#7C9885] outline-none transition-all"
          />
        </div>
        <button onClick={handleFindMe} 
                className="w-full bg-[#7C9885] text-white p-3 rounded-xl font-bold hover:bg-[#5F6F65] transition-all transform active:scale-95 shadow-md">
          📍 Sử dụng vị trí hiện tại
        </button>
        {nearest && (
          <div className="p-4 bg-green-50 border border-green-100 rounded-xl animate-fade-in shadow-sm">
            <span className="text-[10px] font-bold text-green-600 uppercase">Gần nhất với điểm chọn</span>
            <p className="font-bold text-[#2C3E37]">{nearest.name}</p>
            <p className="text-sm text-gray-600">Cách khoảng <b>{nearest.dist.toFixed(2)} km</b></p>
          </div>
        )}
        <div className="overflow-y-auto h-[450px] space-y-3 pr-2 custom-scrollbar">
          {sortedBranches.map((b, i) => (
              <div key={b.id || i} 
                  onClick={() => { mapRef.current.flyTo([b.lat, b.lng], 16); showBuffer(b); }}
                  className="p-4 border border-gray-100 rounded-2xl cursor-pointer bg-white hover:border-[#7C9885] hover:shadow-lg transition-all duration-300 group transform hover:-translate-y-1 animate-fade-in"
                  style={{ animationDelay: `${i * 0.05}s` }}>
                <h4 className="font-bold text-[#2C3E37] group-hover:text-[#7C9885]">{b.name}</h4>
                <p className="text-xs text-gray-500 mb-1 leading-tight">{b.address}</p>
                <p className="text-[10px] text-gray-400 font-mono mb-2 bg-gray-50 inline-block px-1 rounded">
                    Tọa độ: {b.lat.toFixed(6)}, {b.lng.toFixed(6)}
                </p>
                <div className="flex justify-between items-center border-t pt-2 border-gray-50">
                  {b.dist && <span className="text-xs font-bold text-[#7C9885]">{b.dist.toFixed(2)} km</span>}
                  <button onClick={(e) => { e.stopPropagation(); showRoute(b); }}
                          className="text-[10px] uppercase tracking-wider font-bold text-gray-400 hover:text-[#7C9885] transition-colors">
                    Chỉ đường →
                  </button>
                </div>
              </div>
          ))}
        </div>
      </div>
      <div id="map-container" className="lg:w-2/3 h-[550px] rounded-3xl border-8 border-white shadow-2xl overflow-hidden cursor-crosshair"></div>
    </div>
  );
}