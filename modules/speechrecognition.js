define(function(){

	function audiolistener(){

		var pubsub = PubSub(), _self, commands, keys;
		_self = this, commands = {}, keys = {};

		this.state = { pause :false, error :false };
		this.recognition = Recognition( pubsub, this );

		this.on = function(ev, fn){
			pubsub.subscribe( ev, fn );
		};

		this.start = function(){
			_self.recognition.start();
			_self.on('result', match);
		};

		this.add = function(name, method){
			keys[name] = true;
			commands[ name ] = { method :method, regex :commandToRedexp(name) };
		};

		this.addCommands = function( all ){
			for(var i in all){
				if(!keys[i] ) _self.add(i, all[i]);
			}
		};

		function match(e, item){
			for( var name in commands){
				var m = item[0].transcript.trim().match( commands[name].regex );
				if(m && m.length){
					commands[name].method( m.pop() );
					break;
				}
			}
		}

	}

	function PubSub(){
		var topics = {};
		return{
			subscribe :function( ev, fn ){
				topics[ev] = topics[ev] || [];
				topics[ev].push( fn );
			},

			publish :function(){
				var arr = args(arguments);
				var ev = arr.shift();
				topics[ev] = topics[ev] || [];
				topics[ev].forEach(function(fn) {
					if( fn ) fn.apply( this, arr );
				});
			}
		};
	}

	function Recognition(pubsub, instance){

		var recognition = new Speach();
		// Set the max number of alternative transcripts to try and match with a command
		recognition.maxAlternatives = 3;
		// In HTTPS, turn off continuous mode for faster results.
		// In HTTP,  turn on  continuous mode for much slower results, but no repeating security notices
		recognition.continuous = (location.protocol === 'http:');
		recognition.lang = 'pt-BR';

		recognition.onaudioend = function(e){
			pubsub.publish('audioend', e, instance, this);
		};

		recognition.onaudiostart = function(e){
			pubsub.publish('audiostart', e, instance, this);
		};

		recognition.onsoundend = function(e){
			pubsub.publish('soundend', e, instance, this);
		};

		recognition.onsoundstart = function(e){
			pubsub.publish('soundstart', e, instance, this);
		};

		recognition.onspeechstart = function(e){
			pubsub.publish('speechstart', e, instance, this);
		};

		recognition.onspeechend = function(e){
			pubsub.publish('speechend', e, instance, this);
		};

		recognition.onnonmatch = function(e){
			pubsub.publish('nonmatch', e, instance, this);
		};

		recognition.onstart = function(e){
			pubsub.publish('start', e, instance, this);
		};

		recognition.onerror = function(e) {
			pubsub.publish('error', e, e.error, this);
			instance.state.error = true;
		};

		recognition.onend = function(e){
			if( !instance.state.pause && !instance.state.error )
				recognition.start();
			else pubsub.publish('end', e, instance, this);
		};

		recognition.onresult = function(e){

			var results = args(e.results);
			pubsub.publish('result', e, results[results.length-1], this, instance );
		};

		return recognition;
	}

	function Speach(){
		return new (window.SpeechRecognition ||
		window.webkitSpeechRecognition ||
		window.mozSpeechRecognition ||
		window.msSpeechRecognition ||
		window.oSpeechRecognition);
	}

	function args( array ){
		return Array.prototype.slice.call( array );
	}

	function commandToRedexp(command){
		// https://github.com/TalAter/annyang/blob/master/annyang.js
		// The command matching code is a modified version of Backbone.Router by Jeremy Ashkenas, under the MIT license.
		var optionalParam = /\s*\((.*?)\)\s*/g;
		var optionalRegex = /(\(\?:[^)]+\))\?/g;
		var namedParam    = /(\(\?)?:\w+/g;
		var splatParam    = /\*\w+/g;
		var escapeRegExp  = /[\-{}\[\]+?.,\\\^$|#]/g;

		command = command.replace(escapeRegExp, '\\$&')
		.replace(optionalParam, '(?:$1)?')
		.replace(namedParam, function(match, optional) {
			return optional ? match : '([^\\s]+)';
		})
		.replace(splatParam, '(.*?)')
		.replace(optionalRegex, '\\s*$1?\\s*');

		return new RegExp('^' + command + '$', 'i');
	}

	return audiolistener;

});
