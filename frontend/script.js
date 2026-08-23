// Find the signup form in our HTML.
const signupForm = document.getElementById("signup-form");

// Find the hidden result section.
const successSection = document.getElementById("success-section");

// Find the heading and message inside the result section.
const successTitle = document.getElementById("success-title");
const successMessage = document.getElementById("success-message");


/*
    Listen for the customer submitting the signup form.
*/
signupForm.addEventListener("submit", async function (event) {

    // Prevent the webpage from refreshing.
    event.preventDefault();


    /*
        Get the information entered by the customer.
    */
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const marketingConsent =
        document.getElementById("marketing-consent").checked;


    /*
        Put the customer's information into one object.
        This object will be sent to n8n.
    */
    const customer = {
        name: name,
        email: email,
        phone: phone,
        marketingConsent: marketingConsent
    };


    try {

        /*
            Send the customer information to our
            production n8n webhook.

            "await" means JavaScript waits for n8n
            to respond before continuing.
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
            If n8n returns an HTTP error,
            stop and move to the catch block.
        */
        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
        }


        /*
            Convert the JSON response from n8n
            into a JavaScript object.

            Expected responses:

            { "status": "success" }

            OR

            { "status": "duplicate" }
        */
        const result = await response.json();

        console.log("n8n response:", result);


        /*
            NEW CUSTOMER

            n8n successfully:
            - generated the coupon
            - added the customer to Google Sheets
            - sent the email
        */
        if (result.status === "success") {

            // Hide the signup form.
            signupForm.classList.add("hidden");

            // Show the success heading.
            successTitle.textContent = "You're in! 🎉";

            // Show the personalized success message.
            successMessage.textContent =
                `Thanks, ${name}! Your VIP offer is ready. Check your email for your unique offer code.`;

            // Reveal the result section.
            successSection.classList.remove("hidden");
        }


        /*
            DUPLICATE CUSTOMER

            The email already exists in Google Sheets,
            so no second coupon should be created.
        */
        else if (result.status === "duplicate") {

            // Hide the signup form.
            signupForm.classList.add("hidden");

            // Change the heading for duplicate customers.
            successTitle.textContent = "Offer Already Claimed";

            // Explain what happened.
            successMessage.textContent =
                `It looks like ${email} has already claimed this offer. Check your email for your existing coupon.`;

            // Reveal the result section.
            successSection.classList.remove("hidden");
        }


        /*
            n8n responded, but with something
            our frontend wasn't expecting.
        */
        else {
            throw new Error("Unexpected response from signup system.");
        }

    } catch (error) {

        console.error("Signup error:", error);

        /*
            Something failed.

            We keep the form visible so the customer
            can try submitting again.
        */
        successTitle.textContent = "Something Went Wrong";

        successMessage.textContent =
            "We couldn't process your signup right now. Please try again.";

        successSection.classList.remove("hidden");
    }

});