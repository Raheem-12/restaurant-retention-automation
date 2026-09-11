const yearElement =
  document.getElementById("year");

if (yearElement) {
  yearElement.textContent =
    new Date().getFullYear();
}


const demoForm =
  document.getElementById("demo-form");

if (demoForm) {

  demoForm.addEventListener(
    "submit",
    function (event) {

      event.preventDefault();

      if (!demoForm.checkValidity()) {
        demoForm.reportValidity();
        return;
      }


      const name =
        document
          .getElementById("name")
          .value
          .trim();

      const phone =
        document
          .getElementById("phone")
          .value
          .trim();

      const email =
        document
          .getElementById("email")
          .value
          .trim();

      const restaurant =
        document
          .getElementById("restaurant")
          .value
          .trim();

      const locations =
        document
          .getElementById("locations")
          .value;


      const subject =
        `DineSurge Demo Request - ${restaurant}`;


      const body = [

        "Hi DineSurge,",

        "",

        "I'd like to schedule a free demo.",

        "",

        `Name: ${name}`,

        `Restaurant: ${restaurant}`,

        `Number of locations: ${locations}`,

        `Phone: ${phone}`,

        `Email: ${email}`,

        "",

        "Thank you."

      ].join("\n");


      window.location.href =
        `mailto:dinesurge@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    }
  );

}