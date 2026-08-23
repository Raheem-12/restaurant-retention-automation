const dashboardApiUrl =
    "https://n8n-production-c7a7.up.railway.app/webhook/424f85ee-5ba9-4727-9bed-6b7c8e7e71c9";


const totalMembersElement =
    document.getElementById("total-members");

const redeemedCountElement =
    document.getElementById("redeemed-count");

const redemptionRateElement =
    document.getElementById("redemption-rate");

const newThisWeekElement =
    document.getElementById("new-this-week");

const recentSignupsElement =
    document.getElementById("recent-signups");


async function loadDashboard() {

    try {

        const response =
            await fetch(dashboardApiUrl);


        if (!response.ok) {
            throw new Error(
                `Dashboard API error: ${response.status}`
            );
        }


        const data =
            await response.json();


        /*
            Fill the four metric cards.
        */
        totalMembersElement.textContent =
            data.totalMembers;

        redeemedCountElement.textContent =
            data.redeemedCount;

        redemptionRateElement.textContent =
            `${data.redemptionRate}%`;

        newThisWeekElement.textContent =
            data.newThisWeek;


        /*
            Clear the loading text.
        */
        recentSignupsElement.innerHTML = "";


        /*
            Display each recent signup.
        */
        data.recentSignups.forEach(signup => {

            const row =
                document.createElement("div");

            row.classList.add("signup-row");


            const name =
                document.createElement("span");

            name.classList.add("signup-name");

            name.textContent =
                signup.name;


            const date =
                document.createElement("span");

            date.classList.add("signup-date");

            date.textContent =
                formatSignupDate(
                    signup.signupDate
                );


            row.appendChild(name);

            row.appendChild(date);

            recentSignupsElement.appendChild(row);

        });


        /*
            If there aren't any recent signups,
            show an empty-state message.
        */
        if (data.recentSignups.length === 0) {

            recentSignupsElement.innerHTML =
                '<p class="loading">No recent signups yet.</p>';

        }

    }

    catch (error) {

        console.error(
            "Dashboard error:",
            error
        );


        recentSignupsElement.innerHTML =
            '<p class="error-message">' +
            'Unable to load dashboard data.' +
            '</p>';

    }

}


function formatSignupDate(dateValue) {

    const date =
        new Date(dateValue);


    /*
        If JavaScript cannot understand
        the date value, display it unchanged.
    */
    if (isNaN(date)) {
        return dateValue;
    }


    return date.toLocaleString(
        "en-US",
        {
            month: "short",
            day: "numeric",
            hour: "numeric",
            minute: "2-digit"
        }
    );

}


loadDashboard();