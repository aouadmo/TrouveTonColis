Project Overview
TrouveTonColis is a full‑stack application for managing parcel deliveries. The repository contains a Node.js/Express backend and a React Native (Expo) frontend. Its goal is to help clients track parcels and assist relay professionals with day‑to‑day operations.

Backend
Stack: Express with MongoDB via Mongoose.
Package configuration in backend/package.json includes dependencies such as express, mongoose, bcrypt, cors, express-fileupload, and @huggingface/inference for OCR/AI tasks.

Key Models:

clients: stores client credentials and contact details

colis: represents a parcel, including status fields and appointment data

pros: information about relay points (name, address, phone, schedules)

Routes:

/users: signup/signin endpoints for clients, profile updates, and statistics generation

/pros: endpoints for professional relay registration, authentication, SMS templates, schedules, and absence periods

/colis: search by tracking number or name, OCR analysis of parcel labels via Hugging Face API, parcel updates, statistics, and appointment booking

Utilities: helper modules such as checkBody for request validation and groupByPeriod for statistics aggregation.

Frontend
Stack: Expo React Native with Redux Toolkit. Dependencies include @react-navigation libraries, react-native-maps, expo-camera, and more (see frontend/package.json).

State Management: Redux slices handle authentication, user profiles, parcel data, appointments, and relay schedules. For example, the user slice keeps the token and user type (client or pro).

Navigation: Separate stacks and tab navigators for clients and professionals route to screens such as parcel search, profile management, relay stock, or dashboard features.

Key Screens:

SearchScreen with the ColisSearchForm component to locate parcels by tracking number or by name/prénom.

MapScreen displays relay locations and can compute routes using OpenRouteService.

MonStockScreen (pro interface) manages parcels in stock with filtering and statistics.

ClientProfileScreen allows clients to edit personal info and view parcel stats, including quick actions to contact support or notify a relay of imminent arrival.

TableauBordScreen provides professionals a dashboard with appointment summaries and quick actions such as scanning parcels and editing opening hours.

Features
Parcel Management: Search parcels, update statuses, schedule pickup appointments, and compute statistics over time.

OCR & AI Integration: Upload parcel label images to extract tracking numbers and recipient information with the OCR.Space API and the Hugging Face Mixtral model.

Professional Tools: Relay managers can customize SMS templates, manage their opening hours, declare absences, and handle urgent notifications.

Client Tools: Clients can create accounts, update contact details, view personal parcel statistics, and get directions to relay points.

Maps & Geolocation: Integration with OpenRouteService to show routes from the user's location to the selected relay point.

Authentication: Token-based login for both clients and professionals. Many API routes require a valid token in the Authorization header.

This codebase offers a concrete example of building a delivery‑tracking mobile app with a robust backend and a modern mobile interface.
