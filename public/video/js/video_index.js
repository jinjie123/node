onload = function() {
	if(document.getElementsByClassName("video")[0]) {
		var video_url = document.getElementsByClassName('video_url')[0].innerHTML;
		console.log(video_url)
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