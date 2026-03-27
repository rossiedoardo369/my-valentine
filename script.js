const gifStages = [
    "https://media.tenor.com/EBV7OT7ACfwAAAAj/u-u-qua-qua-u-quaa.gif",
    "https://media1.tenor.com/m/uDugCXK4vI4AAAAd/chiikawa-hachiware.gif",
    "https://media.tenor.com/f_rkpJbH1s8AAAAj/somsom1012.gif",
    "https://media.tenor.com/OGY9zdREsVAAAAAj/somsom1012.gif",
    "https://media1.tenor.com/m/WGfra-Y_Ke0AAAAd/chiikawa-sad.gif",
    "https://media.tenor.com/CivArbX7NzQAAAAj/somsom1012.gif",
    "https://media.tenor.com/5_tv1HquZlcAAAAj/chiikawa.gif",
    "https://media1.tenor.com/m/uDugCXK4vI4AAAAC/chiikawa-hachiware.gif"
]

const noMessages = [
    "No",
    "Are you positive? 🤔",
    "Pookie please... 🥺",
    "If you say no, I will be really sad...",
    "I will be very sad... 😢",
    "Please??? 💔",
    "Don't do this to me...",
    "Last chance! 😭",
    "You can't catch me anyway 😜"
]

const yesTeasePokes = [
    "try saying no first... I bet you want to know what happens 😏",
    "go on, hit no... just once 👀",
    "you're missing out 😈",
    "click no, I dare you 😏"
]

let yesTeasedCount = 0
let noClickCount = 0
let runawayEnabled = false
let musicPlaying = false
let musicStarted = false

const music = document.getElementById('bg-music')
const musicToggle = document.getElementById('music-toggle')

music.volume = 0.3

// ─── MUSICA ──────────────────────────────────────────────────────────────────

function startMusic() {
    if (musicStarted) return
    musicStarted = true
    music.play()
        .then(() => {
            musicPlaying = true
            musicToggle.textContent = '🔊'
        })
        .catch(() => {
            // Browser ha bloccato: riprova al prossimo click
            musicStarted = false
        })
}

function toggleMusic() {
    if (!musicStarted) {
        startMusic()
        return
    }
    if (musicPlaying) {
        music.pause()
        musicPlaying = false
        musicToggle.textContent = '🔇'
    } else {
        music.play()
        musicPlaying = true
        musicToggle.textContent = '🔊'
    }
}

// ─── YES ─────────────────────────────────────────────────────────────────────

function handleYesClick() {
    startMusic()

    // Blocco: Yes funziona solo dopo 8+ click su No
    if (noClickCount < 8) {
        const msg = yesTeasePokes[Math.min(yesTeasedCount, yesTeasePokes.length - 1)]
        yesTeasedCount++
        showTeaseMessage(msg)
        return
    }

    showYesPage()
}

function showYesPage() {
    const container = document.querySelector('.container')
    container.style.transition = 'opacity 0.5s ease'
    container.style.opacity = '0'

    setTimeout(() => {
        document.title = 'Yay! 🎉'
        container.innerHTML = `
            <h1 class="yes-title">Knew you would say yes! 🎉</h1>
            <div class="gif-container">
                <img id="cat-gif" src="https://media.tenor.com/eNHbizSfVb0AAAAj/lovemode-cute.gif" alt="celebrating">
            </div>
            <p class="yes-message">You just made me the happiest person! 💕</p>
        `
        container.classList.add('yes-container')
        container.style.opacity = '1'
        launchConfetti()
    }, 500)
}

// ─── CONFETTI ────────────────────────────────────────────────────────────────

function launchConfetti() {
    if (typeof confetti === 'undefined') {
        const s = document.createElement('script')
        s.src = 'https://cdn.jsdelivr.net/npm/canvas-confetti@1.9.2/dist/confetti.browser.min.js'
        s.onload = startConfetti
        document.head.appendChild(s)
    } else {
        startConfetti()
    }
}

function startConfetti() {
    const colors = ['#ff69b4', '#ff1493', '#ff85a2', '#ffb3c1', '#ff0000', '#ff6347', '#fff', '#ffdf00']
    const end = Date.now() + 6000

    confetti({ particleCount: 150, spread: 100, origin: { x: 0.5, y: 0.3 }, colors })

    const interval = setInterval(() => {
        if (Date.now() > end) { clearInterval(interval); return }
        confetti({ particleCount: 40, angle: 60,  spread: 55, origin: { x: 0, y: 0.6 }, colors })
        confetti({ particleCount: 40, angle: 120, spread: 55, origin: { x: 1, y: 0.6 }, colors })
    }, 300)
}

// ─── TOAST ───────────────────────────────────────────────────────────────────

function showTeaseMessage(msg) {
    const toast = document.getElementById('tease-toast')
    toast.textContent = msg
    toast.classList.add('show')
    clearTimeout(toast._timer)
    toast._timer = setTimeout(() => toast.classList.remove('show'), 2500)
}

// ─── NO ──────────────────────────────────────────────────────────────────────

function handleNoClick() {
    startMusic()
    noClickCount++

    // Messaggio sul bottone No
    const msgIndex = Math.min(noClickCount, noMessages.length - 1)
    document.getElementById('no-btn').textContent = noMessages[msgIndex]

    // Ingrandisci Yes
    const yesBtn = document.getElementById('yes-btn')
    const currentSize = parseFloat(window.getComputedStyle(yesBtn).fontSize)
    yesBtn.style.fontSize = `${currentSize * 1.35}px`
    yesBtn.style.padding = `${Math.min(18 + noClickCount * 5, 60)}px ${Math.min(45 + noClickCount * 10, 120)}px`

    // Rimpicciolisci No
    if (noClickCount >= 2) {
        const noBtn = document.getElementById('no-btn')
        const noSize = parseFloat(window.getComputedStyle(noBtn).fontSize)
        noBtn.style.fontSize = `${Math.max(noSize * 0.85, 10)}px`
    }

    // Cambia GIF
    swapGif(gifStages[Math.min(noClickCount, gifStages.length - 1)])

    // Abilita runaway a 8 click
    if (noClickCount >= 8 && !runawayEnabled) {
        enableRunaway()
        runawayEnabled = true
    }
}

// ─── GIF ─────────────────────────────────────────────────────────────────────

function swapGif(src) {
    const gif = document.getElementById('cat-gif')
    gif.style.opacity = '0'
    setTimeout(() => {
        gif.src = src
        gif.style.opacity = '1'
    }, 200)
}

// ─── RUNAWAY ─────────────────────────────────────────────────────────────────

function enableRunaway() {
    const noBtn = document.getElementById('no-btn')
    noBtn.addEventListener('mouseover', runAway)
    noBtn.addEventListener('touchstart', runAway, { passive: true })
}

function runAway() {
    const noBtn = document.getElementById('no-btn')
    const margin = 20
    const maxX = window.innerWidth  - noBtn.offsetWidth  - margin
    const maxY = window.innerHeight - noBtn.offsetHeight - margin

    noBtn.style.position = 'fixed'
    noBtn.style.left = `${Math.random() * maxX + margin / 2}px`
    noBtn.style.top  = `${Math.random() * maxY + margin / 2}px`
    noBtn.style.zIndex = '50'
}
