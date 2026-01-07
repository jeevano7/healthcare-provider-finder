import json
from flask import Flask, render_template, jsonify, request

app = Flask(__name__)

# --- DATA LOADING ---
def load_data():
    with open('data/providers.json', 'r') as f:
        providers = json.load(f)
    with open('data/plans.json', 'r') as f:
        plans = json.load(f)
    return providers, plans

all_providers, all_plans = load_data()

# --- HELPER: Extract Cities ---
def get_cities():
    cities = set()
    for p in all_providers:
        # Robust extraction: splits by comma, takes the last part, removes whitespace
        if ',' in p['address']:
            city_name = p['address'].split(',')[-1].strip()
            cities.add(city_name)
    return sorted(list(cities))

# --- ROUTES ---
@app.route('/')
def index():
    specialties = sorted(list(set(p['specialty'] for p in all_providers)))
    cities = get_cities()
    return render_template('index.html', specialties=specialties, plans=all_plans, cities=cities)

@app.route('/search', methods=['POST'])
def search():
    data = request.get_json()
    selected_specialty = data.get('specialty')
    selected_plan_id = data.get('plan_id')
    selected_city = data.get('city')

    # Start with full list
    filtered_list = all_providers

    # 1. Filter by Specialty
    if selected_specialty:
        filtered_list = [p for p in filtered_list if p['specialty'] == selected_specialty]

    # 2. Filter by City
    if selected_city:
        filtered_list = [p for p in filtered_list if selected_city in p['address']]

    # 3. Calculate Network Status
    results = []
    for provider in filtered_list:
        provider_data = provider.copy()
        
        # LOGIC FIX: If NO plan is selected, status is 'unknown' (Neutral)
        if not selected_plan_id or selected_plan_id == "":
            provider_data['network_status'] = 'unknown'
        # If plan IS selected, check if it matches
        elif int(selected_plan_id) in provider['accepted_plan_ids']:
            provider_data['network_status'] = 'in-network'
        else:
            provider_data['network_status'] = 'out-of-network'
            
        results.append(provider_data)

    return jsonify(results)

if __name__ == '__main__':
    app.run(debug=True)