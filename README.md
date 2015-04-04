# form-layout
< div layout>
	< input width="fill" >
	< div width="10%" >...</div>
	< div width="105px" >...</div>
</ div>
# Atividades
* Bug barra de rolagem horizontal (nunca deve existir)
* Bug posicionamento *top posição Y, padding 
* Bug getOffset considerando offset do parent (inserir trecho html em páginas aleatórias e executar script)
* Implentar width="fill"
* Testes 
- http://purecss.io/tables/
- http://yuilibrary.com/yui/docs/charts/charts-multiseries.html
- http://yuilibrary.com/yui/docs/calendar/calendar-simple.html
- https://jqueryui.com/
- https://material.angularjs.org/
- https://facebook.github.io/react/

https://www.youtube.com/watch?v=ya4UHuXNygM
https://www.youtube.com/user/yuilibrary

http://www.w3schools.com/html/html5_canvas.asp
//
// testar com x e y
/*
//--------CONTAGEM DE FILHOS
var count = 0;
function countChildren(element) {
	var children = element.children;
	if (!children || children.length === 0) {
		return;
	}
	count += children.length
	for (var index = 0 ; index < children.length ; index++) {
		countChildren(children[index])
	}
};
countChildren(document.body);
console.log(count);
 */

//		NORMALIZE
//(function() {
//	 String.prototype.makeSuffixRegExp = function (suffix, caseInsensitive) {
//	  return new RegExp(
//	      String(suffix).replace(/[$%()*+.?\[\\\]{|}]/g, "\\$&") + "$",
//	      caseInsensitive ? "i" : "");
//	}
//	String.prototype.endsWith = function(suffix) { // TODO COMPARE PERFORMANCE
//	    //return this.indexOf(suffix, this.length - suffix.length) !== -1;
//		// str.lastIndexOf(suffix) == str.length - suffix.length
////		return this.match("^" + suffix) !== null;
//		return String.prototype.makeSuffixRegExp(this, false).test(suffix);
//	};
//})();
//
/*
 * *** Similar approaches ***
 * http://bosonic.github.io/demos.html#
 * http://www.x-tags.org/index
 * https://www.polymer-project.org/
 * https://angularjs.org/
 */

// Form Layout Microsoft - https://msdn.microsoft.com/en-us/library/windows/apps/jj839734.aspx
// Case sensitive http://apmblog.dynatrace.com/2011/09/13/how-case-sensitivity-for-id-and-classname-can-kill-your-page-load-time/
/*
 * TODO - REACT
 * Componentes
 * layout
 * form
 * 
 * form-layout -> form + layout
 * 
 * Modelo:
 * 	<div form-layout | lform
 * 		<children label width height message-error message-success messageInfo messageWarn helpMessage
 * Atributos
 * form -> Identificador de formulário responsivo e com controle de mensagens sobre seus filhos.
 * label -> Título do campo
 * width / height
 * messageError / messageSuccess / messageInfo / messageWarn -> Mensagens em linha abaixo do campo com símbolo representativo e seta de balão indicando o campo.
 * helpMessage - Adiciona icone de ajuda com texto/html explicativo
 * 
 * criar layers -> verificar e settar o tamanho em cada layer gerando um setTimeout para agendar posicionar o item corretamente antes do tratamento de seus filhos.
 * nada pode ficar dentro de canvas
 * 
 * 
 * EVENTO RESIZE
 * 
 * cada Canvas possui seu DIV correspondente
 * cada filho do canvas possui um rectangle correspondente?
 * 
 * INPUT
 * mensagem inline - balão - TODO - Material Google
 * 
 * DRAG AND DROP - conversa para troca de filhos entre elementos canvas
 * 	<canvas drag-drop
 * 	<canvas drag  
 * 	<canvas drop
 * 	canDrag - poder soltar - encaixar - sinalizar areas com css
 * 
 * EVENTOS DE SINALIZAÇÃO PARA O USUARIO
 * - CIRCULAR ELEMENTOS - FORMAR CÍRCULO POR VOLTA DOS ELEMENTOS
 * - BRILHO POR VOLTA DOS ELEMENTOS
 * - PISCAR
 * 
 * 
 * 
 * http://code.tutsplus.com/articles/21-ridiculously-impressive-html5-canvas-experiments--net-14210
 * 
 */
