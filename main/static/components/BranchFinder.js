function BranchFinder() {
    const [userLoc, setUserLoc] = React.useState(null);
    const [sortedBranches, setSortedBranches] = React.useState(window.branchData);
    const mapRef = React.useRef(null);
    const routingRef = React.useRef(null); // (1) Thêm Ref để quản lý đường đi

    const getDistance = (lat1, lon1, lat2, lon2) => {
        const R = 6371; 
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                  Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon/2) * Math.sin(dLon/2);
        return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    };

    React.useEffect(() => {
        if (!mapRef.current) {
            mapRef.current = L.map('map-container').setView([10.7769, 106.7009], 12);
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(mapRef.current);
            
            window.branchData.forEach(branch => {
                L.marker([branch.lat, branch.lng])
                 .addTo(mapRef.current)
                 .bindPopup(`<b>${branch.name}</b><br>${branch.address}`);
            });
        }
    }, []);

    // (2) Hàm vẽ đường đi từ vị trí người dùng tới chi nhánh
    const showRoute = (branch) => {
        if (!userLoc) {
            alert("Vui lòng nhấn 'Tìm chi nhánh gần tôi nhất' trước để xác định vị trí của bạn!");
            return;
        }

        // Xóa đường cũ nếu đã tồn tại
        if (routingRef.current) {
            mapRef.current.removeControl(routingRef.current);
        }

        // Vẽ đường mới
        routingRef.current = L.Routing.control({
            waypoints: [
                L.latLng(userLoc.lat, userLoc.lng),
                L.latLng(branch.lat, branch.lng)
            ],
            lineOptions: { styles: [{ color: '#1e40af', weight: 7, opacity: 0.8 }] },
            addWaypoints: false,
            createMarker: () => null // Không tạo thêm marker trùng lặp
        }).addTo(mapRef.current);
    };

    const handleFindMe = () => {
        navigator.geolocation.getCurrentPosition((pos) => {
            const { latitude, longitude } = pos.coords;
            setUserLoc({ lat: latitude, lng: longitude });

            mapRef.current.setView([latitude, longitude], 14);
            L.circle([latitude, longitude], { radius: 500, color: '#7C9885' })
             .addTo(mapRef.current).bindPopup("Vị trí của bạn").openPopup();

            const result = window.branchData.map(b => ({
                ...b,
                dist: getDistance(latitude, longitude, b.lat, b.lng)
            })).sort((a, b) => a.dist - b.dist);
            
            setSortedBranches(result);
        });
    };

    const handleBranchClick = (branch) => {
        if (mapRef.current) {
            mapRef.current.flyTo([branch.lat, branch.lng], 16, { animate: true, duration: 1.5 });
            
            L.popup()
                .setLatLng([branch.lat, branch.lng])
                .setContent(`<b>${branch.name}</b><br>${branch.address}`)
                .openOn(mapRef.current);
            
            // Tự động vẽ đường khi click vào chi nhánh (nếu đã có vị trí người dùng)
            if (userLoc) showRoute(branch);
        }
    };

    return (
        <div className="flex flex-col lg:flex-row gap-6">
            <div className="lg:w-1/3 space-y-4">
                <button onClick={handleFindMe} className="w-full btn-primary flex items-center justify-center gap-2">
                    📍 Tìm chi nhánh gần tôi nhất
                </button>
                <div className="overflow-y-auto h-[400px] pr-2 space-y-3">
                    {sortedBranches.map(b => (
                        <div 
                            key={b.id} 
                            onClick={() => handleBranchClick(b)} // (3) Thêm sự kiện click vào div
                            className="p-4 bg-gray-50 rounded-xl border border-gray-200 hover:border-[var(--primary-color)] hover:shadow-md cursor-pointer transition-all"
                        >
                            <h4 className="font-bold text-[var(--text-dark)]">{b.name}</h4>
                            <p className="text-xs text-gray-500 italic">{b.address}</p>
                            <div className="flex justify-between items-center mt-2">
                                {b.dist && <p className="text-sm text-[var(--primary-color)] font-bold">Cách đây: {b.dist.toFixed(2)} km</p>}
                                <button 
                                    onClick={(e) => { e.stopPropagation(); showRoute(b); }}
                                    className="text-[10px] bg-white border border-[var(--primary-color)] text-[var(--primary-color)] px-2 py-1 rounded hover:bg-[var(--primary-color)] hover:text-white transition-colors"
                                >
                                    Chỉ đường
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div id="map-container" className="lg:w-2/3 h-[450px] rounded-2xl border-4 border-white shadow-inner relative z-0"></div>
        </div>
    );
}