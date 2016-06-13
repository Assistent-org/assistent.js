define(function(){

	var help = document.querySelector('.speech-help');

	function close(){
		help.classList.remove('show');
	}

	function open(){
		help.classList.add('show');
	}

	function createWindow( Speech ){

		var content = help.querySelector('.help');
		var ul = document.createElement('ul');
		var lis = '';

		Object.keys( Speech.help ).forEach(function( name ){
			lis += '<li>';
				lis += '<p class="name">'+ name +'</p>';
				lis += '<p class="description">' + Speech.help[name] + '</p>';
			lis += '</li>';
		});

		ul.innerHTML = lis;
		content.appendChild(ul);
		open();
	}

	return {
		help:'Para abrir a janela de ajuda, diga: <strong>"Ajuda"</strong>. Para fechá-la, diga: <strong>"Fechar ajuda"</strong>',
		onReady: createWindow,
		commands :{
			'fechar ajuda' :close,
			'ajuda' :open
		}
	};
});
