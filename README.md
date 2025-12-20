# Valorant Stream Analyzer

Real-time Valorant match analysis using computer vision.

## Getting Started

### Prerequisites

- Node.js installed

### Installation

```bash
npm install
```

### Running the Application

To start the development server:

```bash
npm start
```
or
```bash
npm run dev
```

Then open your browser at the URL shown in the terminal (usually `http://localhost:5173`).

## Troubleshooting

### Failed to load module script
If you encounter an error like:
`Failed to load module script: Expected a JavaScript-or-Wasm module script but the server responded with a MIME type of "text/jsx".`

Please ensure you are running the application using `npm start` or `npm run dev`. Opening `index.html` directly in the browser or using a simple static file server will not work because the code requires compilation/transpilation (handled by Vite).
