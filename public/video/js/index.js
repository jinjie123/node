onload = function() {
	function GetRequest() {
		var url = location.search;
		var theRequest = new Object();
		if(url.indexOf("?") != -1) {
			var str = url.substr(1);
			strs = str.split("&");
			for(var i = 0; i < strs.length; i++) {
				theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
			}
		}
		return theRequest;
	}

	var back = document.getElementById('home');

	back.onclick = function() {
		wx.miniProgram.switchTab({
			url: '/pages/index/index',

		})
	}

	var imgs = document.getElementsByTagName('img');
	if(imgs[0]) {
		for(var i=0;i<imgs.length;i++) {
			var img = imgs[i];
			img.style.width = '100%';
			img.style.height = 'auto';
		}
	}
//	音频
	if(document.getElementsByClassName("audio")[0]) {
		var script = document.createElement("script");
		script.src = '../js/jquery.min.js';
		script.async = 'async';
		document.body.appendChild(script);
		script.onload = function() {
			var script2 = document.createElement("script");
			script2.src = '../js/jquery.jplayer.js';
			script2.async = 'async';
			document.body.appendChild(script2);
			var audio_url = $('.audio_url').html();
			var audio_name = $('.audio_name').html();
			var audio = `<div id="jquery_jplayer_1" class="jp-jplayer"style="display: none;"></div>
						<div id="jp_container_1" class="jp-audio" role="application" aria-label="media player">
						<div class="audio_box">
					<div class="audio-btn">
						<em class="jp-play" role="button" tabindex="0"></em>
					</div>
					<div class="audio-content">
						<span class="jp-desc" aria-label="desc">` + audio_name + `</span>
						<div class="audio-bar">
							<span class="jp-seek-bar">
								<span class="jp-play-bar"></span>
							<span class="audio-jp-bar"></span>
							</span>
							<span class="jp-play-handle">
								<i></i>
							</span>
						</div>
						<div class="audio-time">
							<em class="jp-current-time" role="timer" aria-label="time">00:00</em>
							<em class="jp-duration" role="timer" aria-label="duration">&nbsp;</em>
						</div>
					</div>
				</div>
			</div>`
			$('.audio').attr('id', 'audio')
			$('.audio').html(audio);
			script2.onload = function() {
				$("#jquery_jplayer_1").jPlayer({
					ready: function(event) {
						$(this).jPlayer("setMedia", {
							mp3: audio_url
						});
					},
					supplied: "mp3",
					wmode: "window",
					useStateClassSkin: true,
					autoBlur: false,
					smoothPlayBar: true,
					keyEnabled: true,
					remainingDuration: true,
					toggleDuration: true
				});
			}
		}

	}
	//视频
	if(document.getElementsByClassName("video")[0]) {
		var video_url = document.getElementsByClassName('video_url')[0].innerHTML;
//		console.log(video_url)
		var video_box = document.getElementsByClassName('video')[0];
		video_box.innerHTML = '';
		var video = document.createElement('video');
		video.id = 'myvideo';
		video.src = video_url;
		video.autoplay = 'autoplay';
		video_box.appendChild(video);
		var video_play = document.createElement('div');
		video_play.className = 'video_play';
		video_box.appendChild(video_play);
		var video_play_img = document.createElement('img');
		video_play_img.src = 'https://51sjfc.com/sjfc_artic_images/img/video_play.png';
		video_play.appendChild(video_play_img);
		video_play.onclick = function () {
			if (video.paused) {
				video.play();
			} else {
				video.pause();
			}
		}
	}
}