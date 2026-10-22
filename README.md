# SabiSyllabusAI

> Autonomous Academic Roadmap Synthesis powered by Core Intelligence Engine.

SabiSyllabusAI is an AI-powered academic planning platform created by **[GentleCoder](https://github.com/the-gentlecoder)**. It transforms course outlines, university syllabi, textbook outlines, and other academic materials into structured, chronological study roadmaps.

Designed with a mobile-first approach, SabiSyllabusAI helps students break down complex courses into manageable topics, organize study schedules, prioritize learning objectives, track academic progress, and prepare effectively for examinations.

By combining artificial intelligence with intelligent academic planning, SabiSyllabusAI aims to make learning more organized, strategic, and accessible to students worldwide.

## 🚀 Key Features

- **Multiformat Content Ingestion:** Accepts pasted text and supported PDF, DOCX, TXT, PNG, and JPG files.
- **Intelligent Content Processing:** Uses AI to interpret academic materials and filter irrelevant administrative information and formatting clutter.
- **Automated Study Roadmaps:** Organizes course topics into a chronological, 12-week study plan.
- **Structured Weekly Planning:** Generates 3–4 topic bullets, a practical milestone, and a target focus for each week.
- **Responsive User Interface:** Provides a mobile-first experience designed for different screen sizes.
- **Interactive User Experience:** Supports drag-and-drop interactions and an animated loading indicator during processing.
- **AI-Powered Generation:** Uses the Google Gen AI SDK to generate structured Markdown learning roadmaps.
- **Server-Side Processing:** Keeps AI credentials on the backend instead of exposing them in browser code.

## 🛠️ Technology Stack

### Frontend
- Semantic HTML5
- Tailwind CSS
- Vanilla JavaScript

### Backend
- Node.js
- Express.js
- Multer for multipart file uploads

### Artificial Intelligence
- Google Gen AI SDK
- Configured Gemini model
- System prompt for structured academic roadmap generation

### Supporting Tools
- npm for dependency management
- Environment variables for configuration
- `.gitignore` for excluding sensitive and generated files

## 🏗️ How It Works

1. **Input:** The user pastes a course outline or uploads a supported file.
2. **Validation:** The Express API validates the input, file type, size, and request limits.
3. **Content Processing:** Text is extracted from supported document formats, while supported PDF and image files are sent to the configured AI service as inline data.
4. **AI Generation:** The backend sends the academic content and system instructions to the configured Gemini model.
5. **Validation:** The application checks the generated roadmap structure and retries one malformed model response.
6. **Output:** The API returns the resulting Markdown roadmap to the frontend.

## 📋 Requirements

- Node.js 18 or newer, subject to dependency requirements.
- npm.
- A valid Google Gemini API key.
- An internet connection for AI requests.

## ⚙️ Local Setup

### 1. Clone the Repository

```bash
git clone https://github.com/the-gentlecoder/SabiSyllabusAI.git
cd SabiSyllabusAI
```

### 2. Install Dependencies

```
npm install
```

### 3. Configure Environment Variables

Copy `.env.example` to `.env` and configure your Gemini API key.

```
GEMINI_API_KEY=your_private_api_key
PORT=5000
```

Configure any additional environment variables required by your application.

Important: Never commit your `.env` file or expose your API key in frontend code.

### 4. Build the Production Stylesheet

```
npm run build:css
```

### 5. Start the Application

```
npm start
```

### 6. Open the Website

Visit:

[http://localhost:5000](http://localhost:5000)

The Express server serves the frontend and API from the same origin.

## 🔌 API Documentation

### `POST /api/optimize`

Accepts multipart form data containing exactly one of the following inputs:

| Field          | Description                                  |
| -------------- | -------------------------------------------- |
| `rawText`      | UTF-8 text containing a course outline       |
| `syllabusFile` | A supported PDF, DOCX, PNG, JPG, or TXT file |

### Successful Response

```
{
  "markdownRoadmap": "# Week 1\n..."
}
```

The returned Markdown contains the generated academic roadmap.

### Error Handling

The API returns JSON containing an `error` message for invalid input, unsupported content, oversized uploads, rate limits, or AI service errors.

Empty or non-academic input returns HTTP `422`.

### `GET /api/health`

Provides a basic health check to verify that the API server is responding.

## 📅 Roadmap Structure

The backend prompt in `prompts/roadmap-system.txt` instructs the configured AI model to generate a structured 12-week study roadmap.

Each valid roadmap contains:

- Exactly 12 sequential weekly headings.
- Three to four topic bullets per week.
- One practical milestone per week.
- One target focus per week.

The API validates the required structure and retries one malformed model response at temperature `0` before returning an error.

The generated roadmap is intended to support study planning. It does not guarantee examination performance or replace official course requirements.

## 🔒 Security and Privacy

### API Key Protection

- Store private credentials in server-side environment variables.
- Keep `.env` excluded from version control.
- Configure deployment secrets through your hosting provider.
- Never publish API keys in frontend JavaScript, repository files, screenshots, or public logs.

### File Handling

- Uploaded files are processed in memory and are not intentionally written to disk by the application's upload workflow.
- PDF and image files are sent to the configured AI service as inline data.
- DOCX and TXT content is extracted and sent as text.
- Uploads are limited to 20 MB.
- Pasted and extracted text is limited to 100,000 characters.
- Roadmap requests are rate-limited per client address.

### Cross-Origin Resource Sharing (CORS)

Configure `FRONTEND_ORIGINS` with the exact origins authorized to access the API.

The application supports localhost and loopback origins for development. Opening `index.html` directly through a `file://` URL may send a `null` origin.

The `ALLOW_NULL_ORIGIN=true` setting is intended for local development only and must not be enabled on a public deployment.

CORS is one layer of browser security, not a replacement for authentication, authorization, request validation, or rate limiting.

### Data Privacy

SabiSyllabusAI does not intentionally retain submitted content after a request completes. However, submitted PDF and image content, as well as extracted document text, is transmitted to the configured AI provider for processing.

Users should avoid uploading confidential academic records or other sensitive material unless permitted by their institution and consistent with the applicable provider's data-handling terms.

## 🌐 Deployment

SabiSyllabusAI requires a hosting environment capable of running its Node.js and Express backend.

### Deployment Checklist

1. Push the project to GitHub.
2. Choose a hosting provider that supports Node.js applications.
3. Configure `GEMINI_API_KEY` as a server-side environment variable.
4. Set `PORT` according to the hosting provider's requirements.
5. Configure `FRONTEND_ORIGINS` with the exact public frontend origin or origins.
6. Ensure the deployment process installs dependencies and builds the stylesheet.
7. Start the server using `npm start`.
8. Test `GET /api/health`.
9. Submit a sample course outline and verify that `/api/optimize` returns a valid roadmap.
10. Review deployment logs, rate limits, CORS settings, and API key protection.

If the frontend and backend are deployed separately, update the frontend API endpoint to use the deployed backend URL instead of `http://localhost:5000/api/optimize`.

Never enable `ALLOW_NULL_ORIGIN` in production.

## 🗺️ Future Improvements

Potential future enhancements include:

- Personalized study schedules based on available study hours.
- Progress tracking and roadmap completion status.
- Calendar integration and study reminders.
- Exporting roadmaps to PDF and other formats.
- Support for different semester lengths and academic calendars.
- Improved handling of complex academic documents.
- Flexible study plans based on course difficulty and examination dates.

These are possible future enhancements and may not yet be implemented.

## 👨‍💻 Creator

Created and developed by GentleCoder

SabiSyllabusAI is part of my journey into software engineering, AI, and building practical technology solutions that solve real-world problems.

### Connect with GentleCoder

- Portfolio: [https://gentlecoder.vercel.app](https://gentlecoder.vercel.app)
- GitHub: [https://github.com/the-gentlecoder](https://github.com/the-gentlecoder)
- YouTube: [https://www.youtube.com/@thegentlecoder](https://www.youtube.com/@thegentlecoder)

### More About the Creator

Follow my journey as I learn, build, and share practical lessons in software development, data, and technology.

SabiSyllabusAI — Learn with structure. Prepare with purpose.

Copyright © GentleCoder. All rights reserved unless a separate license is provided in this repository.