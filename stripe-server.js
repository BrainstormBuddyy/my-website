// Frontend helper to call the backend cancel endpoint (no Stripe secret here).
(function () {
 const API_BASE =
  (location.hostname.includes('localhost') || location.hostname.startsWith('127.'))
    ? 'http://127.0.0.1:5050'
    : 'https://auth-backend-b1b6.onrender.com';

  async function cancelSubscription() {
    const email = localStorage.getItem("userEmail");
    const btn  = document.getElementById("cancel-btn");
    const msg  = document.getElementById("msg");

    if (!email || email === "Not logged in") {
      alert("You must be logged in.");
      return;
    }

    try {
      if (btn) { btn.disabled = true; btn.textContent = "Cancelling…"; }
      if (msg) { msg.textContent = ""; msg.classList.remove("ok","error"); }

      const res = await fetch(`${API_BASE}/cancel-subscription`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.success) {
        const reason = data?.message || `HTTP ${res.status}`;
        if (msg) { msg.textContent = `Could not cancel: ${reason}`; msg.classList.add("error"); }
        if (btn) { btn.textContent = "Cancel at period end"; btn.disabled = false; }
        return;
      }

      if (msg) { msg.textContent = "Your subscription will cancel at the period end."; msg.classList.add("ok"); }
      if (btn)  { btn.textContent = "Cancel scheduled"; btn.disabled = true; }
    } catch (e) {
      console.error('[frontend] cancel error:', e);
      if (msg) { msg.textContent = "Unexpected error cancelling subscription."; msg.classList.add("error"); }
      if (btn) { btn.textContent = "Cancel at period end"; btn.disabled = false; }
    }
  }

  window.cancelSubscription = cancelSubscription;
})();
