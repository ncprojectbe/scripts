console.log("audioplayer.js is successfully loaded!");

(function(t, e, n) {
    function i(t, e) {
        this.$elem = t, this.settings = t.extend({}, s, e), this.name = this.settings.name, this.songs = [], this.init()
    }

    function r(t) {
        return t.replace(/\s+/g, "-").toLowerCase()
    }

    function a(e, n, i, r, a, s) {
        this.id = o(), this.$elem = t(i), this.targetSetId = r, this._audio = new Audio(n), this._audio.preload = s || "metadata", this.type = a || "audio/mp3", this.$parentElem = null, e && (this.albumArt = t('<img class="true-audio-player__thumbnail" alt="" src="' + e + '"/>'), this.$parentElem && this.albumArt.appendTo(this.$parentElem)), this.initEvents()
    }

    var o = function() {
            var t = 0;
            return function() {
                return t++
            }
        }(),
        s = {
            name: "True Audio Player",
            isDebug: !1
        };
    i.prototype = {
        init: function() {
            this.setupVariables(), this.setupEvents(), this.setupSongs(), this.setupMediaAPI()
        },
        setupVariables: function() {
            this.$audioElements = this.$elem.find('[tmplayer-element="audio"]'), this.$progressBarWrapper = this.$elem.find('[tmplayer-element="progress-bar-wrapper"]'), this.$volumeBarWrapper = this.$elem.find('[tmplayer-element="volume-bar-wrapper"]'), this.$progressBar = this.$elem.find('[tmplayer-element="progress-bar"]'), this.$elapsed = this.$elem.find('[tmplayer-element="elapsed"]'), this.$duration = this.$elem.find('[tmplayer-element="duration"]'), this.$playPause = this.$elem.find('[tmplayer-action="toggle"]'), this.$next = this.$elem.find('[tmplayer-action="next"]'), this.$previous = this.$elem.find('[tmplayer-action="previous"]'), this.$volumeMute = this.$elem.find('[tmplayer-action="toggle-mute"]'), this.$ajaxContainers = t('[tmplayer-ajax-container]'), this.tempCurrentTime = 0, this._playerState = "stopped", this._currentSongIndex = 0
        },
        setupEvents: function() {
            var e = this;
            e.initPlayPauseEvents(), e.initProgressBarEvents(), e.initVolumeBarEvents()
        },
        setupSongs: function() {
            var e = this;
            e.$audioElements.each(function(n, i) {
                e.grabAndSetSongData(i)
            })
        },
        setupMediaAPI: function() {
            "mediaSession" in navigator && this.initMediaAPIActions()
        },
        initPlayPauseEvents: function() {
            var t = this;
            t.$playPause.on("click", function() {
                t.togglePauseCurrentSong()
            }), t.$next.on("click", function() {
                t.playNextSong()
            }), t.$previous.on("click", function() {
                t.playPreviousSong()
            })
        },
        initProgressBarEvents: function() {
            var e = this;
            e.$progressBarWrapper.on("mousedown", function(i) {
                i.preventDefault();
                var r = e.scrubSong(i),
                    a = e.getCurrentSong().audio.duration;
                e.updateSongDisplayTime(r, a), t(e).on("mousemove.trueAudioPlayer", function(t) {
                    var i = e.scrubSong(t);
                    e.updateSongDisplayTime(i, a)
                }), t(e).one("mouseup", function() {
                    t(e).off("mousemove.trueAudioPlayer"), e.getCurrentSong().audio.currentTime = e.tempCurrentTime, e.isDragging = !1
                })
            })
        },
        initVolumeBarEvents: function() {
            var e = this;
            e.$volumeBarWrapper.on("mousedown", function(i) {
                i.preventDefault(), e.scrubVolume(i), t(e).on("mousemove.trueAudioPlayer", function(t) {
                    e.scrubVolume(t)
                }), t(e).one("mouseup", function() {
                    t(e).off("mousemove.trueAudioPlayer")
                })
            }), e.$volumeBarWrapper.on("touchstart", function(i) {
                i.preventDefault(), e.scrubVolume(i), t(e).on("touchmove.trueAudioPlayer", function(t) {
                    e.scrubVolume(t)
                }), t(e).one("touchend", function() {
                    t(e).off("touchmove.trueAudioPlayer")
                })
            })
        },
        scrubSong: function(t) {
            var e = "touchstart" == t.type || "touchmove" == t.type ? t.touches[0].clientX : t.clientX,
                n = this.$progressBarWrapper.width(),
                i = (e - this.$progressBarWrapper.offset().left) / n;
            i < 0 ? i = 0 : i > 1 && (i = 1);
            var r = this.getCurrentSong().audio.duration * (i = i < 0 ? 0 : i);
            return this.tempCurrentTime = r, r
        },
        scrubVolume: function(t) {
            var e = "touchstart" == t.type || "touchmove" == t.type ? t.touches[0].clientX : t.clientX,
                n = this.$volumeBarWrapper.width(),
                i = (e - this.$volumeBarWrapper.offset().left) / n;
            this.setVolume(i)
        },
        playNextSong: function() {
            if (1 == this.songs.length) return !1;
            this.stopCurrentSong();
            var t = this.getCurrentSongIndex();
            this.songs[t + 1] ? t++ : t = 0, this.setCurrentSong(t), this.playCurrentSong()
        },
        playPreviousSong: function() {
            if (this.songs.length <= 1) return !1;
            this.stopCurrentSong();
            var t = this.getCurrentSongIndex();
            this.songs[t - 1] ? t-- : t = this.songs.length - 1, this.setCurrentSong(t), this.playCurrentSong()
        },
        setCurrentSong: function(t) {
            this._currentSongIndex = t
        },
        getCurrentSong: function() {
            return this.songs[this._currentSongIndex]
        },
        getCurrentSongIndex: function() {
            return this._currentSongIndex
        },
        togglePauseCurrentSong: function() {
            var t = this.getCurrentSong();
            t.isPaused ? this.playCurrentSong() : this.pauseCurrentSong()
        },
        playCurrentSong: function() {
            var t = this.getCurrentSong();
            t.audio.play(), this._playerState = "playing"
        },
        pauseCurrentSong: function() {
            var t = this.getCurrentSong();
            t.audio.pause(), this._playerState = "paused"
        },
        stopCurrentSong: function() {
            var t = this.getCurrentSong();
            t.audio.pause(), t.audio.currentTime = 0, this._playerState = "stopped"
        },
        grabAndSetSongData: function(e) {
            var n = t(e),
                i = n.attr("data-audio-url"),
                o = n.attr("data-target"),
                s = n.attr("data-album-art-url"),
                l = n.attr("data-type"),
                c = n.attr("data-preload"),
                d = new a(s, i, e, o, l, c);
            d.$parentElem = this.$elem, this.songs.push(d)
        },
        setVolume: function(t) {
            this.getCurrentSong().audio.volume = t
        },
        updateSongDisplayTime: function(t, e) {
            this.$elapsed.text(this.formatTime(t)), this.$duration.text(this.formatTime(e))
        },
        formatTime: function(t) {
            var e = Math.floor(t / 60),
                n = Math.floor(t % 60);
            return e + ":" + (n < 10 ? "0" + n : n)
        }
    }, a.prototype = {
        initEvents: function() {
            var e = this;
            e._audio.addEventListener("timeupdate", function() {
                e.onTimeUpdate()
            }), e._audio.addEventListener("ended", function() {
                e.onSongEnded()
            }), e._audio.addEventListener("canplaythrough", function() {
                e.onCanPlayThrough()
            }), e._audio.addEventListener("loadedmetadata", function() {
                e.onLoadedMetadata()
            })
        },
        onTimeUpdate: function() {
            var e = this;
            e.$parentElem && (e.$parentElem.find('[tmplayer-element="progress-bar"]').css("width", 100 * e._audio.currentTime / e._audio.duration + "%"), e.$parentElem.find('[tmplayer-element="elapsed"]').text(e.formatTime(e._audio.currentTime)))
        },
        onSongEnded: function() {
            var e = this;
            e.$parentElem.find('[tmplayer-action="toggle"]').removeClass("true-audio-player__button--pause").addClass("true-audio-player__button--play"), e.$parentElem.find('[tmplayer-element="progress-bar"]').css("width", "0%"), e.$parentElem.trigger("songEnded.trueAudioPlayer")
        },
        onCanPlayThrough: function() {
            this.$parentElem && this.$parentElem.trigger("canPlay.trueAudioPlayer")
        },
        onLoadedMetadata: function() {
            this.$parentElem && this.$parentElem.trigger("metadataLoaded.trueAudioPlayer")
        },
        play: function() {
            this._audio.play(), this.isPaused = !1, this.isPlaying = !0
        },
        pause: function() {
            this._audio.pause(), this.isPaused = !0, this.isPlaying = !1
        },
        formatTime: function(t) {
            var e = Math.floor(t / 60),
                n = Math.floor(t % 60);
            return e + ":" + (n < 10 ? "0" + n : n)
        }
    }, t.fn.trueAudioPlayer = function(e) {
        return this.each(function() {
            t(this).data("trueAudioPlayer", new i(t(this), e))
        }), this
    }
})(jQuery, window, document);
