// constants 

let today = new Date()
const pictureOfTheDayURI = 'https://api.nasa.gov/planetary/apod?api_key=Eja2wKokHAlZqpnulA7GXhMyRgJhp7saFdZlqLxe'
const asteroidsURI = `https://api.nasa.gov/neo/rest/v1/feed?start_date=${today.getFullYear()}-0${(today.getMonth()+1)}-0${today.getDate()}&end_date=${today.getFullYear()}-${(0 + today.getMonth()+1)}-${today.getDate() + 1}&api_key=Eja2wKokHAlZqpnulA7GXhMyRgJhp7saFdZlqLxe`
const marsRoverURI = 'https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?earth_date=2015-6-3&api_key=Eja2wKokHAlZqpnulA7GXhMyRgJhp7saFdZlqLxe'
const astrosURI = 'http://api.open-notify.org/astros.json'
const imageSection = document.querySelector('.iotd')
const asteroidContainer = document.querySelector('.wrapper.asteroids')
const roverPhotosContainer = document.querySelector('.rover-photos')
const astronaughtContainer = document.querySelector('.astros-container')
const astroNumber = document.querySelector('.num-of-astros')
const ctaBtn = document.querySelector('.main-btn')
const asteroidUnderline = document.querySelector('.underline')
const earthIcon = document.querySelector('.earth-icon')

// api

function get(url) {
    return fetch(url).then(resp => resp.json())
}

// functions

// create image of the day 

function createImageOfTheDay(image) {
    const h2 = document.createElement('h2')
    h2.classList.add('iotd-title')
    h2.textContent = image.title
    imageSection.append(h2)

    if (image.media_type === 'video') {
        const iframe = document.createElement('iframe')
        iframe.setAttribute("src", image.url)
        iframe.setAttribute('height', '400px')
        iframe.classList.add('daily-image')
        imageSection.append(iframe)
    } else {
        const img = document.createElement('img')
        img.classList.add('daily-image')
        img.src = image.url
        imageSection.append(img)
    }

    const p = document.createElement('p')
    p.classList.add('iotd-description')
    p.textContent = image.explanation

    imageSection.append(p)
}

// render image of the day 

function renderImage() {
    get(pictureOfTheDayURI).then(createImageOfTheDay)
}

// create asteroids

function createAsteroid(asteroid) {
    const div = document.createElement('div')
    div.classList.add('asteroid')

    const p = document.createElement('p')
    p.classList.add('asteroid-name')
    p.style.display = 'none'
    p.textContent = asteroid.name

    const img = document.createElement('img')
    img.classList.add('asteroid-icon')
    if (asteroid.is_potentially_hazardous_asteroid === true) {
        img.src = '/images/asteroid_danger.svg'
    } else {
        img.src = '/images/asteroid_safe.svg'
    }

    div.append(img, p)
    asteroidContainer.append(div)

    img.addEventListener('click', () => {
        document.querySelectorAll('.asteroid').forEach(asteroid => asteroid.children[1].style.display = 'none')
        p.style.display = 'block'
    })
}

// render asteroids

function renderAsteroids() {
    get(asteroidsURI).then(obj => {
        let asteroids = obj.near_earth_objects[Object.keys(obj.near_earth_objects)[0]].concat(obj.near_earth_objects[Object.keys(obj.near_earth_objects)[1]])
        asteroids.forEach(createAsteroid)
    })
}

// create mars rover photos

function createRoverPhoto(photo) {
    const img = document.createElement('img')
    img.classList.add('rover-photo')
    img.src = photo.img_src

    roverPhotosContainer.append(img)
}

// render mars rover photos

function renderRoverPhotos() {
    get(marsRoverURI).then(obj => {
        obj.photos.forEach(createRoverPhoto)
    })
}

// create astronaughts

function createAstronaughts(astro) {
    const div = document.createElement('div')
    div.classList.add('astronaught')

    const p = document.createElement('p')
    p.classList.add('astro-name')
    p.textContent = astro.name

    const pCraft = document.createElement('p')
    pCraft.classList.add('astro-craft')
    pCraft.textContent = astro.craft

    const img = document.createElement('img')
    img.classList.add('astro-icon')
    img.src = '/images/astronaut.svg'

    div.append(p, pCraft, img)
    astronaughtContainer.append(div)
}

// render astronaughts

function renderAstronaughts() {
    get(astrosURI).then(obj => {
        astroNumber.textContent = obj.people.length
        obj.people.forEach(createAstronaughts)
    })
}

// event listeners

ctaBtn.addEventListener("mouseover", () => {
    gsap.to(".main-illustration", 2, { y: -50, x: -50, rotate: -60, ease: "elastic" })
});

ctaBtn.addEventListener('mouseout', () => {
    gsap.to(".main-illustration", 2, { y: 0, x: 0, rotate: -45, ease: "elastic" })
})

asteroidUnderline.addEventListener('click', () => {
    earthIcon.style.display = 'block'
    document.querySelectorAll('.asteroid').forEach(asteroid => {
        asteroid.style.display = 'block'
    })
    let tl = gsap.timeline()
    tl.to(".asteroid-warning", .3, { opacity: 0 })
    tl.to('.meteor', .1, { opacity: 0 })
    tl.to('.meteor-2', .1, { opacity: 0 })
    tl.from(".earth-icon", 1, { scale: 0, ease: "elastic" })
    tl.to(".asteroid-icon", 2, { x: "random(-300, 300, 20)", y: "random(-300, 300, 20)", opacity: 1, stagger: .1, ease: 'elastic', rotate: 360 })
})

// initialize app

function init() {
    renderImage()
    renderAsteroids()
    renderRoverPhotos()
    renderAstronaughts()
}

init()