/*
	Phantom by HTML5 UP
	html5up.net | @ajlkn
	Free for personal and commercial use under the CCA 3.0 license (html5up.net/license)
*/

(function ($) {
  var $window = $(window),
    $body = $("body");

  // Breakpoints.
  breakpoints({
    xlarge: ["1281px", "1680px"],
    large: ["981px", "1280px"],
    medium: ["737px", "980px"],
    small: ["481px", "736px"],
    xsmall: ["361px", "480px"],
    xxsmall: [null, "360px"],
  });

  // Play initial animations on page load.
  $window.on("load", function () {
    window.setTimeout(function () {
      $body.removeClass("is-preload");
    }, 100);
  });

  // Touch?
  if (browser.mobile) $body.addClass("is-touch");

  // Forms.
  var $form = $("form");

  // Auto-resizing textareas.
  $form.find("textarea").each(function () {
    var $this = $(this),
      $wrapper = $('<div class="textarea-wrapper"></div>'),
      $submits = $this.find('input[type="submit"]');

    $this
      .wrap($wrapper)
      .attr("rows", 1)
      .css("overflow", "hidden")
      .css("resize", "none")
      .on("keydown", function (event) {
        if (event.keyCode == 13 && event.ctrlKey) {
          event.preventDefault();
          event.stopPropagation();

          $(this).blur();
        }
      })
      .on("blur focus", function () {
        $this.val($.trim($this.val()));
      })
      .on("input blur focus --init", function () {
        $wrapper.css("height", $this.height());

        $this
          .css("height", "auto")
          .css("height", $this.prop("scrollHeight") + "px");
      })
      .on("keyup", function (event) {
        if (event.keyCode == 9) $this.select();
      })
      .triggerHandler("--init");

    // Fix.
    if (browser.name == "ie" || browser.mobile)
      $this.css("max-height", "10em").css("overflow-y", "auto");
  });

  // Menu.
  var $menu = $("#menu");

  $menu.wrapInner('<div class="inner"></div>');

  $menu._locked = false;

  $menu._lock = function () {
    if ($menu._locked) return false;

    $menu._locked = true;

    window.setTimeout(function () {
      $menu._locked = false;
    }, 350);

    return true;
  };

  $menu._show = function () {
    if ($menu._lock()) $body.addClass("is-menu-visible");
  };

  $menu._hide = function () {
    if ($menu._lock()) $body.removeClass("is-menu-visible");
  };

  $menu._toggle = function () {
    if ($menu._lock()) $body.toggleClass("is-menu-visible");
  };

  $menu
    .appendTo($body)
    .on("click", function (event) {
      event.stopPropagation();
    })
    .on("click", "a", function (event) {
      var href = $(this).attr("href");

      event.preventDefault();
      event.stopPropagation();

      // Hide.
      $menu._hide();

      // Redirect.
      if (href == "#menu") return;

      window.setTimeout(function () {
        window.location.href = href;
      }, 350);
    })
    .append('<a class="close" href="#menu">Close</a>');

  $body
    .on("click", 'a[href="#menu"]', function (event) {
      event.stopPropagation();
      event.preventDefault();

      // Toggle.
      $menu._toggle();
    })
    .on("click", function (event) {
      // Hide.
      $menu._hide();
    })
    .on("keydown", function (event) {
      // Hide on escape.
      if (event.keyCode == 27) $menu._hide();
    });
})(jQuery);

// CAROUSEL
const carousel = document.querySelector(".carousel"),
  firstImg = carousel.querySelectorAll("img")[0],
  arrowIcons = document.querySelectorAll(".wrapper i");

let isDragStart = false,
  isDragging = false,
  prevPageX,
  prevScrollLeft,
  positionDiff;

const showHideIcons = () => {
  // showing and hiding prev/next icon according to carousel scroll left value
  let scrollWidth = carousel.scrollWidth - carousel.clientWidth; // getting max scrollable width
  arrowIcons[0].style.display = carousel.scrollLeft == 0 ? "none" : "block";
  arrowIcons[1].style.display =
    carousel.scrollLeft == scrollWidth ? "none" : "block";
};

arrowIcons.forEach((icon) => {
  icon.addEventListener("click", () => {
    let firstImgWidth = firstImg.clientWidth + 14; // getting first img width & adding 14 margin value
    // if clicked icon is left, reduce width value from the carousel scroll left else add to it
    carousel.scrollLeft += icon.id == "left" ? -firstImgWidth : firstImgWidth;
    setTimeout(() => showHideIcons(), 60); // calling showHideIcons after 60ms
  });
});

const autoSlide = () => {
  // if there is no image left to scroll then return from here
  if (
    carousel.scrollLeft - (carousel.scrollWidth - carousel.clientWidth) > -1 ||
    carousel.scrollLeft <= 0
  )
    return;

  positionDiff = Math.abs(positionDiff); // making positionDiff value to positive
  let firstImgWidth = firstImg.clientWidth + 14;
  // getting difference value that needs to add or reduce from carousel left to take middle img center
  let valDifference = firstImgWidth - positionDiff;

  if (carousel.scrollLeft > prevScrollLeft) {
    // if user is scrolling to the right
    return (carousel.scrollLeft +=
      positionDiff > firstImgWidth / 3 ? valDifference : -positionDiff);
  }
  // if user is scrolling to the left
  carousel.scrollLeft -=
    positionDiff > firstImgWidth / 3 ? valDifference : -positionDiff;
};

const dragStart = (e) => {
  // updatating global variables value on mouse down event
  isDragStart = true;
  prevPageX = e.pageX || e.touches[0].pageX;
  prevScrollLeft = carousel.scrollLeft;
};

const dragging = (e) => {
  // scrolling images/carousel to left according to mouse pointer
  if (!isDragStart) return;
  e.preventDefault();
  isDragging = true;
  carousel.classList.add("dragging");
  positionDiff = (e.pageX || e.touches[0].pageX) - prevPageX;
  carousel.scrollLeft = prevScrollLeft - positionDiff;
  showHideIcons();
};

const dragStop = () => {
  isDragStart = false;
  carousel.classList.remove("dragging");

  if (!isDragging) return;
  isDragging = false;
  autoSlide();
};

carousel.addEventListener("mousedown", dragStart);
carousel.addEventListener("touchstart", dragStart);

document.addEventListener("mousemove", dragging);
carousel.addEventListener("touchmove", dragging);

document.addEventListener("mouseup", dragStop);
carousel.addEventListener("touchend", dragStop);

// New code to handle image zoom
// const zoomImage = (e) => {
//   const clickedImg = e.target;
//   const zoomedImg = clickedImg.cloneNode();
//   const overlay = document.createElement("div");
//   overlay.classList.add("overlay");
//   overlay.addEventListener("click", () => {
//     overlay.remove();
//   });

//   zoomedImg.classList.add("zoomed-img");
//   overlay.appendChild(zoomedImg);
//   document.body.appendChild(overlay);
// };

// const images = document.querySelectorAll(".carousel img");
// images.forEach((img) => {
//   console.log(img);
//   img.addEventListener("click", zoomImage);
// });

// const zoomCarousel = (e) => {
//   const carousel = e.target.closest(".wrapper"); // Find the closest carousel container

//   if (carousel) {
//     const zoomedCarousel = carousel.cloneNode(true); // Clone the entire carousel container
//     const overlay = document.createElement("div");
//     overlay.classList.add("overlay");
//     overlay.addEventListener("click", () => {
//       overlay.remove();
//     });

//     zoomedCarousel.classList.add("zoomed-img");
//     overlay.appendChild(zoomedCarousel);
//     document.body.appendChild(overlay);
//   }
// };

// const carousels = document.querySelectorAll(".wrapper .carousel");
// carousels.forEach((carousel) => {
//   console.log(carousel);
//   carousel.addEventListener("click", zoomCarousel);
// });

let currentImageIndex = 0; // Track the currently displayed image index

const zoomCarousel = (e) => {
  const carousel = e.target.closest(".wrapper"); // Find the closest carousel container

  if (carousel) {
    const images = carousel.querySelectorAll(".carousel img");
    const overlay = document.createElement("div");
    overlay.classList.add("overlay");

    const closeButton = document.createElement("span");
    closeButton.innerHTML = "&#x2716;"; // Unicode "X" symbol
    closeButton.classList.add("close-button");
    closeButton.addEventListener("click", () => {
      overlay.remove();
    });

    const carouselContainer = document.createElement("div");
    carouselContainer.classList.add("zoomed-carousel-container");

    const imageElement = document.createElement("img");
    imageElement.classList.add("zoomed-img");
    imageElement.src = images[currentImageIndex].src;

    const prevButton = document.createElement("button");
    prevButton.innerHTML = "&#10094;"; // Unicode left arrow
    prevButton.classList.add("carousel-nav");
    prevButton.addEventListener("click", () => {
      currentImageIndex =
        (currentImageIndex - 1 + images.length) % images.length;
      imageElement.src = images[currentImageIndex].src;
    });

    const nextButton = document.createElement("button");
    nextButton.innerHTML = "&#10095;"; // Unicode right arrow
    nextButton.classList.add("carousel-nav");
    nextButton.addEventListener("click", () => {
      currentImageIndex = (currentImageIndex + 1) % images.length;
      imageElement.src = images[currentImageIndex].src;
    });

    carouselContainer.appendChild(prevButton);
    carouselContainer.appendChild(imageElement);
    carouselContainer.appendChild(nextButton);
    overlay.appendChild(closeButton);
    overlay.appendChild(carouselContainer);
    document.body.appendChild(overlay);
  }
};

const carousels = document.querySelectorAll(".wrapper img");
carousels.forEach((carousel) => {
  carousel.addEventListener("click", zoomCarousel);
});
