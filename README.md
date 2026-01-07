# Healthcare Provider Finder (Smart Network Analyzer)

A full-stack web application designed to solve the complexity of finding in-network healthcare providers. This tool bridges the gap between **geolocation data** and **insurance coverage data** to prevent financial risks for patients.

##  The Problem
Finding a doctor is easy, but finding a doctor **covered by your specific insurance plan** is difficult.
- Patients struggle with out-dated lists and data silos.
- Visiting an "out-of-network" doctor can result in massive surprise medical bills.
- Existing tools often lack real-time filtering for both location and coverage.

##  The Solution
This application acts as a central decision-support system that:
1.  **Locates** doctors near the user (using Leaflet.js maps).
2.  **Filters** by medical specialty.
3.  **Verifies** insurance coverage in real-time.
4.  **Visually Warns** the user (Red vs. Green pins) to prevent out-of-network costs.

##  Key Features
- **Interactive Map:** Auto-zooms to selected cities (Mumbai, Delhi, Bengaluru, etc.).
- **Live Filtering:** Results update instantly as you select City, Specialty, or Plan.
- **Smart Network Detection:**
  -  **Blue Pins:** Neutral state (browse all doctors).
  -  **Green Pins:** Verified In-Network (Safe).
  -  **Red Pins:** Out-of-Network warning (Financial Risk).
- **Crash-Proof Backend:** Robust Python logic handles data inconsistencies gracefully.

##  Tech Stack
- **Backend:** Python (Flask) - Handles data processing and business logic.
- **Frontend:** HTML5, CSS3, JavaScript - Handles UI and dynamic updates.
- **Mapping:** Leaflet.js & OpenStreetMap - Provides interactive geospatial data.
- **Data:** JSON - Simulates a relational database of Providers and Insurance Plans.

##  Project Structure

  healthcare-provider-finder/
  
 |-- app.py # Main Flask Application
 
 |-- data/
 | |-- providers.json # Database of Doctors & Locations
 | |-- plans.json # Database of Insurance Plans
 |-- static/
 | |-- css/style.css # Styling
 | |-- js/script.js # Frontend Logic & Map Control
 |-- templates/
 |-- index.html # Main User Interface


## How to Run Locally

 **Clone the repository**

   $ bash

   git clone https://github.com/jeevano7/healthcare-provider-finder.git

   cd healthcare-finder

   pip install flask

   python app.py

   Open your browser and go to: http://127.0.0.1:5000
