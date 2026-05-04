function BranchFinder() {
    const initialData = window.allBranches || [];
    const [userLoc, setUserLoc] = React.useState(null);
    const [sortedBranches, setSortedBranches] = React.useState(initialData);
    const [searchText, setSearchText] = React.useState("");
    const [radius, setRadius] = React.useState(20); 
    const [nearest, setNearest] = React.useState(null);
    const [isPickingLocation, setIsPickingLocation] = React.useState(false); // Chế độ chọn điểm trên bản đồ
    const mapRef = React.useRef(null);
    const routingRef = React.useRef(null);
    const markersLayerRef = React.useRef(L.layerGroup());
    const userMarkerRef = React.useRef(null);
    const getDistance = (lat1, lon1, lat2, lon2) => {
        const R = 6371;
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                  Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                  Math.sin(dLon / 2) * Math.sin(dLon / 2);
        return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    };
    const filterData = (text, currentRadius, location, isScanning = false) => {
        let filtered = initialData.map(b => {
            const d = location ? getDistance(location.lat, location.lng, b.lat, b.lng) : null;
            return { ...b, dist: d };
        });
        filtered = filtered.filter(b => {
            const matchesSearch = b.name.toLowerCase().includes(text.toLowerCase()) || 
                                 b.address.toLowerCase().includes(text.toLowerCase());
            const matchesRadius = (isScanning && location) ? (b.dist <= currentRadius) : true;
            return matchesSearch && matchesRadius;
        });
        if (location) {
            filtered.sort((a, b) => (a.dist || 0) - (b.dist || 0));
        }
        setSortedBranches(filtered);
        if (location && filtered.length > 0) setNearest(filtered[0]);
        else setNearest(null);
    };
    // Hàm cập nhật vị trí người dùng (dùng chung cho GPS và Click bản đồ)
    const updateLocation = (lat, lng, label = "Vị trí xuất phát") => {
        const uLoc = { lat, lng };
        setUserLoc(uLoc);
        if (userMarkerRef.current) mapRef.current.removeLayer(userMarkerRef.current);
        userMarkerRef.current = L.marker([lat, lng], {
            icon: L.divIcon({ html: '🎯', className: 'text-2xl', iconSize: [24, 24] })
        }).addTo(mapRef.current).bindPopup(label).openPopup();
        filterData(searchText, radius, uLoc, false);
        if (!isPickingLocation) mapRef.current.flyTo([lat, lng], 14);
    };
    React.useEffect(() => {
        if (!mapRef.current) {
            mapRef.current = L.map('map-container').setView([10.7769, 106.7009], 12);
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(mapRef.current);
            markersLayerRef.current.addTo(mapRef.current);
            // Lắng nghe sự kiện click bản đồ để chọn vị trí
            mapRef.current.on('click', (e) => {
                // Kiểm tra state thông qua biến cục bộ hoặc cách tiếp cận closure
                if (document.getElementById('pick-btn')?.dataset.active === 'true') {
                    updateLocation(e.latlng.lat, e.latlng.lng, "Vị trí đã chọn");
                    setIsPickingLocation(false);
                }
            });
            const urlParams = new URLSearchParams(window.location.search);
            const targetId = urlParams.get('branch_id');
            if (targetId) {
                const target = initialData.find(b => b.id == targetId);
                if (target) {
                    setTimeout(() => {
                        mapRef.current.flyTo([target.lat, target.lng], 16);
                        L.popup().setLatLng([target.lat, target.lng])
                            .setContent(`<b>${target.name}</b><br>Bạn đang xem chi nhánh này`)
                            .openOn(mapRef.current);
                    }, 500);
                }
            }
        }
        markersLayerRef.current.clearLayers();
        sortedBranches.forEach(branch => {
            L.marker([branch.lat, branch.lng])
                .addTo(markersLayerRef.current)
                .bindPopup(`<b>${branch.name}</b><br>${branch.address}`);
        });
    }, [sortedBranches]);
    const handleFindMe = () => {
        setIsPickingLocation(false);
        navigator.geolocation.getCurrentPosition((pos) => {
            updateLocation(pos.coords.latitude, pos.coords.longitude, "Vị trí của bạn");
        }, () => alert("Không thể truy cập GPS"));
    };
    const showRoute = (branch) => {
        if (!userLoc) { alert("Vui lòng xác định vị trí xuất phát trước"); return; }
        if (routingRef.current) mapRef.current.removeControl(routingRef.current);
        routingRef.current = L.Routing.control({
            waypoints: [L.latLng(userLoc.lat, userLoc.lng), L.latLng(branch.lat, branch.lng)],
            lineOptions: { styles: [{ color: '#7C9885', weight: 5 }] },
            addWaypoints: false,
            createMarker: () => null
        }).addTo(mapRef.current);
    };
    return (
        <div className="flex flex-col lg:flex-row gap-6">
            <div className="lg:w-1/3 space-y-4">
                <input
                    type="text"
                    placeholder="🔎 Tìm chi nhánh..."
                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#7C9885] outline-none"
                    onChange={(e) => {
                        setSearchText(e.target.value);
                        filterData(e.target.value, radius, userLoc, false);
                    }}
                />
                <div className="flex gap-2">
                    <button onClick={handleFindMe} className="flex-1 bg-[#7C9885] text-white p-3 rounded-xl font-bold hover:bg-[#5F6F65] transition-all text-sm">
                        📍 Vị trí GPS
                    </button>
                    <button 
                        id="pick-btn"
                        data-active={isPickingLocation}
                        onClick={() => setIsPickingLocation(!isPickingLocation)} 
                        className={`flex-1 p-3 rounded-xl font-bold transition-all text-sm border-2 ${isPickingLocation ? 'bg-orange-100 border-orange-500 text-orange-600 animate-pulse' : 'bg-white border-[#7C9885] text-[#7C9885]'}`}
                    >
                        🎯 {isPickingLocation ? 'Click bản đồ...' : 'Chọn vị trí'}
                    </button>
                </div>
                <div className="p-4 bg-white border border-gray-100 rounded-xl shadow-sm">
                    <div className="flex justify-between mb-2">
                        <span className="text-sm font-bold">Bán kính quét: {radius} km</span>
                    </div>
                    <input type="range" min="1" max="100" value={radius} 
                           onChange={(e) => setRadius(parseInt(e.target.value))}
                           className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#7C9885]" />
                    <button onClick={() => filterData(searchText, radius, userLoc, true)}
                            className="w-full mt-3 bg-[#2C3E37] text-white py-2 rounded-lg text-xs font-bold hover:bg-black transition-all">
                        🔍 QUÉT CHI NHÁNH TRONG VÙNG
                    </button>
                </div>
                <div className="overflow-y-auto h-[350px] space-y-3 pr-2 custom-scrollbar">
                    {sortedBranches.length > 0 ? sortedBranches.map((b, i) => (
                        <div key={b.id || i} onClick={() => mapRef.current.flyTo([b.lat, b.lng], 16)}
                             className="p-4 border border-gray-100 rounded-xl hover:shadow-md transition-all cursor-pointer bg-white group">
                            <h4 className="font-bold text-[#2C3E37] group-hover:text-[#7C9885]">{b.name}</h4>
                            <p className="text-xs text-gray-500">{b.address}</p>
                            <div className="flex justify-between items-center mt-2">
                                {b.dist && <span className="text-xs font-bold text-[#7C9885]">{b.dist.toFixed(2)} km</span>}
                                <button onClick={(e) => { e.stopPropagation(); showRoute(b); }}
                                        className="text-xs bg-gray-50 px-3 py-1 rounded-lg hover:bg-[#7C9885] hover:text-white transition-colors">
                                    Chỉ đường
                                </button>
                            </div>
                        </div>
                    )) : (
                        <div className="text-center py-10 text-gray-400 text-sm">Không có chi nhánh phù hợp</div>
                    )}
                </div>
            </div>
            <div id="map-container" className="lg:w-2/3 h-[550px] rounded-3xl border-4 border-white shadow-xl overflow-hidden z-0"></div>
        </div>
    );
}