
var player;

$(function() {
	$('#q').focus();

	$('#search').submit(function() {

		// キーワードからYouTubeを検索
		var url = "https://www.googleapis.com/youtube/v3/search";
		var options = {
			part:"snippet",
			key:"AIzaSyA1GEzfaziufzEcB6oyTSHL5qd9mdtK7sA",
			q: $('#q').val(),
		};

		// 検索結果を#listへ追加
		$.get(url, options, function(rs) {
			console.log(rs);
			$('#list').empty();
			for( var item of rs.items ) {
				$('#list').append(
						$('<li class="movie">').append(
								$('<img>').attr('src',item['snippet']['thumbnails']['default']['url'])
							).attr({
							'video-id'   : item['id']['videoId'],
							'video-title': item['snippet']['title'],
						})
				)
			}
		}, "json");



	});
	$(document).on('click', 'li.movie', function() {
		$(this).toggleClass('on');
	});

	var currentIndex = 0;

	function play() {
		// currentindexのVideoIdを取得
		var currentItem = $('li.movie.on:eq('+currentIndex+')');
		var videoId = currentItem.attr('video-id');
		var title   = currentItem.attr('video-title');


		// それを再生
		$('h1.watch-title-container').text(title);
		player.loadVideoById(videoId);

		// .playing
		$('li.movie').removeClass('playing');
		$('li.movie.on:eq('+currentIndex+')').addClass('playing');
	}

	$('#play').click(function() {
		play();
	});


	$('#pause').click(function() {
		player.pauseVideo();
	});

	$('#next').click(function() {
		if( currentIndex == $('li.movie.on').length - 1 ) {
			currentIndex = 0;
		} else {
			currentIndex++;
		}
		play();
	});

	$('#prev').click(function() {
		if( currentIndex == 0 ) {
			return false;
		}
		currentIndex--;
		play();
	});

});
	


function onYouTubeIframeAPIReady() {
	player = new YT.Player('player', {
		height: '390',
		width: '640',
		events: {
			'onStateChange': onPlayerStateChange
		}
	});
}

function onPlayerStateChange(e) {
	if(e.data == YT.PlayerState.ENDED) {
		$('#next').trigger('click');
	}
}
