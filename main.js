const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const PLAYER_STORAGE_KEY = 'F8-player';

const player = $('.player')
const cd = $('.cd')
const heading = $('header h2')
const cdThumb = $('.cd-thumb')
const audio = $('#audio')
const playBtn = $('.btn-toggle-play')
const progress =  $('#progress')
const prevBtn = $('.btn-prev')
const nextBtn = $('.btn-next')
const randomBtn = $('.btn-random')
const repeatBtn = $('.btn-repeat')
const playlist = $('.playlist')

const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
    songs: [
        {
            name: '2AM',
            singer: 'Justatee',
            patd: './assets/music/2AM.mp3',
            img: './assets/img/Justatee.jpg'
        },
    
        {
            name: 'Anh thương em nhất mà',
            singer: 'Lã. x Log x TiB',
            patd: './assets/music/AnhThuongEmNhatMa.mp3',
            img: './assets/img/La.jpg'
        },
    
        {
            name: 'Chẳng gì đẹp đẽ trên đời mãi',
            singer: 'Khang Việt',
            patd: './assets/music/ChangGiDepDeTrenDoiMai.mp3',
            img: './assets/img/KhangViet.jpg'
        },
    
        {
            name: 'Nàng thơ',
            singer: 'Hoàng Dũng',
            patd: './assets/music/NangTho.mp3',
            img: './assets/img//HoangDung.jpg'
        },
    
        {
            name: 'Như anh đã thấy em',
            singer: 'PhucXP ft. Freak D',
            patd: './assets/music/NhuAnhDaThayEm.mp3',
            img: './assets/img/PhucXP.jpg'
        },
    
        {
            name: 'Sau tất cả',
            singer: 'Erik',
            patd: './assets/music/SauTatCa.mp3',
            img: './assets/img/Erik.jpg'
        },
    
        {
            name: 'Sinh ra là thứ đối lập nhau',
            singer: 'Da LAB',
            patd: './assets/music/SinhRaLaThuDoiLapNhau.mp3',
            img: './assets/img/DaLAB.jpg'
        },
    
        {
            name: 'Suýt nữa thì',
            singer: 'Andiez',
            patd: './assets/music/SuytNuaThi.mp3',
            img: './assets/img/Andiez.jpg'
        },
    
        {
            name: 'Thu cuối',
            singer: 'Yanbi',
            patd: './assets/music/ThuCuoi.mp3',
            img: './assets/img/Yanbi.jpg'
        },
    
        {
            name: 'Xe đạp',
            singer: 'Thùy Chi',
            patd: './assets/music/XeDap.mp3',
            img: './assets/img/ThuyChi.jpg'
        }
    ],
    setConfig: function(key, value) {
        this.config[key] = value
        localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config))
    },
    render: function() {
        const htmls = this.songs.map((song, index) => {
            return `<div class="song ${index === this.currentIndex ? 'active' : ''}" data-index="${index}">
            <div class="thumb" style="background-image: url('${song.img}')">
            </div>
            <div class="body">
                <h3 class="title">${song.name}</h3>
                <p class="author">${song.singer}</p>
            </div>
            <div class="option">
            <i class="fas fa-ellipsis-h"></i>
            </div>
        </div>`
        })
        playlist.innerHTML = htmls.join('');
    },
    defineProperties: function () {
        Object.defineProperty(this, 'currentSong', {
            get: function () {
                return this.songs[this.currentIndex]
            }
        })
    },
    handleEvents: function () {
        const _this = this
        const cdWidth = cd.offsetWidth

        // Xử lí CD quay / dừng
        const cdThumbAnimate = cdThumb.animate([
            { transform: 'rotate(360deg)'}
        ], {
            duration: 10000,
            iterations: Infinity
        })
        cdThumbAnimate.pause()
        // Xử lí phóng to thu nhỏ Cd
        document.onscroll = function () {
            const scrollTop = window.scrollY || document.documentElement.scrollTop
            const newCdWidth = cdWidth - scrollTop
            
            cd.style.width =  newCdWidth > 0 ? newCdWidth + 'px' : 0;
            cd.style.opacity = newCdWidth / cdWidth;
        }
        // Xử lí khi click button play
        playBtn.onclick = function () {
           if (_this.isPlaying) {
            audio.pause();
           } else {
            audio.play();
           }
        }
        // Khi song được play
        audio.onplay = function () {
            _this.isPlaying = true;
            player.classList.add('playing')
            cdThumbAnimate.play()
        }
        // Khi song bị pause
        audio.onpause = function () {
            _this.isPlaying = false;
            player.classList.remove('playing');
            cdThumbAnimate.pause()
        }
        // Khi tiến độ bài hát thay đôi
        audio.ontimeupdate = function () {
             if (audio.duration) {
                const progressPercent = Math.floor(audio.currentTime / audio.duration * 100)
                progress.value = progressPercent
             }
        }
        // Xử lí tua song
        progress.onchange = function (e) {
            const seekTime = audio.duration / 100 * e.target.value;
            audio.currentTime = seekTime;
        }
        // Khi next song
        nextBtn.onclick = function () {
            if (_this.isRandom) {
                _this.playRandomSong()
            } else {
                _this.nextSong()
            }
            audio.play()
            _this.render()
            _this.scrollToActiveSong()
        }
        // Khi prev song
        prevBtn.onclick = function () {
            if (_this.isRandom) {
                _this.playRandomSong()
            } else {
                _this.prevSong()    
            }
            audio.play()
            _this.render()
            _this.scrollToActiveSong()
        }   
        // Khi load lại bài
        repeatBtn.onclick = function(e) {
            _this.isRepeat = !_this.isRepeat
            _this.setConfig('isRepeat',_this.isRepeat)
            repeatBtn.classList.toggle('active', _this.isRepeat)
        }
        // xử lí bật/tắt icon random song
        randomBtn.onclick = function (e) {
            _this.isRandom = !_this.isRandom 
            _this.setConfig('isRandom',_this.isRandom)
            randomBtn.classList.toggle('active',_this.isRandom)
        }
        // Xử lí next song khi audio ended
        audio.onended = function() {
            if (_this.isRepeat) {
                audio.play()
            } else {
                nextBtn.click()
            }
        }
        // lắng nghe click vào playlist
        playlist.onclick = function (e) {
        const songNode = e.target.closest('.song:not(.active)')
            if (songNode || e.target.closest('.option')) {
                if (songNode) {
                    _this.currentIndex = Number(songNode.dataset.index)
                    _this.loadcurrentSong()
                    _this.render()
                    audio.play()
                }

                if (e.target.closest('option')) {

                }
            }
        }
    },
    loadcurrentSong: function () {
        heading.textContent = this.currentSong.name
        cdThumb.style.backgroundImage = `url('${this.currentSong.img}')`
        audio.src = this.currentSong.patd;
    },
    loadConfig: function () {
        this.isRandom = this.config.isRandom
        this.isRepeat = this.config.isRepeat
    },
    scrollToActiveSong: function () {
        setTimeout(() => {
            $('.song.active').scrollIntoView({
                behavior: 'smooth',
                block: 'end',
                // inline: 'start',
            })
        },100)
    },
    nextSong: function() {
        this.currentIndex++
        if (this.currentIndex >= this.songs.length) {
            this.currentIndex = 0
        }
        this.loadcurrentSong()
    },
    prevSong: function() {
        this.currentIndex--
        if (this.currentIndex < 0) {
            this.currentIndex = this.songs.length - 1
        }
        this.loadcurrentSong()
    },
    playRandomSong: function () {
        let newIndex
        do {
            newIndex = Math.floor(Math.random() * this.songs.length)
        } while (newIndex === this.currentIndex)

        this.currentIndex = newIndex
        this.loadcurrentSong()
    }, 
    
    start: function() {
        // gán cấu hình từ config vào  Object
        this.loadConfig()
        // Định nghĩa các thuộc tính cho Object
        this.defineProperties()

        // Lắng nghe / Xử lí  các sự kiện (DOM events)
        this.handleEvents()

        // Tải thông tin bài hát đầu tiên vào UI khi chạy ứng dụng
        this.loadcurrentSong()

        // Render playlist
        this.render()
        
        // Hiển thị trạng thái ban đầu của button repeat/random
        randomBtn.classList.toggle('active',this.isRandom)
        repeatBtn.classList.toggle('active',this.isRepeat)
    }
}


app.start()

