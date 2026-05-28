document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("contact-form");
    const submitBtn = document.getElementById("submit-btn");
    const btnText = document.getElementById("btn-text");
    const btnIcon = document.getElementById("btn-icon");
    const responseContainer = document.getElementById("form-response");

    form.addEventListener("submit", function (e) {
        e.preventDefault();
        e.stopPropagation();

        // 1. Trigger Bootstrap client-side validation UI
        if (!form.checkValidity()) {
            form.classList.add("was-validated");
            return; // Halt submission if fields are missing/incorrect
        }

        // 2. Adjust UI elements to loading state
        form.classList.remove("was-validated"); // Clear validation visual clutter during send
        submitBtn.disabled = true;
        btnText.innerText = "Sending...";
        btnIcon.innerText = "hourglass_empty"; // Swaps the material icon to a waiting state

        // Hide any existing success/error alerts from previous attempts
        responseContainer.classList.add("d-none");

        // 3. Compile Form Data
        const formData = new FormData(form);
        const jsonObject = Object.fromEntries(formData.entries());
        const jsonPayload = JSON.stringify(jsonObject);

        // 4. Async Fetch request to API
        fetch("https://api.web3forms.com/submit", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"   // <--- Make sure this says "application/json"
            },
            body: jsonPayload
        })
        .then(async (response) => {
            let resData = await response.json();
            
            if (response.status === 200) {
                // Success Handling
                showFeedback("Thank you! Your message has been sent successfully.", "alert-success");
                form.reset(); // Wipe fields
            } else {
                // Server Side Rejection
                showFeedback(resData.message || "Submission failed. Please check your config.", "alert-danger");
            }
        })
        .catch((error) => {
            // Network Failure Handling
            showFeedback("Network error. Please check your internet connectivity.", "alert-danger");
            console.error("Submission error:", error);
        })
        .then(() => {
            // 5. Always reset button state back to active
            submitBtn.disabled = false;
            btnText.innerText = "Send Message";
            btnIcon.innerText = "send";
        });
    });

    // Helper utility to handle feedback alerts clean
    function showFeedback(message, alertClass) {
        responseContainer.innerText = message;
        responseContainer.className = `mt-3 alert text-center small py-2 rounded-3 ${alertClass}`;
    }
});
