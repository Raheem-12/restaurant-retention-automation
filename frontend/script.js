// Find the signup form.
const signupForm = document.getElementById("signup-form");


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

            n8n created the customer,
            generated a coupon,
            stored it in Google Sheets,
            and sent the email.
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

            The email already exists in the
            Google Sheet.

            Therefore:
            - no new row
            - no new coupon
            - no new email
        */
        else if (result.status === "duplicate") {

            signupForm.classList.add("hidden");


            successTitle.textContent =
                "Offer Already Claimed";


            successMessage.textContent =
                `${email} has already claimed this offer.`;


            // IMPORTANT:
            // Do not display "FREE SIDE" here because
            // the customer is NOT receiving another offer.
            couponTitle.textContent =
                "NO NEW COUPON ISSUED";


            couponDescription.textContent =
                "You have already claimed this offer.";


            couponCodeMessage.textContent =
                "Check your email for the coupon you previously received.";


            successSection.classList.remove("hidden");
        }



        /*
            n8n responded, but not with one of
            the statuses our website expects.
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

            Keep the form visible so the
            customer can try again.
        */
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