document.getElementById("viewHoliday").addEventListener("click", async () => {
  const year = document.getElementById("yearInput").value || 2025;
  const apiKey = "VF1eObVzDGtGNwmmSu8JNyEEkarHDuFH";
  const country = "KR";

  const url = `https://calendarific.com/api/v2/holidays?&api_key=${apiKey}&country=${country}&year=${year}`;

  const res = await fetch(url);
  const data = await res.json();

  const listEl = document.getElementById("holidayList");
  listEl.innerHTML = "";

  data.response.holidays.forEach(h => {
    const li = document.createElement("li");
    li.innerText = `${h.date.iso} - ${h.name}`;
    listEl.appendChild(li);
  });
});
