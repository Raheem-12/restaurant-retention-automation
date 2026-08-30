// Find the signup form.
const signupForm =
    document.getElementById("signup-form");


// Find the submit button.
const submitButton =
    signupForm.querySelector('button[type="submit"]');


// Find the phone input.
const phoneInput =
    document.getElementById("phone");


// Find the result section.
const successSection =
    document.getElementById("success-section");


// Find the result elements.
const successTitle =
    document.getElementById("success-title");

const successMessage =
    document.getElementById("success-message");

const couponTitle =
    document.getElementById("coupon-title");

const couponDescription =
    document.getElementById("coupon-description");

const couponCodeMessage =
    document.getElementById("coupon-code-message");



/*
    -----------------------------------------
    PHONE NUMBER FORMATTING
    -----------------------------------------

    Customer types:

    2023421321

    Website displays:

    (202) 342-1321
*/
phoneInput.addEventListener("input", function () {

    /*
        Remove everything except digits.
    */
    let digits =
        phoneInput.value.replace(/\D/g, "");


    /*
        Only allow a maximum of 10 digits.
    */
    digits =
        digits.substring(0, 10);


    /*
        Format the phone number depending
        on how many digits have been entered.
    */

    if (digits.length === 0) {

        phoneInput.value = "";

    }

    else if (digits.length <= 3) {

        phoneInput.value =
            `(${digits}`;

    }

    else if (digits.length <= 6) {

        phoneInput.value =
            `(${digits.substring(0, 3)}) ` +
            digits.substring(3);

    }

    else {

        phoneInput.value =
            `(${digits.substring(0, 3)}) ` +
            `${digits.substring(3, 6)}-` +
            digits.substring(6);

    }

});



/*
    Clear any previous phone validation
    error when the customer edits the field.
*/
phoneInput.addEventListener("input", function () {

    phoneInput.setCustomValidity("");

});



/*
    -----------------------------------------
    FORM SUBMISSION
    -----------------------------------------
*/
signupForm.addEventListener(
    "submit",
    async function (event) {

        /*
            Prevent normal webpage refresh.
        */
        event.preventDefault();


        /*
            Get customer name.
        */
        const name =
            document
                .getElementById("name")
                .value
                .trim();


        /*
            Normalize email.

            JOHN@GMAIL.COM

            becomes:

            john@gmail.com
        */
        const email =
            document
                .getElementById("email")
                .value
                .trim()
                .toLowerCase();


        /*
            Get the formatted phone number.

            Example:

            (202) 342-1321
        */
        const formattedPhone =
            phoneInput.value.trim();


        /*
            Normalize phone number.

            (202) 342-1321

            becomes:

            2023421321

            This normalized version is what
            gets sent to n8n.
        */
        const phone =
            formattedPhone.replace(/\D/g, "");


        /*
            Get marketing consent.
        */
        const marketingConsent =
            document
                .getElementById("marketing-consent")
                .checked;



        /*
            -----------------------------------------
            PHONE VALIDATION
            -----------------------------------------

            Require exactly 10 digits.
        */
        if (phone.length !== 10) {

            phoneInput.setCustomValidity(
                "Please enter a complete 10-digit phone number."
            );

            phoneInput.reportValidity();

            return;

        }


        /*
            Clear validation error if valid.
        */
        phoneInput.setCustomValidity("");



        /*
            Prevent accidental double submissions.
        */
        submitButton.disabled = true;

        submitButton.textContent =
            "Processing...";



        /*
            Build the customer object.
        */
        const customer = {

            name: name,

            email: email,

            phone: phone,

            marketingConsent:
                marketingConsent

        };



        try {

            /*
                Send signup information
                to the production n8n webhook.
            */
            const response =
                await fetch(

                    "https://n8n-production-c7a7.up.railway.app/webhook/restaurant-signup",

                    {

                        method: "POST",

                        headers: {

                            "Content-Type":
                                "application/json"

                        },

                        body:
                            JSON.stringify(
                                customer
                            )

                    }

                );



            /*
                Make sure the HTTP request
                itself succeeded.
            */
            if (!response.ok) {

                throw new Error(
                    `HTTP error: ${response.status}`
                );

            }



            /*
                Read the JSON returned by n8n.
            */
            const result =
                await response.json();


            console.log(
                "n8n response:",
                result
            );



            /*
                --------------------------------
                NEW CUSTOMER
                --------------------------------
            */
            if (
                result.status === "success"
            ) {

                /*
                    Hide signup form.
                */
                signupForm
                    .classList
                    .add("hidden");


                /*
                    Display success message.
                */
                successTitle.textContent =
                    "You're in! 🎉";


                successMessage.textContent =
                    `Thanks, ${name}! ` +
                    `Your VIP offer is ready. ` +
                    `Check your email for your unique offer code.`;


                /*
                    Display coupon information.
                */
                couponTitle.textContent =
                    "FREE SIDE";


                couponDescription.textContent =
                    "Show this offer to your server on your next visit.";


                couponCodeMessage.textContent =
                    "Check your email for your unique offer code.";


                /*
                    Show success section.
                */
                successSection
                    .classList
                    .remove("hidden");

            }



            /*
                --------------------------------
                EXISTING CUSTOMER
                --------------------------------
            */
            else if (
                result.status === "duplicate"
            ) {

                /*
                    Hide signup form.
                */
                signupForm
                    .classList
                    .add("hidden");


                /*
                    Explain duplicate claim.
                */
                successTitle.textContent =
                    "Offer Already Claimed";


                successMessage.textContent =
                    "This email address or phone number has already been used to claim this offer.";


                /*
                    Make it clear that another
                    coupon was NOT issued.
                */
                couponTitle.textContent =
                    "NO NEW COUPON ISSUED";


                couponDescription.textContent =
                    "You have already claimed this offer.";


                couponCodeMessage.textContent =
                    "Check your email for the coupon you previously received.";


                /*
                    Show result section.
                */
                successSection
                    .classList
                    .remove("hidden");

            }



            /*
                --------------------------------
                UNEXPECTED RESPONSE
                --------------------------------
            */
            else {

                throw new Error(
                    "Unexpected response from signup system."
                );

            }

        }



        /*
            -----------------------------------------
            ERROR STATE
            -----------------------------------------
        */
        catch (error) {

            console.error(
                "Signup error:",
                error
            );


            /*
                Re-enable submit button so
                customer can try again.
            */
            submitButton.disabled = false;

            submitButton.textContent =
                "Claim My Free Side";


            /*
                Display error information.
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


            /*
                Show error section.
            */
            successSection
                .classList
                .remove("hidden");

        }

    }

);