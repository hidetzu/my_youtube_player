
var player;

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

angular.module('myYoutubePlayer',[])
.controller('AppCtrl',  ['$scope', '$http', function ($scope, $http) {

	var appCtrl     = this;


	$scope.watch_video = {
		'id'        : -1,
		'title'     : "",
		'videoId'   : "",
	};
	$scope.results = [];

	appCtrl.search = function() {
		var url = "https://www.googleapis.com/youtube/v3/search?"
			+  [
				'part=snippet',
				'key=AIzaSyA1GEzfaziufzEcB6oyTSHL5qd9mdtK7sA',
				'q=' + encodeURIComponent(this.query),
				'callback=JSON_CALLBACK',
			].join('&');

		$http.jsonp(url).success(function(data) {
			$scope.results.length = 0;
			$scope.results = [];

			for(var item of data.items) {
				$scope.results.push( {
					playing  : false,
					selected : false,
					data:item });
			};

		});

	};


	appCtrl.play = function(startIdx) {
		if( (0 <= $scope.watch_video.id ) && ($scope.watch_video.id <= $scope.results.length - 1)) {
			$scope.results[$scope.watch_video.id].playing = false;
		}

		for(var i = startIdx; i < $scope.results.length; i++) {
			var v = $scope.results[i];
			if( v.selected ==  true ) {
				$scope.watch_video.id      = i;
				$scope.watch_video.title   = v['data']['snippet']['title'];
				$scope.watch_video.videoId = v['data']['id']['videoId'];
				$scope.results[$scope.watch_video.id].playing = true;
				break;
			}
			
		}

		player.loadVideoById($scope.watch_video.videoId);
	};

	appCtrl.getSelectedList = function() {
		var tmpList = [];
		for(var i = 0; i < $scope.results.length; i++) {
			var v = $scope.results[i];
			if( v.selected ==  true ) {
				tmpList.push(i);
			}
			
		}
		return tmpList;
	}


	appCtrl.onPrev = function() {
		var tmpList =  this.getSelectedList();
		var currentIdx = $scope.watch_video.id;
		if( currentIdx == tmpList[0] ) {
			return false;
		}

		currentIdx--;
		this.play(currentIdx);
	};

	appCtrl.onPlay = function() {
		this.play(0);
	};

	appCtrl.onPause = function() {
		player.pauseVideo();
	};

	appCtrl.onNext = function() {
		var tmpList =  this.getSelectedList();
		var currentIdx = $scope.watch_video.id;
		if( currentIdx >= tmpList[tmpList.length-1] ) {
			currentIdx =  tmpList[0];
		} else {
			currentIdx++;
		}

		this.play(currentIdx);
	};

	appCtrl.select = function(selectedItem) {
		selectedItem.selected = !selectedItem.selected
		return selectedItem.selected;
	};
}]);


