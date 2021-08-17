const form = document.getElementById("form");
const full_name = document.getElementById("full_name");
const phone = document.getElementById("phone");
const email = document.getElementById("email");
const stage = document.getElementById("pregnancy_stage");

form.addEventListener("submit", async function (e) {
  e.preventDefault();
  checkInputs();
  if (checkInputs()) {
    handleHubspot(this.elements);
    return;
  }
});

// Error Handling for User Input
function checkInputs() {
  // trim to remove the whitespaces
  const nameValue = full_name.value.trim();
  const phoneValue = phone.value.trim();
  const emailValue = email.value.trim();

  let allValid = false;

  if (nameValue === "") {
    setErrorFor(full_name, "Name cannot be blank");
  } else {
    setSuccessFor(full_name);
  }
  if (phoneValue === "") {
    setErrorFor(phone, "Phone Number cannot be blank");
  } else if (! /^[0-9]{11}$/.test(phoneValue)) {
    setErrorFor(phone, "Phone Number is not valid");
  }
  else {
    setSuccessFor(phone);
  }
  if (emailValue === "") {
    setErrorFor(email, "Email cannot be blank");
  } else if (!isEmail(emailValue)) {
    setErrorFor(email, "Not a valid email");
  } else {
    setSuccessFor(email);
    allValid = true;
  }
  if (stage.value === "Select") {
    setErrorFor(stage, "Please Select Pregnancy Stage");
    allValid = false;
  } else {
    setSuccessFor(stage);
  }
  return allValid;
}

//   Check email validity
function isEmail(email) {
  let emailRegex = new RegExp(
    "^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:.[a-zA-Z0-9-]+)*$"
  );

  return emailRegex.test(email);
}

function setErrorFor(input, message) {
  const formControl = input.parentElement;
  const small = formControl.querySelector("small");

  formControl.className = "input-group error";
  small.innerText = message;
}

function setSuccessFor(input) {
  const formControl = input.parentElement;
  formControl.className = "input-group success";
}

async function handleHubspot(elements) {
  const hubspotApiUrl =
    "https://api.hsforms.com/submissions/v3/integration/submit/9351598/3e1ad7dc-4553-4e73-a1a6-3ffbe61415e2";
  const formElements = Array.from(elements);
  let formValues = [];
  for (const element of formElements) {
    if (element.tagName === "BUTTON") {
      continue;
    }

    formValues.push({ name: element.name, value: element.value });
  }

  const hubspotData = {
    submittedAt: Date.now(),
    fields: formValues,
    context: {
      pageUri: "www.example.com/page",
      pageName: "Example page",
    },
    legalConsentOptions: {
      consent: {
        // Include this object when GDPR options are enabled
        consentToProcess: true,
        text:
          "I agree to allow Babybliss to store and process my personal data.",
        communications: [
          {
            value: true,
            subscriptionTypeId: 999,
            text: "I agree to receive marketing communications from Babybliss.",
          },
        ],
      },
    },
  };

  //   console.log(hubspotData);

  try {
    const data = await fetch(hubspotApiUrl, {
      body: JSON.stringify(hubspotData),
      method: "post",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    window.location.href = "/hospitallist.pdf";
    // console.log(data);
    // console.log("Submitted");
  } catch (error) {
    alert("An error occured. Please try again.");
    console.log(error);
  }
}
