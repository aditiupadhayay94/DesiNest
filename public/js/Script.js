(() => {
    'use strict'
  
    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    const forms = document.querySelectorAll('.needs-validation')
  
    // Loop over them and prevent submission
    Array.from(forms).forEach(form => {
      form.addEventListener('submit', event => {
        if (!form.checkValidity()) {
          event.preventDefault()
          event.stopPropagation()
        }
  
        form.classList.add('was-validated')
      }, false)
    })
  })();

  document.addEventListener("DOMContentLoaded", function () {
    const scrollContainer = document.querySelector("[data-scroll-container]");
    
    if (scrollContainer) {
      const scroll = new LocomotiveScroll({
        el: scrollContainer,
        smooth: true,
        multiplier: 1.2, // Optional: adjust scroll speed
        class: "is-reveal" // Optional: animation trigger class
      });
    }
  });