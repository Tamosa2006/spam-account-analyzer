# 🔍 img_source_finder

A full-stack, type-safe **Next.js and TypeScript** application engineered to analyze profile imagery, track digital footprints, and detect spam or fraudulent social media accounts. This application serves as an advanced implementation of modular frontend components and asynchronous cloud API orchestration.

## 🚀 How the System Works (API Architecture)
The application handles account verification by chaining together three distinct background service nodes:
1. **Host Node (ImgBB API):** Temporarily uploads and maps localized images to cloud URLs.
2. **Scraper Node (SerpAPI):** Executes reverse-image operations across search indexes to trace original sources or stolen celebrity profiles.
3. **Reasoning Node (Groq API):** Feeds structured web metadata into high-speed LLM inference models to generate a security risk calculation (`Low`, `Medium`, or `High`).

## 💻 Tech Stack & Project Architecture
* **Frontend Core:** Next.js 15 (App Router), React, TypeScript
* **Styling Engine:** Tailwind CSS / Custom Inline Flex Layouts
* **Build Engine:** Turbopack (Optimized Next.js local bundler)
* **Backend Layer:** Next.js API Routes (`/api/describe`, `/api/reverse`, `/api/social-scan`)

### 📦 Key Component Structure
* `AnalysisCard.tsx`: Dynamically color-codes UI components based on the threat index score (`Low`, `Medium`, `High`).
* `FaceCropper.tsx`: Handles client-side canvas mutations to isolate profile subjects before processing.
* `UploadZone.tsx`: Manages dropzone states for smooth client image ingestion.

## ⚠️ Current Engineering Limitations
* **Strict Type Mapping Alerts:** Minor TypeScript compiler assignments in specific UI card components are currently undergoing refinement to resolve strict interface mismatches without breaking runtime states.
* **Model Inference Edge Cases:** Since the pipeline relies on automated scraping signatures, accuracy can fluctuate if a profile image lacks clear public web indexes.

## ⚙️ Installation & Development

### Local Setup
1. Clone the project files:
   ```bash
   git clone https://github.com
   cd img_source_finder
   ```

2. Establish your local variables inside a `.env.local` file:
   ```env
   GROQ_API_KEY=your_key
   IMGBB_API_KEY=your_key
   SERPAPI_KEY=your_key
   ```

3. Initialize dependencies and execute the Turbopack local dev engine:
   ```bash
   npm install
   npm run dev
   ```
