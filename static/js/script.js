document.addEventListener('DOMContentLoaded', () => {

    const citySelect = document.getElementById('city-select');
    const specialtySelect = document.getElementById('specialty-select');
    const planSelect = document.getElementById('plan-select');
    const resultsList = document.getElementById('results-list');
    
    // Start map centered on India
    const map = L.map('map').setView([20.5937, 78.9629], 5);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);
    
    let markersGroup = L.featureGroup().addTo(map);

    async function performSearch() {
        const response = await fetch('/search', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                city: citySelect.value,
                specialty: specialtySelect.value,
                plan_id: planSelect.value,
            }),
        });

        const filteredProviders = await response.json();
        displayResults(filteredProviders);
    }

    function displayResults(providers) {
        resultsList.innerHTML = '';
        markersGroup.clearLayers();

        if (providers.length === 0) {
            resultsList.innerHTML = '<p>No providers found matching your criteria.</p>';
            return;
        }

        // Sort: In-Network first, then Unknown, then Out-of-Network
        providers.sort((a, b) => {
            const order = { 'in-network': 1, 'unknown': 2, 'out-of-network': 3 };
            return order[a.network_status] - order[b.network_status];
        });

        providers.forEach(provider => {
            const providerCard = document.createElement('div');
            providerCard.className = 'provider-card';
            
            let badgeHTML = '';
            let markerColor = 'blue'; // Default Blue for Unknown/Neutral

            if (provider.network_status === 'in-network') {
                badgeHTML = `<span class="in-network-badge">In-Network</span>`;
                markerColor = 'green';
            } else if (provider.network_status === 'out-of-network') {
                badgeHTML = `<span class="out-of-network-badge">Out-of-Network</span><p class="out-of-network-warning">Warning: Higher costs.</p>`;
                markerColor = 'red';
            } else {
                // Unknown/No Plan Selected
                badgeHTML = `<span style="background:#6c757d; color:white; padding:3px 8px; border-radius:12px; font-size:12px;">Select Plan to Check</span>`;
            }

            providerCard.innerHTML = `
                <h3>${provider.name}</h3>
                <p>${provider.specialty}</p>
                <p>${provider.address}</p>
                ${badgeHTML}
            `;
            resultsList.appendChild(providerCard);

            const icon = L.icon({
                iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${markerColor}.png`,
                shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
                iconSize: [25, 41],
                iconAnchor: [12, 41],
                popupAnchor: [1, -34],
                shadowSize: [41, 41]
            });

            const marker = L.marker([provider.lat, provider.lng], { icon: icon });
            marker.bindPopup(`<b>${provider.name}</b><br>${provider.specialty}`);
            markersGroup.addLayer(marker);
        });

        if (markersGroup.getLayers().length > 0) {
            map.fitBounds(markersGroup.getBounds(), { padding: [50, 50] });
        }
    }

    citySelect.addEventListener('change', performSearch);
    specialtySelect.addEventListener('change', performSearch);
    planSelect.addEventListener('change', performSearch);
    
    performSearch();
});