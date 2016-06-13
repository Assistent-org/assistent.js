define(function(){

	var topics = {}, slice;

	slice = Array.prototype.slice;

	var Assistent = {

		tag :null,

		init : function(){

			this.tag = document.querySelector('script[data-assistent]');
			var speech = this.tag.getAttribute('data-assistent-speech');

			load( speech );
		},

		subscribe :function(){

			var args = slice.call( arguments );
			var key = args[0], method = args[1];

			topics[key] = topics[key] || [];
			topics[key].push( method );
		},

		publish :function(){

			var args = slice.call( arguments );
			var key = args.shift();

			topics[key] = topics[key] || [];
			topics[key].forEach(function(f){
				if( f ) f.apply( this, args );
			});
		}
	};

	function load( speech ){

		if( !speech ) return;

		require(['modules/speech'], function( mspeech ){
			mspeech.init( Assistent, speech.split(/\s/) );
		});
	}

	Assistent.init();
	return Assistent;
});
