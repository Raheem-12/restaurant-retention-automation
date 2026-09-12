document.getElementById("year").textContent = new Date().getFullYear();

//Phone section
const phoneInput = document.getElementById("phone");

if (phoneInput) {
    phoneInput.addEventListener("input", function () {
        const digits = phoneInput.value.replace(/\D/g, "").slice(0, 10);

        let formattedNumber = "";

        if (digits.length > 0) {
            formattedNumber = `(${digits.slice(0, 3)}`;
        }

        if (digits.length >= 4) {
            formattedNumber += `)-${digits.slice(3, 6)}`;
        }

        if (digits.length >= 7) {
            formattedNumber += `-${digits.slice(6, 10)}`;
        }

        phoneInput.value = formattedNumber;
    });
}