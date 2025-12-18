$(document).ready(function () {
  const form = $(".needs-validation");

  // Live validation
  form.find("input, select").on("blur change input", function () {
    validateField($(this));
  });

  // Validation function
  function validateField($field) {
    const id = $field.attr("id");
    let val = $field.val().trim();
    let valid = true;

    // Reset classes
    $field.removeClass("is-valid is-invalid");

    switch (id) {
      case "firstName":
      case "lastName":
        valid = /^[A-Za-z]{3,}$/.test(val); 
        break;

      case "email":
        valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
        break;

      case "phone":
        valid = /^\d{1,9}$/.test(val);
        break;

      case "address":
      case "city":
        valid = val.length > 0;
        break;

      case "postal":
        valid = /^[A-Za-z0-9]{1,6}$/.test(val);
        break;

      case "country":
      case "countryCode":
        valid = val !== "";
        break;
    }

    // Apply feedback classes
    if (valid) {
      $field.addClass("is-valid");
      $field.removeClass("is-invalid");
    } else {
      $field.addClass("is-invalid");
      $field.removeClass("is-valid");
    }

    return valid;
  }

  // Scroll to first invalid
  function scrollToError() {
    const firstInvalid = $(".is-invalid").first();
    if (firstInvalid.length) {
      $("html, body").animate(
        { scrollTop: firstInvalid.offset().top - 100 },
        600
      );
    }
  }

  // On Continue to Payment
  $("#paymentBtn").on("click", function (e) {
    e.preventDefault();
    let allValid = true;

    form.find("input[required], select[required]").each(function () {
      if (!validateField($(this))) {
        allValid = false;
      }
    });

    if (!$("#terms").is(":checked")) {
      alert("Please agree to the terms and conditions before continuing!");
      allValid = false;
    }

    if (!allValid) {
      scrollToError();
      return;
    }

    // Save order
    const orderData = {
      name: $("#firstName").val() + " " + $("#lastName").val(),
      email: $("#email").val(),
      phone: $("#countryCode").val() + " " + $("#phone").val(),
      address:
        $("#address").val() +
        ", " +
        $("#city").val() +
        ", " +
        $("#country").val() +
        " - " +
        $("#postal").val(),
      cart: JSON.parse(localStorage.getItem("cartItems")) || [],
    };

    localStorage.setItem("orderData", JSON.stringify(orderData));
    window.location.href = "/payment";
  });

  // Enable/disable payment button
  $("#terms").on("change", function () {
    $("#paymentBtn").prop("disabled", !$(this).is(":checked"));
  });

  // Prevent entering invalid chars for phone & postal
  $("#phone").on("input", function () {
    this.value = this.value.replace(/\D/g, "").slice(0, 9); // digits only, max 9
  });

  $("#postal").on("input", function () {
    this.value = this.value.replace(/[^A-Za-z0-9]/g, "").slice(0, 6); // alphanumeric, max 6
  });

  $("#firstName, #lastName").on("input", function () {
    this.value = this.value.replace(/[^A-Za-z]/g, ""); // letters only
  });



   // Restrict Card Name → Only letters & spaces
    $("#cardName").on("input", function () {
        this.value = this.value.replace(/[^A-Za-z ]/g, '');
    });

    // Restrict Card Number → Only digits, max 16
    $("#cardNumber").on("input", function () {
        this.value = this.value.replace(/\D/g, ''); // remove non-digits
        if (this.value.length > 16) this.value = this.value.slice(0, 16);
    });

    // Restrict CVV → Only digits, max 3
    $("#cvv").on("input", function () {
        this.value = this.value.replace(/\D/g, '');
        if (this.value.length > 3) this.value = this.value.slice(0, 3);
    });

    // Restrict Expiry → MM/YY format while typing
    $("#expiry").on("input", function () {
        let val = this.value.replace(/[^0-9\/]/g, ''); // allow digits and slash
        if (val.length === 2 && !val.includes("/")) val = val + '/'; // auto-add slash
        if (val.length > 5) val = val.slice(0, 5); // max 5 chars
        this.value = val;
    });

    $("#paymentForm").on("submit", function (e) {
        e.preventDefault();
        let isValid = true;

        $("input, select").removeClass("is-invalid");

        // Validate Payment Method
        if ($("#paymentMethod").val() === "") {
            $("#paymentMethod").addClass("is-invalid");
            isValid = false;
        }

        // If card selected → validate card fields
        if ($("#paymentMethod").val() === "Card") {
            let name = $("#cardName").val().trim();
            let cardNumber = $("#cardNumber").val().trim();
            let expiry = $("#expiry").val().trim();
            let cvv = $("#cvv").val().trim();

            if (name.length < 2) { 
                $("#cardName").addClass("is-invalid");
                isValid = false;
            }

            if (!/^\d{16}$/.test(cardNumber)) {
                $("#cardNumber").addClass("is-invalid");
                isValid = false;
            }

            // Expiry MM/YY → month 01-12, year 00-99
            if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(expiry)) {
                $("#expiry").addClass("is-invalid");
                isValid = false;
            }

            if (!/^\d{3}$/.test(cvv)) {
                $("#cvv").addClass("is-invalid");
                isValid = false;
            }
        }

        // Validate Terms
        if (!$("#terms").is(":checked")) {
            $("#terms").addClass("is-invalid");
            isValid = false;
        }

        // Everything valid
        if (isValid) {
            alert(" Your order has been placed successfully!");
            this.submit(); // optional, for actual submission
        }
    });
});
