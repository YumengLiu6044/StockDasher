# 📈 Stock Dasher

**Stock Dasher** is a full-stack stock dashboard that allows users to explore trending stocks, search symbols, and visualize price movements with interactive candle charts. Built with a **FastAPI** backend and modern web technologies, it brings together data from multiple financial APIs in a clean, responsive interface.


## 🔧 Features

- **🔥 Trending Stocks**  
  Pulls real-time trending stocks from **Alpha Vantage**.

- **🔍 Symbol Search**  
  Fast and intelligent symbol search powered by **Finnhub**.

- **📊 Candle Chart Visualization**  
  Renders stock candle charts using historical data from **Alpaca**.


## 🧱 Tech Stack

### 🖥 Frontend
- React
- TradingView for Charting
- Tailwind CSS for reflexive design

### 🐍 Backend
- **FastAPI** – Python-based backend server
- Uses cron job to keep from idling
- Uses controlled-sleep and caching to balance API requests
- All API keys and sensitive logic handled securely on the server

### 📦 External APIs
- [Alpha Vantage](https://www.alphavantage.co/)
- [Finnhub](https://finnhub.io/)
- [Alpaca](https://alpaca.markets/)


## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/YumengLiu6044/StockDasher.git
cd StockDasher
```

### 2. Run the backend

Setup environment variables in the .env file in the backend folder:
```env
FINNHUB_API_KEY=[]
ALPHA_V_API_KEY=[]
ALPACA_KEY_ID=[]
ALPACA_SECRET=[]
```

Run the script:
```bash
cd backend
pip install -r requirements.txt
python main.py
```

### 3. Run the frontend

Setup environment variables in the .env file in the frontend root folder
```env
VITE_LOGO_KEY=[]
```

Run the frontend in localhost:
```bash
cd frontend
npm install
npm run dev
```

## 📸 Screenshots

<img width="500" alt="image" src="https://github.com/user-attachments/assets/b02614a5-6a6c-4e1b-97b9-8f9f513a8033" />


