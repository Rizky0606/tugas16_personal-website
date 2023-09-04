const express = require("express");
// const dataBlog = require("./fake-data");
const app = express();
const PORT = 5000;
const path = require("path");
const config = require("./src/config/config.json");
const { Sequelize, QueryTypes } = require("sequelize");
const sequelize = new Sequelize(config.development);
const bcrypt = require("bcrypt");
const session = require("express-session");
const flash = require("express-flash");
const upload = require("./src/middlewares/uploadFile");

// setup call hbs with sub folder
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "src/views"));

app.use(express.static("./src"));

app.use(express.urlencoded({ extended: false }));

app.use(flash());

app.use(
  session({
    cookie: {
      maxAge: 1000 * 60 * 60 * 2,
      secure: false,
      httpOnly: true,
    },
    store: new session.MemoryStore(),
    secret: "secretValue",
    saveUninitialized: true,
    resave: false,
  })
);

const home = async (req, res) => {
  try {
    let query = "";
    let obj = "";
    let data = "";

    if (req.session.idUser) {
      query = `SELECT "Blogs".id, title, image, "fullTime", content, node, react, golang, js, "Users".name AS author FROM "Blogs" LEFT JOIN "Users" ON "Blogs".author = "Users".id WHERE "Users".id = :idUser ORDER BY "Blogs".id DESC`;
      obj = await sequelize.query(query, {
        type: QueryTypes.SELECT,
        replacements: {
          idUser: req.session.idUser,
        },
      });

      data = obj.map((datas) => ({
        ...datas,
        isLogin: req.session.isLogin,
        user: req.session.user,
      }));
    } else {
      query = `SELECT "Blogs".id, title, image, "fullTime", content, node, react, golang, js, "Users".name AS author FROM "Blogs" LEFT JOIN "Users" ON "Blogs".author = "Users".id ORDER BY "Blogs".id DESC`;
      obj = await sequelize.query(query, { type: QueryTypes.SELECT });

      data = obj.map((datas) => ({
        ...datas,
        isLogin: req.session.isLogin,
        user: req.session.user,
      }));
    }

    res.render("index", {
      dataBlog: data,
      isLogin: req.session.isLogin,
      user: req.session.user,
    });
  } catch (error) {
    console.log(error);
  }
};

const blog = (req, res) => {
  if (!req.session.isLogin) {
    res.redirect("/login");
    return;
  }

  res.render("blog", {
    isLogin: req.session.isLogin,
    user: req.session.user,
  });
};

const contact = (req, res) => {
  res.render("contact", {
    isLogin: req.session.isLogin,
    user: req.session.user,
  });
};

const testimonial = (req, res) => {
  res.render("testimonial", {
    isLogin: req.session.isLogin,
    user: req.session.user,
  });
};

const addBlog = async (req, res) => {
  try {
    const postAt = new Date();
    const {
      inputName,
      inputDescription,
      dateStart,
      dateEnd,
      node,
      golang,
      react,
      javascript,
    } = req.body;
    const image = req.file.filename;
    const author = req.session.idUser;

    const query = `INSERT INTO "Blogs" (title, content, duration, "startDate", "endDate", image, "postAt", "fullTime", author, node, golang, react, js) VALUES ('${inputName}', '${inputDescription}', '${duration(
      dateStart,
      dateEnd
    )}', '${dateStart}' , '${dateEnd}', '${image}', NOW(), '${getFullTime(
      postAt
    )}', '${author}', ${node ? true : false}, ${golang ? true : false}, ${
      react ? true : false
    }, ${javascript ? true : false})`;

    await sequelize.query(query);

    res.redirect("/");
  } catch (error) {
    console.log(error);
  }
};

const detailBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const query = `SELECT "Blogs".id, title, content, "startDate", "endDate", image, "postAt", duration, node, golang, react, js, "Users".name AS author FROM "Blogs" LEFT JOIN "Users" ON "Blogs".author = "Users".id WHERE "Blogs".id=${id}`;
    let obj = await sequelize.query(query, { type: QueryTypes.SELECT });

    const data = obj.map((datas) => ({
      ...datas,
      isLogin: req.session.isLogin,
      user: req.session.user,
    }));

    res.render("project-detail", {
      data,
      isLogin: req.session.isLogin,
      user: req.session.user,
    });
  } catch (error) {
    console.log(error);
  }
};

const deleteBlog = async (req, res) => {
  try {
    const { id } = req.params;

    const query = `DELETE FROM "Blogs" WHERE id=${id}`;
    await sequelize.query(query);
    res.redirect("/");
  } catch (error) {
    console.log(error);
  }
};

const editBlog = async (req, res) => {
  try {
    if (!req.session.isLogin) {
      res.redirect("/login");
      return;
    }

    const { id } = req.params;
    const query = `SELECT * FROM "Blogs" WHERE id=${id}`;
    let obj = await sequelize.query(query, { type: QueryTypes.SELECT });

    const data = obj.map((datas) => ({
      ...datas,
      isLogin: req.session.isLogin,
      user: req.session.user,
    }));
    res.render("editBlog", {
      data: data[0],
      isLogin: req.session.isLogin,
      user: req.session.user,
    });
  } catch (error) {
    console.log(error);
  }
};

const updateBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      inputName,
      inputDescription,
      inputStartDate,
      inputEndDate,
      techNode,
      techGolang,
      techReact,
      techJavascript,
    } = req.body;
    const dateNow = new Date();

    const query = `UPDATE "Blogs" SET title='${inputName}', content='${inputDescription}', duration='${duration(
      inputStartDate,
      inputEndDate
    )} ', "startDate"='${inputStartDate}', "endDate"='${inputEndDate}', node=${
      techNode ? true : false
    }, golang=${techGolang ? true : false}, react=${
      techReact ? true : false
    }, js=${
      techJavascript ? true : false
    }, "postAt"=NOW(), "fullTime"='${getFullTime(dateNow)}' WHERE id=${id}`;
    await sequelize.query(query);

    res.redirect("/");
  } catch (error) {
    console.log(error);
  }
};

const register = (req, res) => {
  try {
    res.render("register");
  } catch (error) {
    console.log(error);
  }
};

const addUser = async (req, res) => {
  try {
    const { inputName, inputEmail, inputPassword } = req.body;

    // checking email
    const query = `SELECT * FROM "Users" WHERE email='${inputEmail}'`;
    let obj = await sequelize.query(query, { type: QueryTypes.SELECT });

    if (obj.length) {
      req.flash("danger", "Email has already exists");
      res.redirect("/register");
    } else {
      const salt = 10;
      await bcrypt.hash(inputPassword, salt, (err, hashPassword) => {
        const query = `INSERT INTO "Users" (name, email, password, "createdAt", "updatedAt") VALUES ('${inputName}', '${inputEmail}', '${hashPassword}', NOW(), NOW())`;
        sequelize.query(query);
        req.flash("succes", "Congrats, User succes created account");
        res.redirect("/login");
      });
    }
  } catch (error) {
    console.log(error);
  }
};

const login = (req, res) => {
  try {
    res.render("login");
  } catch (error) {
    console.log(error);
  }
};

const userLogin = async (req, res) => {
  try {
    const { inputEmail, inputPassword } = req.body;
    const query = `SELECT * FROM "Users" WHERE email='${inputEmail}'`;
    let obj = await sequelize.query(query, { type: QueryTypes.SELECT });

    // checking email
    if (!obj.length) {
      req.flash("danger", "User has not been registered");
      return res.redirect("/register");
    }

    // checking password
    await bcrypt.compare(inputPassword, obj[0].password, (err, result) => {
      if (!result) {
        req.flash("danger", "Wrong password");
        return res.redirect("/login");
      } else {
        req.session.isLogin = true;
        req.session.idUser = obj[0].id;
        req.session.user = obj[0].name;
        req.flash("succes", "Login Success");
        res.redirect("/");
      }
    });
  } catch (error) {
    console.log(error);
  }
};

const logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.log(err);
    }
    res.redirect("/");
  });
};
//
const getFullTime = (time) => {
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
};

const getDistance = (time) => {
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
};

const duration = (startDate, endDate) => {
  let start = new Date(startDate);
  let end = new Date(endDate);

  let times = end.getTime() - start.getTime();
  let milisecond = 1000;
  let secondInHours = 3600;
  let hoursInDays = 24;
  let days = times / (milisecond * secondInHours * hoursInDays);
  let weeks = Math.floor(days / 7);
  let months = Math.floor(weeks / 4);
  let years = Math.floor(months / 12);

  if (years > 0) {
    return `${years} Tahun`;
  } else if (months > 0) {
    return `${months} Bulan`;
  } else if (weeks > 0) {
    return `${weeks} Minggu`;
  } else {
    return `${days} Hari`;
  }
};

// rounting
// get
app.get("/", home);
app.get("/blog", blog);
app.get("/contact", contact);
app.get("/testimonial", testimonial);
app.get("/blogDetail/:id", detailBlog);
app.get("/editBlog/:id", editBlog);
app.get("/register", register);
app.get("/login", login);
app.get("/logout", logout);

// post
app.post("/blog", upload.single("uploadImage"), addBlog);
app.post("/editBlog/:id", updateBlog);
app.post("/register", addUser);
app.post("/login", userLogin);

// delete
app.get("/deleteBlog/:id", deleteBlog);

// local server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
