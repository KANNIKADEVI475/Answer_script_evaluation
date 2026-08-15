# AI-Powered Answer Script Evaluation System

An automated, intelligent web application designed to evaluate handwritten university answer sheets. The system converts uploaded PDF scripts, performs handwriting OCR, cleans and segments answers, and evaluates them semantically using LLMs.

---

## 🌟 Key Features

* **Advanced PDF & Image Pipeline**: Converts PDF answer sheets to high-resolution images, applies contrast enhancements (CLAHE), and extracts text using Google Cloud Vision OCR.
* **Semantic LLM Evaluation**: Uses the Groq Cloud API (`llama-3.1-8b-instant`) to split a teacher's model answer into core concepts and grade student answers based on concept presence and semantic similarity.
* **Memory-Optimized Processing**: Page-by-page pipeline execution with aggressive garbage collection, allowing full script evaluations to run smoothly on servers with as little as 512 MB RAM (such as Render's free tier).
* **Dual Roles (Faculty & Student)**:
  * **Faculty Dashboard**: Allows uploading scripts, viewing real-time evaluation progress via WebSockets, exploring grade history, and downloading consolidated reports.
  * **Student Portal**: Provides students access to search and view their individual evaluation sheets and marks.
* **Excel Grade Export**: Instantly compiles student scores across various sections (Part A, B, C, D) and downloads them in structured `.xlsx` formats.

---

## 📂 Project Architecture

```text
├── Answer_script_evaluation-nive/
│   ├── backend/                # FastAPI (Python 3.10+) Backend
│   │   ├── core/               # PDF processing, OCR, & LLM evaluation engine
│   │   ├── database/           # SQLite / PostgreSQL configuration
│   │   ├── models/             # SQLAlchemy schemas
│   │   ├── routers/            # Endpoint routes (auth, evaluation, history, etc.)
│   │   ├── services/           # Business logic & background processing
│   │   └── requirements.txt    # Python dependencies
│   │
│   ├── frontend/               # React + Vite Frontend
│   │   ├── src/                # Components, Pages, App router, & Services
│   │   ├── package.json        # Node.js dependencies
│   │   └── vite.config.js      # Vite build configuration
```

---

## ⚙️ Configuration & Environment Variables

### Backend Environment Variables (`backend/.env`)

| Variable Name | Type | Description |
| :--- | :--- | :--- |
| `GOOGLE_API_KEY` | String | Google Cloud API key authorized for the **Cloud Vision API** (OCR). |
| `GROQ_API_KEY` | String | Groq Cloud API key authorized for LLM reasoning. |
| `DATABASE_URL` | String | *(Optional)* Connection URL for database persistence (e.g. SQLite persistent path or PostgreSQL URL). Defaults to local SQLite `evaluation.db`. |
| `ALLOWED_ORIGINS` | String | *(Optional)* Comma-separated list of allowed frontend domains. Defaults to localhost and the production Vercel app. |

### Frontend Environment Variables (`frontend/.env`)

| Variable Name | Type | Description |
| :--- | :--- | :--- |
| `VITE_API_URL` | String | URL of the running FastAPI backend (e.g., `https://your-app.onrender.com`). Defaults to `http://127.0.0.1:8000`. |

---

## 🚀 Local Development Setup

### 1. Run the Backend
1. Navigate to the backend directory:
   ```bash
   cd Answer_script_evaluation-nive/backend
   ```
2. Create and activate a Python virtual environment:
   ```bash
   python -m venv venv
   # Windows:
   .\venv\Scripts\activate
   # macOS/Linux:
   source venv/bin/activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Create a `.env` file in the `backend/` folder and add your `GOOGLE_API_KEY` and `GROQ_API_KEY`.
5. Start the FastAPI development server:
   ```bash
   uvicorn app:app --host 127.0.0.1 --port 8000 --reload
   ```

### 2. Run the Frontend
1. Navigate to the frontend directory:
   ```bash
   cd Answer_script_evaluation-nive/frontend
   ```
2. Install npm dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   *The frontend will run locally at `http://localhost:5173`.*

---

## 🌐 Production Cloud Deployment

### 1. Backend (Render / Railway)
* **Language Runtime**: Python 3.10+
* **Root Directory**: `Answer_script_evaluation-nive/backend`
* **Build Command**: `pip install -r requirements.txt`
* **Start Command**: `uvicorn app:app --host 0.0.0.0 --port $PORT`
* **Environment Variables**: Add your `GOOGLE_API_KEY` and `GROQ_API_KEY` in the service settings.
* **SQLite Persistence (Crucial for Render/Railway)**:
  * Attach a **Persistent Volume** mounted at `/var/data`.
  * Add the environment variable: `DATABASE_URL=sqlite:////var/data/evaluation.db` (note the 4 slashes).

### 2. Frontend (Vercel / Netlify)
* **Framework Preset**: Vite / React
* **Root Directory**: `Answer_script_evaluation-nive/frontend`
* **Build Command**: `npm run build`
* **Output Directory**: `dist`
* **Environment Variables**: Add `VITE_API_URL` pointing to your deployed Render backend (e.g. `https://your-service.onrender.com`).
