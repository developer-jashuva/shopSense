
🛒 ShopSense – Real-time Product Sentiment Analyzer (Flipkart Edition)

ShopSense is a smart Chrome extension that helps online shoppers make informed buying decisions by analyzing real user reviews on Flipkart product pages using the Google Gemini AI API. It automatically extracts live reviews, performs sentiment analysis, and displays a trust score and sentiment summary as an overlay on the product page.


🔍 Features

Automatically extracts latest reviews from Flipkart product pages

Analyzes review sentiment (Positive / Mixed / Negative), common pros and cons

Calculates a trust score out of 100 based on sentiment and review authenticity

Injects a floating badge overlay summarizing trustworthiness — no manual action needed


🚀 How It Works

1. User visits a Flipkart product page


2. Extension auto-redirects to the full review page


3. Content script waits for reviews to load in the DOM


4. Extracts ratings, review titles, and full review texts


5. Sends this data to a backend /analyze API powered by Google Gemini AI


6. Receives analyzed sentiment summary and trust score


7. Injects a floating trust badge overlay on the product review page



🛠 Tech Stack

Chrome Extension using Manifest V3

JavaScript (Content scripts for DOM parsing & injection)

Node.js + Express backend server

Google Gemini AI API (v2.0 Flash) for sentiment analysis

Communication via Fetch API to /analyze endpoint



📦 Installation & Setup

1. Clone the repository

git clone https://github.com/yourusername/shopsense.git
cd shopsense

2. Install dependencies for backend

cd backend
npm install

3. Configure environment variables

Create a .env file in the backend folder and add your Gemini API key and other configs:

GEMINI_API_KEY=your_gemini_api_key_here
PORT=3000

4. Start the backend server

npm start

5. Load the Chrome extension

Open Chrome and navigate to chrome://extensions/

Enable Developer mode

Click Load unpacked and select the extension folder in the repo


🎥 Demo

Check out this demo video showing ShopSense in action:
[https://drive.google.com/file/d/1Z94bGr0DqkIytN8FkDCU021Hh8RsJrSc/view?usp=drive_link]

<img src="https://drive.google.com/file/d/1OURp0XHC3XwfaVawfrNuPMuWWAjYWUyI/view?usp=drive_link" style="width: 500px; max-width: 100%; height: auto" title="Click for the larger version." />

<img src="https://drive.google.com/file/d/1W9lVGs3X8dh6Hye7xXlZVKtafLOqUZ7G/view?usp=drive_link" style="width: 500px; max-width: 100%; height: auto" title="Click for the larger version." />

🤝 Contributing

Contributions are welcome! Feel free to open issues or submit pull requests for improvements and new features.


🙌 Acknowledgments

Powered by Google Gemini AI

Inspired by the need for reliable product review sentiment on e-commerce sites
    
