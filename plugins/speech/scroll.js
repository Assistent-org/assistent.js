define(function(){

	function viewport(){
		return {
			width  :Math.max(document.documentElement.clientWidth, window.innerWidth || 0),
			height :Math.max(document.documentElement.clientHeight, window.innerHeight || 0)
		};
	}

	return {

		help: 'Este plugin possibilita a ação de scroll por voz, basta dizer <strong>"Desce"</strong> para scrollar para baixo, <strong>"Sobe"</strong> para scrollar para cima e <strong>Header</strong> para ir para o topo.',

		commands :{

			'desce' :function(){
				window.scrollTo( null, window.scrollY + viewport().height );
			},

			'sobe' :function(){
				window.scrollTo( null, window.scrollY - viewport().height );
			},

			'header' :function(){
				window.scrollTo(null, 0);
			}
		}
	};
});
