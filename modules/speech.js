define([

	'modules/speechrecognition'

], function( WebSpeech ){

	var audio, speech, Assistent, timer;

	var Speech = {

		help :{},

		init :function( A, plugins ){

			Assistent = A;
			audio = new WebSpeech();
			audio.start();

			create();
			register( plugins );
		}
	};

	function create(){

		speech = document.createElement('div');
		speech.id = 'speech';
		document.body.appendChild( speech );

		speech = document.getElementById('speech');
		helpwindow = speech.querySelector('.speech-help');
		svg = '<?xml version="1.0" encoding="utf-8"?><svg width=36px height=36px xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid" class="uil-hourglass"><rect x="0" y="0" width="100" height="100" fill="none" class="bk"></rect><g><path fill="none" stroke="#ffffff" stroke-width="5" stroke-miterlimit="10" d="M58.4,51.7c-0.9-0.9-1.4-2-1.4-2.3s0.5-0.4,1.4-1.4 C70.8,43.8,79.8,30.5,80,15.5H70H30H20c0.2,15,9.2,28.1,21.6,32.3c0.9,0.9,1.4,1.2,1.4,1.5s-0.5,1.6-1.4,2.5 C29.2,56.1,20.2,69.5,20,85.5h10h40h10C79.8,69.5,70.8,55.9,58.4,51.7z" class="glass"></path><clipPath id="uil-hourglass-clip1"><rect x="15" y="20" width="70" height="25" class="clip"><animate attributeName="height" from="25" to="0" dur="1s" repeatCount="indefinite" vlaues="25;0;0" keyTimes="0;0.5;1"></animate><animate attributeName="y" from="20" to="45" dur="1s" repeatCount="indefinite" vlaues="20;45;45" keyTimes="0;0.5;1"></animate></rect></clipPath><clipPath id="uil-hourglass-clip2"><rect x="15" y="55" width="70" height="25" class="clip"><animate attributeName="height" from="0" to="25" dur="1s" repeatCount="indefinite" vlaues="0;25;25" keyTimes="0;0.5;1"></animate><animate attributeName="y" from="80" to="55" dur="1s" repeatCount="indefinite" vlaues="80;55;55" keyTimes="0;0.5;1"></animate></rect></clipPath><path d="M29,23c3.1,11.4,11.3,19.5,21,19.5S67.9,34.4,71,23H29z" clip-path="url(#uil-hourglass-clip1)" fill="#ffab00" class="sand"></path><path d="M71.6,78c-3-11.6-11.5-20-21.5-20s-18.5,8.4-21.5,20H71.6z" clip-path="url(#uil-hourglass-clip2)" fill="#ffab00" class="sand"></path><animateTransform attributeName="transform" type="rotate" from="0 50 50" to="180 50 50" repeatCount="indefinite" dur="1s" values="0 50 50;0 50 50;180 50 50" keyTimes="0;0.7;1"></animateTransform></g></svg>';
	}

	function register( plugins ){

		loadCommands( plugins );

		audio.on('error', restart);
		audio.on('speechstart', speechstart);
		audio.on('result', result);
	}

	function speechstart(){
		show( svg + 'Pensando...');
	}

	function result(e, result){
		show( result[0].transcript );
		hide();
	}

	function show( text ){
		clearTimeout( timer );
		speech.classList.add('show');
		speech.innerHTML = text || '';
		hide();
	}

	function hide(){
		timer = setTimeout(function(){
			speech.classList.remove('show');
		}, 3000);
	}

	function restart(err, reason, recognition){
		if( reason == 'no-speech' )
			recognition.start();
		else {
			console.log( reason );
		}
	}

	function loadCommands(plugins ){

		plugins.forEach(function( name ){

			require(['plugins/speech/'+name], function(plugin){

				Speech.help[ name ] = plugin.help;

				Object.keys(plugin.commands).forEach(function( key, value ){
					audio.add( key, plugin.commands[key] );
				});

				plugins.pop();
				Assistent.subscribe('speech:ready', plugin.onReady);

				if(!plugins.length){
					Assistent.publish('speech:ready', Speech);
				}
			});
		});
	}

	return Speech;
});
