function handleSubmit() {
  let name = document.getElementById("input-name").value;
  let email = document.getElementById("input-email").value;
  let phoneNumber = document.getElementById("input-phonenumber").value;
  let subject = document.getElementById("subject").value;
  let message = document.getElementById("input-message").value;

  if (
    name == "" ||
    email == "" ||
    phoneNumber == "" ||
    subject == "" ||
    message == ""
  ) {
    return alert("Form tidak boleh kosong");
  }

  // let emailReceiver = "rizkyfauzi132@gmail.com";

  let a = document.createElement("a");
  a.href = `https://mail.google.com/mail/?view=cm&fs=1&to=${email}&su=${subject}&body=${message}`;
  a.click();

  let data = { name, email, phoneNumber, subject, message };
  console.log(data);
}
