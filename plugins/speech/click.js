define(function(){

	function click( target ){

		var els = document.querySelectorAll('[title]');
		var found = [].filter.call( els, function(el){
			return el.title.toLowerCase() == target.toLowerCase();
		});

		if( found.length ){
			found[0].dispatchEvent(new Event('click', { bubbles:true }));
		}
	}

	return {
		help:'Este plugin possibilita a ação de clique por voz, diga: "<strong>Clique #o texto do link#"</strong>.',
		commands :{
			'clic *target' :click,
			'click *target' :click,
			'clique *target':click
		}
	};
});
