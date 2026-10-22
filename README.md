# SabiSyllabus AI

> AI-powered academic roadmap generation for more structured and purposeful learning.

SabiSyllabus AI is an academic planning platform created by [GentleCoder](https://github.com/the-gentlecoder). It transforms course outlines, university syllabuses, textbook outlines, and other academic materials into structured, chronological study roadmaps.

Designed with a mobile-first approach, SabiSyllabus AI helps students break down complex courses into manageable topics, organize their study plans, prioritize learning objectives, and prepare more effectively for examinations.

By combining artificial intelligence with academic planning, the project aims to make learning more organized, strategic, and accessible to students.

**Live application:** [https://sabisyllabusai.onrender.com](https://sabisyllabusai.onrender.com)

## Key Features

- **Multiple input formats:** Submit pasted text or upload supported PDF, DOCX, TXT, PNG, and JPG files.
- **AI-powered processing:** Uses Google Gemini to interpret academic materials and generate structured study plans.
- **12-week study roadmaps:** Organizes course content into a chronological learning plan.
- **Weekly learning objectives:** Includes topic bullets, a practical milestone, and a target focus for each week.
- **Content validation:** Checks generated roadmaps against the application's expected structure.
- **Responsive interface:** Provides a mobile-first experience for different screen sizes.
- **Interactive uploads:** Supports drag-and-drop file interactions and loading feedback.
- **Server-side API integration:** Keeps Gemini credentials on the backend rather than exposing them in browser code.
- **Input validation and rate limiting:** Applies upload restrictions, content checks, and request limits.

## Technology Stack

### Frontend

- HTML5
- Tailwind CSS
- Vanilla JavaScript

### Backend

- Node.js
- Express.js
- Multer

### Artificial Intelligence

- Google Gen AI SDK
- Google Gemini
- A dedicated system prompt for academic roadmap generation

### Supporting Tools

- npm
- dotenv for environment configuration
- Helmet for HTTP security headers
- CORS for cross-origin access control
- Express Rate Limit for request throttling
- Node.js built-in test runner

## How It Works

1. **Input:** The user pastes a course outline or uploads a supported document.
2. **Validation:** The backend validates the input, file type, upload size, and request limits.
3. **Content processing:** TXT and DOCX files are converted into text. Supported PDF and image files are submitted to Gemini as inline data.
4. **AI generation:** The backend sends the academic material and relevant instructions to the configured Gemini model.
5. **Roadmap validation:** The generated output is checked against the required structure. If the output is invalid, the application can retry generation.
6. **Output:** The API returns the generated Markdown roadmap to the frontend.

## Requirements

Before running the project locally, ensure you have:

- Node.js 18 or newer, subject to dependency requirements.
- npm.
- A valid Google Gemini API key.
- An internet connection for AI requests.

## Local Setup

### 1. Clone the repository

```
git clone https://github.com/the-gentlecoder/SabiSyllabusAI.git
cd SabiSyllabusAI
```

### 2. Install dependencies

```
npm install
```

### 3. Configure environment variables

Create a `.env` file in the project root and add your Gemini API key:

```
GEMINI_API_KEY=your_private_api_key
PORT=5000
```

Configure any additional environment variables required by your deployment or development setup.

**Security:** Never commit your `.env` file or expose your Gemini API key in frontend code, public logs, or repository files.

### 4. Build the stylesheet

```
npm run build:css
```

### 5. Start the server

```
npm start
```

For development, you can use:

```
npm run dev
```

### 6. Open the application

Visit:

[http://localhost:5000](http://localhost:5000)

The Express server serves the frontend and API from the same origin.

## API Documentation

### `POST /api/optimize`

Generates a study roadmap from a course outline.

The endpoint accepts multipart form data containing exactly one of the following inputs:

| Field          | Description                                  |
| -------------- | -------------------------------------------- |
| `rawText`      | Pasted text containing a course outline      |
| `syllabusFile` | A supported PDF, DOCX, TXT, PNG, or JPG file |

### Successful response

A successful request returns JSON containing the generated Markdown:

```
{
  "markdownRoadmap": "# Week 1\n..."
}
```

The example above illustrates the response format; the actual value contains the generated roadmap.

### Error responses

The API returns JSON containing an `error` message when a request cannot be processed.

Depending on the failure, responses may indicate invalid input, unsupported files, excessive content, request rate limits, timeouts, or AI service errors.

The exact status codes and messages depend on the implemented error-handling logic.

### `GET /api/health`

Returns a basic health-check response indicating whether the server is responding.

Example:

```
{
  "status": "ok"
}
```

## Roadmap Structure

The system prompt in `prompts/roadmap-system.txt` guides the configured AI model in producing a structured 12-week study roadmap.

Each valid roadmap is expected to contain:

- Exactly 12 sequential weekly headings.
- Three to four topic bullets per week.
- One practical milestone per week.
- One target focus per week.

The backend validates the generated structure before returning the result.

SabiSyllabus AI is designed to support academic planning. It does not guarantee examination performance or replace official course outlines, lecturers' instructions, or institutional requirements.

## Security and Privacy

### API key protection

- Store credentials in server-side environment variables.
- Keep `.env` excluded from version control.
- Configure deployment secrets through your hosting provider.
- Never expose API keys in frontend JavaScript or public logs.

### File handling

- The application accepts files up to 20 MB under its current upload configuration.
- Pasted and extracted text is subject to a 100,000-character limit.
- DOCX archives are checked against safeguards designed to limit unsafe archive expansion.
- Uploaded files are processed in memory by the current upload workflow rather than intentionally saved to disk.
- PDF and image content is sent to the configured AI provider as inline data.
- DOCX and TXT content is extracted and submitted as text.
- Roadmap requests are rate-limited.

These application limits do not guarantee that every accepted file will fit within the AI model's input limits.

### Cross-origin resource sharing (CORS)

The `FRONTEND_ORIGINS` environment variable specifies the exact origins authorized to access the API.

For example:

```
FRONTEND_ORIGINS=https://sabisyllabusai.onrender.com
```

For local development, the backend allows supported localhost and loopback origins.

Opening `index.html` directly through a `file://` URL may produce a `null` origin. The `ALLOW_NULL_ORIGIN=true` setting is intended for controlled local development only and should not be enabled on a public deployment.

CORS is one layer of browser security; it does not replace authentication, authorization, input validation, or rate limiting.

### Data privacy

SabiSyllabus AI does not intentionally retain submitted content after a request completes under its current application workflow. However, submitted PDF and image content, as well as extracted document text, is transmitted to the configured AI provider for processing.

Users should avoid submitting confidential academic records or other sensitive information unless permitted by their institution and consistent with the provider's applicable data-handling terms.

## Deployment

SabiSyllabus AI requires a hosting environment that supports Node.js applications.

The project is deployed on Render:

**Live application:** [https://sabisyllabusai.onrender.com](https://sabisyllabusai.onrender.com)

### Deployment checklist

1. Push the project to GitHub.
2. Create or update the Node.js web service on your hosting provider.
3. Configure `GEMINI_API_KEY` as a server-side environment variable.
4. Set `PORT` according to the hosting provider's requirements.
5. Configure `FRONTEND_ORIGINS` with the exact frontend origin.
6. Ensure dependencies are installed and the production stylesheet is built when necessary.
7. Start the application using `npm start`.
8. Verify `GET /api/health`.
9. Submit a sample syllabus and verify that `/api/optimize` returns a valid roadmap.
10. Review deployment logs, request limits, CORS settings, and credential protection.

If the frontend and backend are deployed separately, configure the frontend to send API requests to the deployed backend URL instead of the local development endpoint.

Never enable `ALLOW_NULL_ORIGIN` in production.

## Future Improvements

Potential enhancements include:

- More robust processing of large academic documents.
- Improved extraction from complex PDFs and scanned documents.
- Personalized study schedules based on available study hours.
- Progress tracking and roadmap completion status.
- Calendar integration and study reminders.
- Exporting roadmaps to PDF and other formats.
- Flexible study plans based on semester length, course difficulty, and examination dates.

These are potential improvements and should not be interpreted as existing features unless they have been implemented and tested.

## Creator

**Created by GentleCoder**

SabiSyllabus AI is part of my journey into software engineering, artificial intelligence, and building practical technology solutions to solve real-world problems.

### Connect with GentleCoder

- **Portfolio:** [https://gentlecoder.vercel.app](https://gentlecoder.vercel.app)
- **GitHub:** [https://github.com/the-gentlecoder](https://github.com/the-gentlecoder)
- **YouTube:** [https://www.youtube.com/@thegentlecoder](https://www.youtube.com/@thegentlecoder)

Follow my journey as I learn, build, and share practical lessons in software development, data, and technology.

*SabiSyllabus AI — Learn with structure. Prepare with purpose.*

Copyright © GentleCoder. All rights reserved unless a separate license is provided in this repository.
