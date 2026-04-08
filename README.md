# 🌾 Kisan Sewak: Empowering Farmers with AI

<div align="center">
  <!-- Add your logo link below -->
  <img src="/Users/bot/KISAN-SEWAK/app/frontend-nginx/frontend/src/assets/images/Kisan-Sewak.png" width="150" alt="Kisan Sewak Logo" />
  <p><em>An automated plant disease detection ecosystem.</em></p>
</div>

---

## 📖 Overview
**Kisan Sewak** is a comprehensive, microservice-based application designed to support farmers in identifying plant diseases and accessing expert advice. By leveraging Deep Learning and Real-time Communication, the platform provides an all-in-one toolkit for modern agriculture management.

---

## 🚀 Key Features

- **AI-Powered Disease Detection**  
  Uses a high-performance **ResNet9** model to identify plant diseases from uploaded images.

- **Comprehensive Dashboard**  
  Visualizes agricultural data using **ApexCharts**, including disease trends and statistics.

- **Multilingual Support**  
  Supports multiple languages using **i18next** and Google Translate.

---

## 🏗️ System Architecture

The project follows a modern **Microservices Architecture**, ensuring scalability and modularity.

- **Frontend**: React, Ionic, Capacitor  
- **Authentication Service**: Node.js, MongoDB, Redis  
- **Deep Learning Service**: Flask-based API (ResNet9 model)  
- **Data Pipeline**: Web scraping for plant disease data  

---

## 🛠️ Technology Stack

| Component | Technologies Used |
| :--- | :--- |
| **Frontend** | React, Tailwind CSS, Redux Toolkit, Ionic/Capacitor |
| **Backend** | Node.js, Express, Flask |
| **Databases** | MongoDB, Redis |
| **Machine Learning** | PyTorch (ResNet9), Python |
| **DevOps** | Nginx, Docker, Docker-compose |

---

## 📂 Project Structure

```text
KISAN-SEWAK/
├── app/
│   ├── auth/               # Node.js Authentication Service
│   ├── dl/                 # Flask Deep Learning Service
│   ├── frontend-nginx/     # React Frontend & Nginx Gateway
└── Web-scraping/           # Data Scraping Scripts
```
## ⚙️ Getting Started

### Prerequisites
* **Docker & Docker Compose**: Required for containerized deployment.
* **Node.js (v14+)**: Required for local development of the Auth and Frontend services.
* **Python (v3.8+)**: Required for the Deep Learning and PDF generation modules.

## Run with Docker

```bash
cd app
docker-compose up --build
```

**<p align="center">Made with ❤️ for the farming community.</p>**