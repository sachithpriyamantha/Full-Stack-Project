const user_name = document.getElementById("user_name");
const data = JSON.parse(localStorage.getItem("userdata")) || {};


/*logout function*/

logout_btn.addEventListener("click", () => {
    Swal.fire({
        title: "Are you sure?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Logout!",
      }).then((result) => {
        if (result.isConfirmed) {
            localStorage.removeItem("userdata");
          Swal.fire("Logout Successfull!").then((res) => {
            if (res) {
              window.location.reload();
            }
          });
        }
      });
});

/*add event listener on multiple elements*/

const addEventOnElements = function (elements, eventType, callback) {
    for (let i = 0, len = elements.length; i < len; i++) {
        elements[i].addEventListener(eventType, callback);
    }
};

/*preloader will be visible until document load*/

const preloader = document.querySelector("[data-preloader]");

window.addEventListener("load", function () {
    preloader.classList.add("loaded");
    document.body.classList.add("loaded");
});

/*scroll function*/

const revealElements = document.querySelectorAll("[data-reveal]");

const revealElementOnScroll = function () {
    for (let i = 0, len = revealElements.length; i < len; i++) {
        if (
            revealElements[i].getBoundingClientRect().top <
            window.innerHeight / 1.15
        ) {
            revealElements[i].classList.add("revealed");
        } else {
            revealElements[i].classList.remove("revealed");
        }
    }
};

window.addEventListener("scroll", revealElementOnScroll);

window.addEventListener("load", revealElementOnScroll);

const feedbackButton = document.querySelector("#feedbackButton");
feedbackButton.addEventListener("click", ()=>{
    const inputData = document.querySelector("#inputEmail").value;

    if(inputData==""){
        return Swal.fire({
            icon: "info",
            text: "Fill all fields.",
            width: "27%",
        });
    }else{
        window.location.href ="../html/feedbackForm.html";
    }
})
