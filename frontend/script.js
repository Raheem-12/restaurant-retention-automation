const yearElement = document.getElementById("year");

if (yearElement) {
  yearElement.textContent = new Date().getFullYear();
}

const demoForm = document.getElementById("demo-form");

if (demoForm) {
  demoForm.addEventListener("submit", function (event) {
    event.preventDefault();

    if (!demoForm.checkValidity()) {
      demoForm.reportValidity();
      return;
    }

    const name = document.getElementById("name").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const email = document.getElementById("email").value.trim();
    const restaurant = document.getElementById("restaurant").value.trim();
    const locations = document.getElementById("locations").value;

    const subject = `DineSurge Demo Request - ${restaurant}`;

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
      `mailto:dinesurge@gmail.com` +
      `?subject=${encodeURIComponent(subject)}` +
      `&body=${encodeURIComponent(body)}`;
  });
}

const revealItems = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    function (entries, observer) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.14,
      rootMargin: "0px 0px -45px"
    }
  );

  revealItems.forEach(function (item) {
    revealObserver.observe(item);
  });
} else {
  revealItems.forEach(function (item) {
    item.classList.add("is-visible");
  });
}