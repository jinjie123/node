onload = function() {
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
}