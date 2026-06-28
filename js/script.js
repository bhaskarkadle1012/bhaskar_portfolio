document.addEventListener("DOMContentLoaded", () => {

    // ==========================================================================
    // 1. SCROLL-DRIVEN ENTRANCE ANIMATION INTERSECTION OBSERVER
    // ==========================================================================
    const observerOptions = {
        root: null, // Relative to the browser viewport
        rootMargin: "0px",
        threshold: 0.15 // Triggers when 15% of the element is visible
    };

    const scrollObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Add the class that triggers the CSS transition rules
                entry.target.classList.add("active");
                // Stop observing once the element has smoothly animated in
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Bind the observer engine to every layout hook we configured in your HTML
    const elementsToReveal = document.querySelectorAll(".reveal-on-scroll");
    elementsToReveal.forEach(element => {
        scrollObserver.observe(element);
    });

    // ==========================================================================
    // 2. HIGH-CONVERTING ASYNC FORM HANDLER & UI TRANSITIONS
    // ==========================================================================
    const form = document.getElementById("contact-form");
    const submitBtn = document.getElementById("submit-btn");
    const btnText = document.getElementById("btn-text");
    const btnIcon = document.getElementById("btn-icon");
    const responseContainer = document.getElementById("form-response");

    if (form) {
        form.addEventListener("submit", function (e) {
            e.preventDefault();
            e.stopPropagation();

            // Trigger Bootstrap client-side validation UI structure
            if (!form.checkValidity()) {
                form.classList.add("was-validated");
                return; // Halt submission if fields are incomplete or invalid
            }

            // Adjust UI elements to interactive loading state
            form.classList.remove("was-validated");
            submitBtn.disabled = true;
            btnText.innerText = "Sending...";

            // Swap to a refreshing material symbol and inject our style spin filter
            btnIcon.innerText = "sync";
            btnIcon.classList.add("animation-spin-node");

            // Hide any existing success/error alerts from previous attempts
            responseContainer.classList.add("d-none");

            // Compile Form Data into clean JSON payload structural mappings
            const formData = new FormData(form);
            const jsonObject = Object.fromEntries(formData.entries());
            const jsonPayload = JSON.stringify(jsonObject);

            // Fetch Request pipeline out to Web3Forms infrastructure
            fetch("https://api.web3forms.com/submit", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: jsonPayload
            })
                .then(async (response) => {
                    let resData = await response.json();

                    if (response.status === 200) {
                        // Success Handling Execution
                        showFeedback("Thank you! Your message has been sent successfully.", "alert-success");
                        form.reset(); // Clear all user text inputs inside DOM elements
                    } else {
                        // Server-Side Config Rejection Fallbacks
                        showFeedback(resData.message || "Submission failed. Please check your config.", "alert-danger");
                    }
                })
                .catch((error) => {
                    // Hardware/Network offline transmittal failures
                    showFeedback("Network error. Please check your internet connectivity.", "alert-danger");
                    console.error("Submission error:", error);
                })
                .then(() => {
                    // Restore button structural state back to active defaults smoothly
                    submitBtn.disabled = false;
                    btnText.innerText = "Send Message";
                    btnIcon.innerText = "send";
                    btnIcon.classList.remove("animation-spin-node");
                });
        });
    }

    // Helper utility to render response alerts with modern transition handling
    function showFeedback(message, alertClass) {
        responseContainer.innerText = message;
        responseContainer.className = `mt-3 alert text-center small py-2 rounded-3 ${alertClass}`;
        responseContainer.classList.remove("d-none");
    }
});
