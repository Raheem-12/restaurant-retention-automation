// Find the signup form.
const signupForm = document.getElementById("signup-form");

// Find the submit button.
const submitButton =
    signupForm.querySelector('button[type="submit"]');

// Find the result section.
const successSection = document.getElementById("success-section");

// Find the elements whose text will change
// depending on the response from n8n.
const successTitle = document.getElementById("success-title");
const successMessage = document.getElementById("success-message");

const couponTitle = document.getElementById("coupon-title");
const couponDescription = document.getElementById("coupon-description");
const couponCodeMessage =
    document.getElementById("coupon-code-message");


/*
    Listen for the customer submitting the form.
*/
signupForm.addEventListener("submit", async function (event) {

    // Prevent the webpage from refreshing.
    event.preventDefault();


    /*
        Prevent the customer from submitting
        the form multiple times while n8n
        is processing the request.
    */
    submitButton.disabled = true;
    submitButton.textContent = "Processing...";


    /*
        Get the customer's information.
    */
    const name =
        document.getElementById("name").value.trim();

    const email =
        document.getElementById("email").value.trim();

    const phone =
        document.getElementById("phone").value.trim();

    const marketingConsent =
        document.getElementById("marketing-consent").checked;


    /*
        Build the customer object that will
        be sent to n8n.
    */
    const customer = {
        name: name,
        email: email,
        phone: phone,
        marketingConsent: marketingConsent
    };


    try {

        /*
            Send the signup information to
            the production n8n webhook.
        */
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


        /*
            Make sure the HTTP request succeeded.
        */
        if (!response.ok) {
            throw new Error(
                `HTTP error: ${response.status}`
            );
        }


        /*
            Read the JSON response returned
            by the n8n workflow.
        */
        const result = await response.json();

        console.log("n8n response:", result);



        /*
            --------------------------------
            NEW CUSTOMER
            --------------------------------
        */
        if (result.status === "success") {

            signupForm.classList.add("hidden");

            successTitle.textContent =
                "You're in! 🎉";

            successMessage.textContent =
                `Thanks, ${name}! Your VIP offer is ready. ` +
                `Check your email for your unique offer code.`;

            couponTitle.textContent =
                "FREE SIDE";

            couponDescription.textContent =
                "Show this offer to your server on your next visit.";

            couponCodeMessage.textContent =
                "Check your email for your unique offer code.";

            successSection.classList.remove("hidden");
        }



        /*
            --------------------------------
            EXISTING CUSTOMER
            --------------------------------
        */
        else if (result.status === "duplicate") {

            signupForm.classList.add("hidden");

            successTitle.textContent =
                "Offer Already Claimed";

            successMessage.textContent =
                `${email} has already claimed this offer.`;

            couponTitle.textContent =
                "NO NEW COUPON ISSUED";

            couponDescription.textContent =
                "You have already claimed this offer.";

            couponCodeMessage.textContent =
                "Check your email for the coupon you previously received.";

            successSection.classList.remove("hidden");
        }



        /*
            Unexpected response from n8n.
        */
        else {

            throw new Error(
                "Unexpected response from signup system."
            );

        }


    } catch (error) {

        console.error("Signup error:", error);


        /*
            ERROR STATE

            Re-enable the button because the
            customer should be allowed to retry.
        */
        submitButton.disabled = false;
        submitButton.textContent = "Claim My Free Side";


        successTitle.textContent =
            "Something Went Wrong";

        successMessage.textContent =
            "We couldn't process your signup right now. Please try again.";

        couponTitle.textContent =
            "OFFER NOT CONFIRMED";

        couponDescription.textContent =
            "Your offer has not been confirmed.";

        couponCodeMessage.textContent =
            "Please try submitting the form again.";

        successSection.classList.remove("hidden");
    }

});