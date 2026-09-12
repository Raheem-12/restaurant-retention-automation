document.addEventListener("DOMContentLoaded", function () {
    // Update copyright year if a #year element exists
    const yearElement = document.getElementById("year");

    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }

    // Format phone number as (703)-404-2310
    const phoneInput = document.getElementById("phone");

    if (phoneInput) {
        phoneInput.addEventListener("input", function () {
            const digits = this.value.replace(/\D/g, "").slice(0, 10);

            if (digits.length === 0) {
                this.value = "";
            } else if (digits.length <= 3) {
                this.value = `(${digits}`;
            } else if (digits.length <= 6) {
                this.value =
                    `(${digits.slice(0, 3)})-${digits.slice(3)}`;
            } else {
                this.value =
                    `(${digits.slice(0, 3)})-${digits.slice(3, 6)}-${digits.slice(6)}`;
            }
        });
    }
});