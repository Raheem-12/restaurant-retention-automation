// Find the signup form in our HTML.
const signupForm = document.getElementById("signup-form");


// Find the hidden success section.
const successSection = document.getElementById("success-section");


// Find the paragraph where we will display
// a personalized success message.
const successMessage = document.getElementById("success-message");



/*
    Listen for the customer submitting the form.
*/
signupForm.addEventListener("submit", function (event) {

    /*
        Normally, submitting an HTML form refreshes
        the webpage.

        We prevent that because we want JavaScript
        to control what happens next.
    */
    event.preventDefault();


    /*
        Get the values the customer entered.
    */
    const name = document.getElementById("name").value.trim();

    const email = document.getElementById("email").value.trim();

    const phone = document.getElementById("phone").value.trim();

    const marketingConsent =
        document.getElementById("marketing-consent").checked;


    /*
        Put the customer's information into
        one JavaScript object.

        Later, we will send this object to our
        backend / automation system.
    */
    const customer = {
        name: name,
        email: email,
        phone: phone,
        marketingConsent: marketingConsent
    };

        fetch("https://n8n-production-c7a7.up.railway.app/webhook/restaurant-signup", {
    method: "POST",

    headers: {
        "Content-Type": "application/json"
    },

    body: JSON.stringify(customer)
    })
    .then(response => {
        console.log("Customer successfully sent to n8n");
    })
    .catch(error => {
        console.error("Error sending customer to n8n:", error);
    });


    /*
        For now, print the customer object
        to the browser developer console.

        This is ONLY for development/testing.

        We will remove this when real customer
        information is being handled.
    */
    console.log("Demo customer submitted:", customer);


    /*
        Hide the signup form after submission.
    */
    signupForm.classList.add("hidden");


    /*
        Create a personalized message.
    */
    successMessage.textContent =
        `Thanks, ${name}! Your VIP offer is ready.`;


    /*
        Remove the "hidden" class from the
        success section so the coupon appears.
    */
    successSection.classList.remove("hidden");

});