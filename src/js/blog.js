let data = [];

function handleAddProject(event) {
  event.preventDefault();

  let name = document.getElementById("input-name").value;
  let startDate = document.getElementById("date-start").value;
  let endDate = document.getElementById("date-end").value;
  let description = document.getElementById("input-description").value;
  let checkbox = document.querySelectorAll(".form-checkbox:checked");
  let image = document.getElementById("input-file").files;
  image = URL.createObjectURL(image[0]);

  if (
    name == "" ||
    startDate == "" ||
    endDate == "" ||
    description == "" ||
    checkbox.length == 0 ||
    image == ""
  ) {
    return alert("Form tidak boleh kosong");
  }

  let start = new Date(startDate);
  let end = new Date(endDate);

  if (start > end) {
    return alert("End Date cannot be less than Start Date");
  }
  let times = end.getTime() - start.getTime();
  let milisecond = 1000;
  let secondInHours = 3600;
  let hoursInDays = 24;
  let days = times / (milisecond * secondInHours * hoursInDays);
  let weeks = Math.floor(days / 7);
  let months = Math.floor(weeks / 4);
  let years = Math.floor(months / 12);
  let duration = "";

  if (years > 0) {
    duration = `${years} Tahun`;
  } else if (months > 0) {
    duration = `${months} Bulan`;
  } else if (weeks > 0) {
    duration = `${weeks} Minggu`;
  } else {
    duration = `${days} Hari`;
  }

  let project = {
    name,
    startDate,
    endDate,
    postAt: new Date(),
    duration,
    description,
    checkbox,
    image,
  };

  data.push(project);
  console.log(data);

  // document.getElementById("card-project").innerHTML = "";

  renderProject();
}

function renderProject() {
  document.getElementById("card-project").innerHTML = "";
  for (let i = 0; i < data.length; i++) {
    document.getElementById("card-project").innerHTML += `
    <div class="row">
        <p class="project-post">${getFullTime(data[i].postAt)}</p>
        <img src="${data[i].image}" alt="" />
        <h3><a href="../project-detail.html" >${data[i].name}</a></h3>
        <p>durasi : ${data[i].duration}</p>
        <p class="description">${data[i].description}</p>
        <div class="icon">
          <i class="fa-brands fa-js" style="color: #000000"></i>
          <i class="fa-brands fa-react" style="color: #000000"></i>
          <i class="fa-brands fa-node" style="color: #000000"></i>
        </div>
        <p>${getDistance(data[i].postAt)}</p>
        <div class="button-group">
          <button>edit</button>
          <button>delete</button>
        </div>
    </div>
    `;
  }
}

function getFullTime(time) {
  let date = time.getDate();

  let monthIndex = time.getMonth();

  let year = time.getFullYear();

  let hours = time.getHours();

  let minutes = time.getMinutes();

  let month;
  switch (monthIndex) {
    case 1:
      month = "Jan";
      break;
    case 2:
      month = "Feb";
      break;
    case 3:
      month = "Mar";
      break;
    case 4:
      month = "Apr";
      break;
    case 5:
      month = "May";
      break;
    case 6:
      month = "Jun";
      break;
    case 7:
      month = "Jul";
      break;
    case 8:
      month = "Aug";
      break;
    case 9:
      month = "Sep";
      break;
    case 10:
      month = "Oct";
      break;
    case 11:
      month = "Nov";
      break;
    case 12:
      month = "Dec";
      break;
  }

  if (hours <= 9) {
    hours = "0" + hours;
  } else if (minutes <= 9) {
    minutes = "0" + minutes;
  }

  return `${date} ${month} ${year} ${hours}:${minutes} WIB`;
}

function getDistance(time) {
  let timeNow = new Date();
  let timePost = time;

  let distance = timeNow - timePost;

  let milisecond = 1000;
  let secondInHours = 3600;
  let hoursInDays = 24;

  let distanceDay = Math.floor(
    distance / (milisecond * secondInHours * hoursInDays)
  );
  let distanceHours = Math.floor(distance / (milisecond * 60 * 60));
  let distanceMinutes = Math.floor(distance / (milisecond * 60));
  let distanceSecond = Math.floor(distance / milisecond);

  if (distanceDay > 0) {
    return `${distanceDay} days ago`;
  } else if (distanceHours > 0) {
    return `${distanceHours} hours ago`;
  } else if (distanceMinutes > 0) {
    return `${distanceMinutes} minutes ago`;
  } else {
    return `${distanceSecond} seconds ago`;
  }
}

setInterval(function () {
  renderProject();
}, 1000);
