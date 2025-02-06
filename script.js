document.addEventListener("DOMContentLoaded", () => {
    // Preloader
    const preloader = document.getElementById("preloader")
    const invitation = document.getElementById("invitation")
    let preloaderTimeout
  
    function hidePreloader() {
      preloader.style.opacity = "0"
      preloader.style.transition = "opacity 0.5s ease"
      setTimeout(() => {
        preloader.style.display = "none"
        invitation.classList.remove("hidden")
        animateInvitation()
      }, 500)
    }
  
    function animateInvitation() {
      const elements = document.querySelectorAll("#invitation > *")
      elements.forEach((el, index) => {
        el.style.opacity = "0"
        el.style.transform = "translateY(20px)"
        setTimeout(() => {
          el.style.transition = "opacity 0.5s ease, transform 0.5s ease"
          el.style.opacity = "1"
          el.style.transform = "translateY(0)"
        }, index * 200)
      })
  
      // Iniciar música de fondo
      const bgMusic = document.getElementById("bgMusic")
      if (bgMusic) {
        bgMusic.volume = 0.3
        bgMusic.play().catch((error) => console.log("Autoplay prevented:", error))
      }
    }
  
    // Establecer un tiempo máximo para el preloader
    preloaderTimeout = setTimeout(hidePreloader, 5000) // 5 segundos máximo
  
    window.addEventListener("load", () => {
      clearTimeout(preloaderTimeout)
      setTimeout(hidePreloader, 1000) // Esperar 1 segundo adicional después de la carga
    })
  
    // Fallback: si después de 10 segundos el preloader sigue visible, ocultarlo
    setTimeout(() => {
      if (!preloader.classList.contains("hidden")) {
        hidePreloader()
      }
    }, 10000)
  
    // Contador
    const countDownDate = new Date("Aug 15, 2023 19:00:00").getTime()
    const countdownFunction = setInterval(() => {
      const now = new Date().getTime()
      const distance = countDownDate - now
  
      const days = Math.floor(distance / (1000 * 60 * 60 * 24))
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((distance % (1000 * 60)) / 1000)
  
      document.getElementById("days").innerHTML = days
      document.getElementById("hours").innerHTML = hours
      document.getElementById("minutes").innerHTML = minutes
      document.getElementById("seconds").innerHTML = seconds
  
      // Actualizar círculos SVG
      updateCountdownCircle("days", days, 365)
      updateCountdownCircle("hours", hours, 24)
      updateCountdownCircle("minutes", minutes, 60)
      updateCountdownCircle("seconds", seconds, 60)
  
      if (distance < 0) {
        clearInterval(countdownFunction)
        document.getElementById("countdown").innerHTML = "<h4>¡El gran día ha llegado!</h4>"
      }
    }, 1000)
  
    function updateCountdownCircle(id, time, max) {
      const circle = document.getElementById(`${id}-circle`)
      if (circle) {
        const radius = circle.r.baseVal.value
        const circumference = radius * 2 * Math.PI
        const offset = circumference - (time / max) * circumference
        circle.style.strokeDasharray = `${circumference} ${circumference}`
        circle.style.strokeDashoffset = offset
      }
    }
  
    // Inicializar Swiper para el carrusel de la galería
    const gallerySwiper = new Swiper(".gallery-carousel", {
      effect: "coverflow",
      grabCursor: true,
      centeredSlides: true,
      slidesPerView: "auto",
      coverflowEffect: {
        rotate: 50,
        stretch: 0,
        depth: 100,
        modifier: 1,
        slideShadows: true,
      },
      pagination: {
        el: ".swiper-pagination",
      },
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      },
    })
  
    // OpenStreetMap
    const map = L.map("map").setView([19.4326, -99.1332], 13)
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map)
  
    L.marker([19.4326, -99.1332]).addTo(map).bindPopup('Salón de Eventos "El Edén"').openPopup()
  
    // Animaciones con GSAP y ScrollTrigger
    gsap.registerPlugin(ScrollTrigger)
  
    gsap.utils.toArray(".section").forEach((section) => {
      gsap.from(section, {
        opacity: 0,
        y: 50,
        duration: 1,
        scrollTrigger: {
          trigger: section,
          start: "top 80%",
          end: "bottom 20%",
          toggleActions: "play none none reverse",
        },
      })
    })
  
    gsap.from(".timeline-item", {
      opacity: 0,
      x: (index) => (index % 2 === 0 ? -50 : 50),
      stagger: 0.2,
      duration: 1,
      scrollTrigger: {
        trigger: ".timeline",
        start: "top 80%",
        end: "bottom 20%",
        toggleActions: "play none none reverse",
      },
    })
  
    // Formulario RSVP
    const rsvpForm = document.getElementById("rsvpForm")
    if (rsvpForm) {
      rsvpForm.addEventListener("submit", function (e) {
        e.preventDefault()
        const attendance = document.getElementById("attendance").value
  
        // Mostrar mensaje de agradecimiento
        this.innerHTML = '<h4 class="success-message">¡Gracias por confirmar!</h4>'
  
        // Esperar 2 segundos antes de redirigir a WhatsApp
        setTimeout(() => {
          let message = ""
          if (attendance === "si") {
            message = encodeURIComponent(
              "¡Hola! Confirmo mi asistencia a la celebración de XV años. ¡Gracias por la invitación!",
            )
          } else {
            message = encodeURIComponent(
              "¡Hola! Lamento no poder asistir a la celebración de XV años. ¡Que tengan una hermosa fiesta!",
            )
          }
          window.location.href = `https://wa.me/1234567890?text=${message}`
        }, 2000)
      })
    }
  
    // Navbar scroll
    const navbar = document.getElementById("navbar")
    let lastScrollTop = 0
  
    window.addEventListener("scroll", () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop
      if (scrollTop > lastScrollTop) {
        navbar.style.top = "-80px"
      } else {
        navbar.style.top = "0"
      }
      lastScrollTop = scrollTop
    })
  
    // Smooth scroll para los enlaces de navegación
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener("click", function (e) {
        e.preventDefault()
        const targetElement = document.querySelector(this.getAttribute("href"))
        if (targetElement) {
          targetElement.scrollIntoView({
            behavior: "smooth",
          })
        }
      })
    })
  })
  
  