
console.log("✅ Content script is running!");

console.log("✅ ShopSense content script is running!");




  

function extractAmazonReviews() {
  console.log('going to fetch amezon reviews');
  
  const reviews = [];
      const reviewBodies = document.querySelectorAll('span[data-hook="review-body"]');
      const reviewRatings = document.querySelectorAll('i[data-hook="review-star-rating"]');
    
      reviewBodies.forEach((bodyEl, index) => {
        const text = bodyEl.innerText.trim();
        const ratingEl = reviewRatings[index];
        const rating = ratingEl ? ratingEl.innerText.trim().split(" ")[0] : null;
    
        reviews.push({ rating, text });
      });
console.log(reviews);

  return reviews;
}

function extractFlipkartReviewsFromDOM() {
  console.log('i am in extrac');
  
  const reviews = [];
  const ratingEls = document.querySelectorAll('.XQDdHH.Ga3i8K');
  const titleEls = document.querySelectorAll('.z9E0IG');
  const detailEls = document.querySelectorAll('.ZmyHeo');

  for (let i = 0; i < ratingEls.length; i++) {
    const rating = parseFloat(ratingEls[i]?.innerText?.trim() || "0");
    const title = titleEls[i]?.innerText?.trim() || "";
    const detail = detailEls[i]?.innerText?.trim() || "";
    const text = `${title} — ${detail}`;

    if (text && !isNaN(rating)) {
      reviews.push({ rating, text });
    }
  }

  return reviews;
}
async function handleFlipkartReviews(){
 const isFlipkart = location.hostname.includes("flipkart");
  const isReviewPage = location.pathname.includes("product-reviews");


  if (isFlipkart && !isReviewPage) {
    const reviewLink = document.querySelector('div._23J90q.RcXBOT')?.closest("a")?.href;
    if (reviewLink) {
      console.log("➡️ Redirecting to full Flipkart review page...");
      location.href = reviewLink;
      return;
    }
  }

  if (isFlipkart && isReviewPage) {
    console.log("🟢 Flipkart review page detected — waiting for DOM reviews...");
   
    console.log('before going to extract');
    
    const reviews = extractFlipkartReviewsFromDOM().slice(0, 10);
    console.log("📦 Extracted reviews:", reviews);

    if (reviews.length === 0) return;

    const res = await fetch("http://localhost:3000/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: "Flipkart Product", reviews })
    });

    const data = await res.json();
    console.log(data.result);
    
    injectBadge(data.result);
  }
}





function injectBadge({ trustScore, sentiment, pros, cons }) {
  console.log("🎯 Injecting badge with score:", trustScore);

  const badge = document.createElement("div");
  badge.innerHTML = `
    <div style="
      position: fixed;
      top: 100px;
      right: 20px;
      background: white;
      border: 2px solid #ccc;
      padding: 12px;
      border-radius: 10px;
      font-family: sans-serif;
      box-shadow: 0 4px 10px rgba(0,0,0,0.2);
      z-index: 9999;
      max-width: 300px;
    ">
      <strong>Trust Score:</strong> 
      <span style="color:${trustScore >= 80 ? 'green' : trustScore >= 50 ? 'orange' : 'red'};">
        ${trustScore}/100
      </span>
      <br />
      <strong>Sentiment:</strong> ${sentiment}
 

      <details>
     <summary style="cursor: pointer;">View Pros & Cons</summary>
     <div style="max-height: 200px; overflow-y: auto; margin-top: 6px; padding-right: 8px;">
      <p><strong>Pros:</strong><ul>${pros.map(p => `<li>${p.replace(/\*/g, '').trim()}</li>`).join('')}</ul></p>
      <p><strong>Cons:</strong><ul>${cons.map(c => `<li>${c.replace(/\*/g, '').trim()}</li>`).join('')}</ul></p>
    </div>
      </details>

    </div>
  `;
  document.body.appendChild(badge);
}

(async () => {
  console.log(location.hostname);
  
  const isFlipkart = location.hostname.includes("flipkart");


const reviews = isFlipkart ? handleFlipkartReviews() : extractAmazonReviews();

  const productTitle = document.querySelector('#productTitle, .B_NuCI, h1')?.innerText?.trim() ?? "Product";
  
  if (!reviews.length) {
    console.warn("❌ No reviews found.");
    return;
  }

  console.log("📦 Extracted reviews:", reviews);

  try {
    const res = await fetch("http://localhost:3000/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reviews })
    });

    const data = await res.json();
    console.log("✅ Got response:", data.result);
    injectBadge(data.result);
  } catch (err) {
    console.error("❌ Failed to fetch sentiment:", err);
  }
})();

