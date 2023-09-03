import "bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

let testimonialData = [
  {
    author: "Abel Dustin",
    quote:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris eget metus euismod, convallis ex vel, hendrerit quam. Proin quis aliquam odio. Ut condimentum, enim nec elementum venenatis, dui diam sodales elit, porttitor auctor urna nisi sit amet elit. Maecenas aliquam fringilla quam quis tincidunt. Cras mollis ornare porta",
    image: "./image/gambar-coding.jpeg",
    rating: 3,
  },
  {
    author: "Cintara Surya",
    quote:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris eget metus euismod, convallis ex vel, hendrerit quam. Proin quis aliquam odio. Ut condimentum, enim nec elementum venenatis, dui diam sodales elit, porttitor auctor urna nisi sit amet elit. Maecenas aliquam fringilla quam quis tincidunt. Cras mollis ornare porta",
    image: "./image/gambar-coding.jpeg",
    rating: 5,
  },
  {
    author: "Abdul Kodir",
    quote:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris eget metus euismod, convallis ex vel, hendrerit quam. Proin quis aliquam odio. Ut condimentum, enim nec elementum venenatis, dui diam sodales elit, porttitor auctor urna nisi sit amet elit. Maecenas aliquam fringilla quam quis tincidunt. Cras mollis ornare porta",
    image: "./image/gambar-coding.jpeg",
    rating: 2,
  },
  {
    author: "Joko Slamet",
    quote:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris eget metus euismod, convallis ex vel, hendrerit quam. Proin quis aliquam odio. Ut condimentum, enim nec elementum venenatis, dui diam sodales elit, porttitor auctor urna nisi sit amet elit. Maecenas aliquam fringilla quam quis tincidunt. Cras mollis ornare porta",
    image: "./image/gambar-coding.jpeg",
    rating: 1,
  },
];

function allTestimonials() {
  let testimonialHTML = "";
  testimonialData.forEach((item) => {
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
}

allTestimonials();

function filterTestimonials(rating) {
  let testimonialHTML = "";

  const testimonialFiltered = testimonialData.filter(function (item) {
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
