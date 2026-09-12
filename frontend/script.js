document.getElementById("year").textContent = new Date().getFullYear();

const phoneInput = document.querySelector('input[type="tel"]');

if (phoneInput) {
    phoneInput.addEventListener("input", function () {
        const digits = this.value.replace(/\D/g, "").slice(0, 10);

        if (digits.length <= 3) {
            this.value = digits;
        } else if (digits.length <= 6) {
            this.value = `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
        } else {
            this.value =
                `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
        }
    });
}