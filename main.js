const form = document.querySelector("#form-search");
const moneda = document.querySelector("#moneda");
const criptomonedas = document.querySelector("#criptomonedas");
const formContainer = document.querySelector(".form-side");
const containerAnswer = document.querySelector(".container-answer");

const objBusqueda = {
    moneda: '',
    criptomonedas: ''
}

document.addEventListener('DOMContentLoaded', ()=>{
    consultaCripto();

    form.addEventListener('submit', submitForm);
    moneda.addEventListener('change', getValue);
    criptomonedas.addEventListener('change', getValue);
})

function submitForm (e){
    e.preventDefault();
    const {moneda, criptomonedas} = objBusqueda;
    if(moneda === '' || criptomonedas === ''){
        showError('Seleccione Ambos campos.');
        return;
    }
    consultarAPI(moneda, criptomonedas);
}

function consultarAPI (moneda, criptomonedas){
    const url = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${criptomonedas}&tsyms=${moneda}`;
    fetch(url)
        .then(resultado => resultado.json())
        .then(resultadoJson => {
            mostrarCotizacion(resultadoJson.DISPLAY[criptomonedas][moneda])
        })
        .catch(error => console.log(error));
}

function mostrarCotizacion(data){
    clearHTML();
    const{PRICE, HIGHDAY, LOWDAY, CHANGEPCT24HOUR, LASTUPDATE} = data;
    const answer = document.createElement('div');
    answer.classList.add('info')
    answer.innerHTML =`
                        <p class="precio-def">Precio: <span>${PRICE}</span></p>
                        <p>Precio mas alto del día: <span>${HIGHDAY}</span></p>
                        <p>Precio mas bajo del día: <span>${LOWDAY}</span></p>
                        <p>Variacion últimas 24 horas: <span>${CHANGEPCT24HOUR}%</span></p>
                        <p>Última actualización precio: <span>${LASTUPDATE}</span></p>
                        `;
    containerAnswer.appendChild(answer);
}

function showError(mensaje){
    const error = document.createElement('p');
    error.classList.add("error");
    error.textContent = mensaje;
    formContainer.appendChild(error);
    setTimeout(()=> error.remove(), 2000);
}

function getValue(e){
    objBusqueda[e.target.name] = e.target.value;
}

function consultaCripto(){
    const url = 'https://min-api.cryptocompare.com/data/top/mktcapfull?limit=10&tsym=USD';

    fetch(url)
        .then(respuesta => respuesta.json())
        .then(respuestaJson => {
        selectCriptos(respuestaJson.Data);
        console.log(respuestaJson.Data);
    })
    .catch(error => console.log(error));
}

function selectCriptos(criptos){
    criptos.forEach(cripto => {
        const{FullName, Name}= cripto.CoinInfo;
        const option = document.createElement("option");
        option.value = Name;
        option.textContent = FullName;
        criptomonedas.appendChild(option);
    });
}

function clearHTML(){
    containerAnswer.innerHTML = '';
}