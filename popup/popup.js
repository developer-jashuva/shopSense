document.getElementById("analyze").addEventListener("click", () => {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.scripting.executeScript(
      {
        target: { tabId: tabs[0].id },
        func: scrapeReviews
      },
      async (results) => {
        const reviews = results[0].result;

        if (!reviews || reviews.length === 0) {
          document.getElementById("result").textContent = "❌ No reviews found.";
          return;
        }

        document.getElementById("result").textContent = "🔍 Analyzing reviews...";

        try {
          const res = await fetch("http://localhost:3000/analyze", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ reviews })
          });

          const data = await res.json();
          console.log(data);
          
          document.getElementById("result").textContent = "Result:\n" + data.result.cons;
        } catch (err) {
          document.getElementById("result").textContent = "❌ Failed to analyze reviews.";
          console.error(err);
        }
      }
    );
  });
});

function scrapeReviews() {
  const reviews = [];
  const reviewBodies = document.querySelectorAll('span[data-hook="review-body"]');
  const reviewRatings = document.querySelectorAll('i[data-hook="review-star-rating"]');

  reviewBodies.forEach((bodyEl, index) => {
    const text = bodyEl.innerText.trim();
    const ratingEl = reviewRatings[index];
    const rating = ratingEl ? ratingEl.innerText.trim().split(" ")[0] : null;
    reviews.push({ rating, text });
  });

  return reviews;
}
