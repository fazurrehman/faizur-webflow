gsap.registerPlugin(ScrollTrigger);

const lenis = new Lenis();
lenis.on("scroll", (e) => {
  console.log(e);
});
function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

// Button animation
const animationConfig = { duration: 5, x: "-125%", repeat: -1, ease: "linear" };

// Get the container element
const marqueeContainer = document.querySelector(".js-btn-loop");

// Animate the container using GSAP
gsap.to(marqueeContainer, { ...animationConfig });

// Accordion Settings
const accSettings = {
  speed: 500, // Animation speed
  oneOpen: true, // Close all other accordion items if true
  offsetAnchor: true, // Activate scroll to top for active item
  offsetFromTop: 180, // In pixels – Scroll to top at what distance
  scrollTopDelay: 400, // In Milliseconds – Delay before scroll to top

  classes: {
    accordion: "js-accordion",
    header: "js-accordion-header",
    item: "js-accordion-item",
    body: "js-accordion-body",
    icon: "js-accordion-icon",
    active: "active"
  }
};

const prefix = accSettings.classes;

const accordion = (function () {
  const accordionElem = $(`.${prefix.accordion}`);
  const accordionHeader = accordionElem.find(`.${prefix.header}`);
  const accordionItem = $(`.${prefix.item}`);
  const accordionBody = $(`.${prefix.body}`);
  const accordionIcon = $(`.${prefix.icon}`);
  const activeClass = prefix.active;

  return {
    // pass configurable object literal
    init: function (settings) {
      accordionHeader.on("click", function () {
        accordion.toggle($(this));
        if (accSettings.offsetAnchor) {
          setTimeout(() => {
            $("html").animate(
              {
                scrollTop: $(this).offset().top - accSettings.offsetFromTop
              },
              accSettings.speed
            );
          }, accSettings.scrollTopDelay);
        }
      });

      $.extend(accSettings, settings);

      // ensure only one accordion is active if oneOpen is true
      if (settings.oneOpen && $(`.${prefix.item}.${activeClass}`).length > 1) {
        $(`.${prefix.item}.${activeClass}:not(:first)`)
          .removeClass(activeClass)
          .find(`.${prefix.header} > .${prefix.icon}`)
          .removeClass(activeClass);
      }
      // reveal the active accordion bodies
      $(`.${prefix.item}.${activeClass}`).find(`> .${prefix.body}`).show();
    },

    toggle: function ($this) {
      if (
        accSettings.oneOpen &&
        $this[0] !=
          $this
            .closest(accordionElem)
            .find(`> .${prefix.item}.${activeClass} > .${prefix.header}`)[0]
      ) {
        $this
          .closest(accordionElem)
          .find(`> .${prefix.item}`)
          .removeClass(activeClass)
          .find(accordionBody)
          .slideUp(accSettings.speed);
        $this
          .closest(accordionElem)
          .find(`> .${prefix.item}`)
          .find(`> .${prefix.header} > .${prefix.icon}`)
          .removeClass(activeClass);
      }

      // show/hide the clicked accordion item
      $this
        .closest(accordionItem)
        .toggleClass(`${activeClass}`)
        .find(`> .${prefix.header} > .${prefix.icon}`)
        .toggleClass(activeClass);
      $this.next().stop().slideToggle(accSettings.speed);
    }
  };
})();

$(document).ready(function () {
  accordion.init(accSettings);
});

document.addEventListener("DOMContentLoaded", function () {
  const copyButton = document.getElementById("copyButton");
  const copiedText = document.querySelector(".btn_copied");

  // Obfuscated email address (me@faizur.com)
  const email = ["m","e","@","f","a","i","z","u","r",".","c","o","m"].join("");
  let isEmailCopied = false;

  copyButton.addEventListener("click", function () {
    if (!isEmailCopied) {
      // Create a temporary input element to copy the email
      const tempInput = document.createElement("input");
      tempInput.value = email;
      document.body.appendChild(tempInput);

      // Select and copy the email text
      tempInput.select();
      document.execCommand("copy");
      document.body.removeChild(tempInput);

      // Change the button text to "Email Copied"
      copiedText.textContent = "Email Copied";
      isEmailCopied = true;
    }
  });

  copyButton.addEventListener("mouseout", function () {
    if (isEmailCopied) {
      // Reset the button text to "Copy Email" with a 200ms delay
      setTimeout(function () {
        copiedText.textContent = "Copy Email";
        isEmailCopied = false;
      }, 200);
    }
  });
});

// adding weather
function updatePragueTime() {
  const options = {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
    timeZone: "Europe/Prague"
  };
  const pragueTime = new Date().toLocaleString("en-US", options);
  document.getElementById("time").textContent = pragueTime;
}

function getWeather() {
  const apiKey = "d1e52eafe56386f1439142c04afc5b44";
  const city = "Prague";
  const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;

  fetch(weatherUrl)
    .then((response) => response.json())
    .then((data) => {
      const temperatureCelsius = (data.main.temp - 273.15).toFixed(1);
      document.getElementById(
        "temperature"
      ).textContent = `${temperatureCelsius}°C`;

      // Set the src attribute of the <img> element directly with the weather icon URL
      document.getElementById("weather-icon").src = getWeatherIcon(
        data.weather[0].main
      );
    })
    .catch((error) => {
      console.error("Error fetching weather data:", error);
      document.getElementById("temperature").textContent =
        "Temperature data unavailable";
    });
}

function getWeatherIcon(weatherCondition) {
  // Map weather conditions to icon URLs
  switch (weatherCondition) {
    case "Clear":
      return "https://res.cloudinary.com/fazurrehman/image/upload/v1697663904/weather-icon/clear.svg"; // Clear icon URL
    case "Clouds":
      return "https://res.cloudinary.com/fazurrehman/image/upload/v1697663904/weather-icon/clouds.svg"; // Clouds icon URL
    case "Rain":
      return "https://res.cloudinary.com/fazurrehman/image/upload/v1697663905/weather-icon/rain.svg"; // Rain icon URL
    case "Snow":
      return "https://res.cloudinary.com/fazurrehman/image/upload/v1697663904/weather-icon/snow.svg"; // Snow icon URL
    default:
      return "https://res.cloudinary.com/fazurrehman/image/upload/v1697663904/weather-icon/clear.svg"; // Default icon URL
  }
}

updatePragueTime();
getWeather();
setInterval(updatePragueTime, 1000);
setInterval(getWeather, 600000); // Update temperature and weather every 10 minutes (600,000 milliseconds)

// Create a GSAP timeline for the footer logo animation
const logoTimeline = gsap.timeline();

// Add animation to control skew and position
logoTimeline.from(".footer_logo", { skewY: -10, y: 500, duration: 0.8, ease: "power2.out" });
logoTimeline.to(".footer_logo", { skewY: 0, y: 0, duration: 0.8, ease: "power2.out" });

// Create a ScrollTrigger for the animation
ScrollTrigger.create({ animation: logoTimeline, trigger: ".footer", start: "top 50%", end: "bottom top" });

const splitTypes = document.querySelectorAll(".reveal-headline");
splitTypes.forEach((char, i) => {
  const text = new SplitType(char, { types: "words" });

  gsap.fromTo(
    text.words,
    {
      opacity: 0,
      y: 50,
      transformOrigin: "top"
    },
    {
      opacity: 1,
      y: 0,
      duration: 0.3,
      stagger: 0.02,
      duration: 0.5,
      scrollTrigger: {
        trigger: char,
        start: "top 90%",
        end: "top 20%",
        scrub: false
      }
    }
  );
});
