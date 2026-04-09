# 🌾 Kisan Sewak: Empowering Farmers with AI

Kisan Sewak is a high-performance, microservice-based ecosystem designed to revolutionize agricultural management. By merging **Computer Vision** with **Large Language Models (LLM)**, it provides farmers with instant, localized, and actionable insights into plant health.

---

## 🚀 Key Features

### 🧠 Hybrid AI Diagnostic Engine

- **Precision Detection**  
  Uses a custom-trained **ResNet9 Deep Learning model** to identify **38+ classes of plant diseases** from leaf images.

- **LLM Enhancement**  
  Integration with **Groq (Llama 3.3 70B)** API to transform raw model predictions into detailed agricultural advice.

- **Treatment Plans**  
  Automatically generates **step-by-step Organic and Chemical control measures** for each detected disease.

---

### 🌍 Multilingual & Localized Experience

- **Dynamic Translation**  
  Full support for **English and Hindi**, helping farmers understand advice in their native language.

- **Geo-Awareness**  
  Captures **IP-based location data** (State, City, District) to track disease outbreaks across regions like Rajasthan.

---

### 📊 Farmer Utilities

- **Smart Dashboard**  
  Real-time visualization of disease trends using **ApexCharts**.

- **PDF Reports**  
  One-click generation of professional reports using **html2pdf.js**.

- **Mobile Ready**  
  Built with **React, Ionic, and Capacitor**, making it accessible on both web and mobile devices.

---

## 🏗️ Microservices Architecture

The system is divided into independent services for better scalability and reliability:

- **Frontend-Nginx**  
  React-based SPA served via Nginx (main UI).

- **Auth Service**  
  Node.js/Express service for authentication, Redis sessions, and MongoDB storage.

- **Deep Learning (DL) Service**  
  Flask API handling image processing, ResNet9 inference, and LLM enhancement.

- **Web Scraping**  
  Automated scripts to keep disease data updated using external sources.

---

## 🛠️ Technology Stack

| Component | Technologies Used |
|----------|------------------|
| Frontend | React.js, Tailwind CSS, Redux Toolkit, i18next, html2pdf.js |
| AI/ML | PyTorch (ResNet9), Groq Cloud API (Llama 3.3 70B) |
| Backend | Node.js (Auth), Flask (DL Service), Python 3.8+ |
| Data | MongoDB, Redis |
| DevOps | Docker, Docker Compose, Nginx |

---

## 📂 Project Structure
```
KISAN-SEWAK/
├── app/
│ ├── auth/ # Node.js Auth: User management & Dashboard logic
│ ├── dl/ # Flask DL: ResNet9 Inference & LLM Enhancer
│ │ └── app/ResNet/ # Pre-trained .pth model files
│ ├── frontend-nginx/ # React: UI, i18n, and PDF generation
│ └── docker-compose.yml # Orchestration for all services
└── Web-scraping/ # BeautifulSoup scripts for disease data
```

---

## ⚙️ Getting Started

### Prerequisites
* **Docker & Docker Compose**: Required for containerized deployment.
* **Node.js (v14+)**: Required for local development of the Auth and Frontend services.
* **Python (v3.8+)**: Required for the Deep Learning and PDF generation modules.

---

## Run with Docker

```bash
cd app
docker-compose up --build
```

---

**<p align="center">Made with ❤️ for the farming community.</p>**
---