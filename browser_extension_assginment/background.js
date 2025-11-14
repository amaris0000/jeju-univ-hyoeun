const apiKey = "VF1eObVzDGtGNwmmSu8JNyEEkarHDuFH";
const country = "KR";      
const year = 2025;          

const url = `https://calendarific.com/api/v2/holidays?&api_key=${apiKey}&country=${country}&year=${year}`;

fetch(url)
  .then(res => res.json())
  .then(data => console.log(data))
  .catch(err => console.error(err));
