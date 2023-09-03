const testimonial = new Promise((resolve, reject) => {
  const xhr = new XMLHttpRequest();

  xhr.open("GET", "https://api.npoint.io/a3b74e8463f782b22256", true);

  xhr.onload = () => {
    if (xhr.status == 200) {
      resolve(JSON.parse(xhr.response));
    } else {
      reject("Error");
    }
  };

  xhr.onerror = () => {
    reject("Network Error");
  };

  xhr.send();
});

async function allTestimonials() {
  const response = await testimonial;
  try {
    let testimonialHTML = "";
    response.forEach((item) => {
      testimonialHTML += `
              <div class="card-testimonial">
                <img src="${item.image}" alt="" />
                <p class="author">${item.author}</p>
                <p class="quote">${item.quote}</p>
                <p class="rating"><i class="fa-solid fa-star" style="color: #fae900;"></i> ${item.rating}</p>
              </div>
            `;
    });

    document.getElementById("testimonials").innerHTML = testimonialHTML;
  } catch (err) {
    console.log(err);
  }
}

allTestimonials();

async function filterTestimonials(rating) {
  const response = await testimonial;
  let testimonialHTML = "";

  const testimonialFiltered = response.filter(function (item) {
    return item.rating === rating;
  });

  if (testimonialFiltered.length === 0) {
    testimonialHTML = `<h1 style="text-align: center">Data Not Found</h1>`;
  } else {
    testimonialFiltered.map((item) => {
      testimonialHTML += `
          <div class="card-testimonial">
            <img src="${item.image}" alt="" />
            <p class="author">${item.author}</p>
            <p class="quote">${item.quote}</p>
            <p class="rating"><i class="fa-solid fa-star" style="color: #fae900;"></i> ${item.rating}</p>
        </div>
        `;
    });
  }

  document.getElementById("testimonials").innerHTML = testimonialHTML;
}
