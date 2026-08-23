// Find the signup form in our HTML.
const signupForm = document.getElementById("signup-form");

// Find the hidden success section.
const successSection = document.getElementById("success-section");

// Find the paragraph where we display feedback.
const successMessage = document.getElementById("success-message");


signupForm.addEventListener("submit", async function (event) {

    // Prevent normal form refresh.
    event.preventDefault();

    // Get customer input.
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const marketingConsent =
        document.getElementById("marketing-consent").checked;

    // Build customer object.
    const customer = {
        name: name,
        email: email,
        phone: phone,
        marketingConsent: marketingConsent
    };

    try {

        // Send customer information to the production n8n webhook.
        const response = await fetch(
            "https://n8n-production-c7a7.up.railway.app/webhook/restaurant-signup",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(customer)
            }
        );

        // Make sure the HTTP request itself succeeded.
        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
        }

        // Read the JSON returned by n8n.
        const result = await response.json();

        console.log("n8n response:", result);


        // NEW CUSTOMER
        if (result.status === "success") {

            signupForm.classList.add("hidden");

            successMessage.textContent =
                `Thanks, ${name}! Your VIP offer is ready. Check your email for your unique offer code.`;

            successSection.classList.remove("hidden");
        }


        // EXISTING CUSTOMER
        else if (result.status === "duplicate") {

            signupForm.classList.add("hidden");

            successMessage.textContent =
                `It looks like ${email} has already claimed this offer. Check your email for your existing coupon.`;

            successSection.classList.remove("hidden");
        }


        // Unexpected n8n response
        else {
            throw new Error("Unexpected response from signup system.");
        }

    } catch (error) {

        console.error("Signup error:", error);

        // Keep the form visible so the customer can try again.
        successMessage.textContent =
            "We couldn't process your signup right now. Please try again.";

        successSection.classList.remove("hidden");
    }

});