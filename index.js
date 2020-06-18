(function(){
'use strict'

    // declaração de elementos html
    const $canvas = document.querySelector('[data-js="canvas"]')
    const $iniciar = document.querySelector('[data-js="iniciar"]')
    const $parar = document.querySelector('[data-js="parar"]')
    const $radio = document.getElementsByName("mode")
    const $numeroAlvos = document.getElementById("numeroAlvo")
    const $placar = document.getElementById('placar')
    const $acertos = document.getElementById('acertos')
    const $erros = document.getElementById('erros')
    // declaração de elementos globais (coisas que não seriam necessárias com o react talvez)
    var x   // gambiarra das feias, mas não ta errado
    var y
    var erros = 0
    var acertos = 0
    var numeroAlvos = 0
    var intervalo   
    

    // canvas
    const drawer = $canvas.getContext('2d')

    // dividi o código em blocos e comentei pra você entender o contexto

    
    // [BLOCO 1] verificadores de configurações do usuário

    const verifyMode = () => {
        var difficulty = ''
        for (var i = 0; i < $radio.length; i++) {
            if ($radio[i].checked) {
                difficulty = $radio[i].value
            }
        }
        return difficulty
    }
    const difficultyManager = () => {
        var rules
        switch (verifyMode()){
            case 'easy' : return rules = {tempo: 1000, raio: 10};
            case 'regular' : return rules = {tempo: 1000, raio: 8};
            case 'hard' : return rules = {tempo: 500, raio: 8};
            default: console.log('hola')
        }
    }

    
    // [BLOCO 2] o jogo funcionando em si, as funções estão em ordem seguindo um conceito parecido com um padrão middleware

    const startGame  = () => {
        const dificuldade = verifyMode()
        numeroAlvos = $numeroAlvos.value
            if (!dificuldade){
                window.alert('Selecione um modo de jogo antes');
                return;
            }
            if (numeroAlvos <= 0){
                window.alert('Selecione um número de alvos antes');
                return;
            }
            $placar.style.opacity = 100
            $iniciar.disabled = true
        drawCanvas() // next()
        
        
    }

    const drawCanvas = () => {
        drawer.fillStyle="#000000"
        drawer.fillRect(0,0,500,500)
        var mensagem = `Jogando no modo ${verifyMode()}, clique na tela para começar`
        drawer.font="15pt Arial"
        drawer.fillStyle="white"
        drawer.fillText(mensagem,10,50)
    setTimeout(startTime,2000) // next()

    }
    const startTime = () => {
        resetCanvas()
        limpaTela()
        $parar.disabled = false
        $canvas.addEventListener('click',shootManager)
        const specs = difficultyManager()

        intervalo = setInterval(() => {
            drawAlvo() // next()
            setTimeout(limpaTela,specs.tempo)
            erros++
        }, specs.tempo + 500)


    }
    
    const sorteiaposicao = (minimo,maximo) => {
		return Math.floor(Math.random() * (maximo - minimo) + minimo)
	}
    
    const drawAlvo = function drawAlvo () {
        x = sorteiaposicao(20,480)
        y = sorteiaposicao(20,480)
        const specs = difficultyManager()
        drawer.fillStyle='red'
		drawer.beginPath();
		drawer.arc(x, y, specs.raio + 10, 0,2*Math.PI);
		drawer.fill();
    }



    // [BLOCO 3] funções necessárias pra manutenção do canvas

    const shootManager = (evento) => {
        const specs = difficultyManager()
        var xClick = evento.pageX-$canvas.offsetLeft;
        var yClick = evento.pageY-$canvas.offsetTop;
            if ((xClick > x-specs.raio-10) && (xClick < x + specs.raio+10) && (yClick > y-specs.raio-10) && (yClick < y + specs.raio+10)){
				shootAcerto()
            }
            $acertos.innerHTML = `Acertos: ${acertos}`
            $erros.innerHTML = `Erros: ${erros}`

    }

    const limpaTela = () => {
        drawer.fillStyle="#000000"
        drawer.fillRect(0,0,500,500)
    }
    
    const resetCanvas = () => {
        erros, acertos = 0
        $acertos.innerHTML = `Acertos: 0`
        $erros.innerHTML = `Erros: 0`
    }

    const shootAcerto = ()  => {
        limpaTela()
        erros--
        acertos++     
        if (erros + acertos >= numeroAlvos) stopGame()
    }
    
    const stopGame = () => {  
        clearInterval(intervalo)
        $iniciar.disabled = false
        $parar.disabled = true
        
    }

    $parar.addEventListener('click',stopGame)
    $iniciar.addEventListener('click', startGame)


})()