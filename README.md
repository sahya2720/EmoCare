
# 🧾 EMOCARE

Students and working professionals are increasingly experiencing mental health problems like stress, anxiety, and burnout, but timely support is still unavailable because of stigma, high costs, restricted professional access, and a lack of early detection. 
Current digital solutions do not continuously monitor emotional well-being or detect early warning signs; instead, they provide general support.This necessitates the development of an individualised, easily accessible, and privacy-focused system that allows for ongoing emotional monitoring and early mental health assistance.
## 📦 Proposed Solution
Overview of the Approach

 A secure AI-based mental health companion that supports users    through empathetic conversations and private journaling.

 Uses NLP and emotion analysis to understand user feelings and provide early emotional support.

Key Features of the Solution

 Text-based sentiment analysis from chat and diary entries.

 Emotion-aware chatbot with supportive responses and coping suggestions.

 Secure, encrypted diary for private emotional expression.
User-friendly interface with privacy-first design.

Uniqueness

 Emotion pattern tracking over time.

 Privacy-first, ethical AI design
## 🛠 Requirements
Node.js 14+

npm 

A valid Gemini API key


## 🧪 Installation
Run from command line

1.Clone the repository
```bash
git clone https://github.com/sahya2720/EmoCare.git
cd EmoCare

```
2.Install dependencies

Using npm:

```bash
  npm install
```
3.Create environment file

Create a .env.local in the root:

```bash
  GEMINI_API_KEY=your_api_key_here
```
4.Clone the repository

```bash
npm run dev

```
## 📁 File Structure

```
EmoCare/
├── public/
├── src/
│   ├── components/        # Reusable UI components
│   ├── services/          # AI service calls, sentiment logic
│   ├── App.tsx            # Main app entry
│   ├── index.tsx          # React bootstrapping
│   └── types.ts 
├── .gitignore
├── package.json
├── vite.config.ts
├── tsconfig.json
└── README.md
```
## 👩‍💻 Authors

- [@siriyash15](https://www.github.com/siriyash15)
- [@shivani-singari](https://www.github.com/shivani-singari)
- [@sahya2720](https://www.github.com/sahya2720)
- [@vaishnavi361](https://www.github.com/vaishnavi361)

