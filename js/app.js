
// Lectura de fichero de texto
var fichero = document.getElementById('fichero');
fichero.addEventListener('change', function(e) {
  texto_entrada = [];
  let reader = new FileReader();
  reader.readAsText(fichero.files[0]);
  reader.onload = function () {
    let texto = reader.result.toString().toLowerCase();
    var regex = /[.,]/g;
    texto = texto.replace(regex, '');
    let filas = texto.split(/\r\n|\r|\n/);
    filas.forEach((f) => {
      let fila = f.split(' ');
      texto_entrada.push(fila);
    })
  }
  console.log(texto_entrada);
}, false)

// Lectura de fichero de palabras de parada
var stop_words = document.getElementById('stop-words');
stop_words.addEventListener('change', function(e) {
  palabras_parada = [];
  let reader = new FileReader();
  reader.readAsText(stop_words.files[0]);
  reader.onload = function () {
    let texto = reader.result.toString();
    let palabra = texto.split(/\r\n|\r|\n/);
    palabra.forEach((f) => {
      palabras_parada.push(f);
    })
  }
  console.log(palabras_parada);
}, false)

// Lectura de fichero de lematización de términos
var corpus = document.getElementById('corpus');
corpus.addEventListener('change', function(e) {
  lematizacion = [];
  let reader = new FileReader();
  reader.readAsText(corpus.files[0]);
  reader.onload = function () {
    texto = reader.result.toString();
    lematizacion.push(JSON.parse(texto));
  }
  console.log(lematizacion);
}, false)

// Filtrado de palabras de parada y lematización de términos
function filtrado() {
  texto = [];
  texto_entrada.forEach((linea) => {
    fila = [];
    linea.forEach((palabra) => {
      if(!palabras_parada.includes(palabra)) {

        if (lematizacion.hasOwnProperty(palabra)) {
          fila.push(lematizacion[palabra]);
        } else {
          fila.push(palabra);
        }
      }
    });
    texto.push(fila);
  });
  console.log(texto);
}



// Función principal del sistema de recomendación
function sistemaRecomendacion(metrica, prediccion, numero_vecinos, medias_vecinos, vecinos_seleccionados, predicciones) {
    let matriz_salida = [];
    for(let i = 0; i < matriz_entrada.length; i++) {
        let fila = [];
        for(let j = 0; j < matriz_entrada[i].length; j++) {
            fila.push(matriz_entrada[i][j]);
        }
        matriz_salida.push(fila);
    }
    for(let i = 0; i < matriz_entrada.length; i++) {
        for(let j = 0; j < matriz_entrada[i].length; j++) {
            if(matriz_entrada[i][j] === '-') {
                let similitudes = [];
                let vecinos = [];
                switch (metrica) {
                  case 'Correlación de Pearson':
                    for(let k = 0; k < matriz_entrada.length; k++) {
                      similitudes.push(pearson(matriz_entrada, medias_vecinos, i, k));
                    }
                    break;
                  case 'Distancia coseno':
                    for(let k = 0; k < matriz_entrada.length; k++) {
                      similitudes.push(coseno(matriz_entrada, i, k));
                    }
                    break;
                  case 'Distancia Euclídea':
                    for(let k = 0; k < matriz_entrada.length; k++) {
                      similitudes.push(euclidea(matriz_entrada, i, k));
                    }
                    break;
                }
                let aux = [];
                for(let l = 0; l < similitudes.length; l++) {
                    aux.push(similitudes[l]);
                }
                while (vecinos.length !== numero_vecinos) {
                    if((aux.indexOf(Math.max(...aux)) !== i) && (matriz_entrada[aux.indexOf(Math.max(...aux))][j] != '-')) {  
                      vecinos.push(aux.indexOf(Math.max(...aux)));
                    }
                    aux[aux.indexOf(Math.max(...aux))] = -100;
                }
                vecinos_seleccionados.push(vecinos);
                switch (prediccion) {
                    case 'Predicción simple':
                        predicciones.push(parseFloat(predSimple(j, vecinos, similitudes, matriz_entrada))  * (max - min) + min);
                        matriz_salida[i][j] = '<b><u>' + Math.round(parseFloat(predSimple(j, vecinos, similitudes, matriz_entrada))  * (max - min) + min) + '</u></b>';
                    break;
                    case 'Diferencia con la media':
                        predicciones.push(parseFloat(diferenciaMedia(i, j, vecinos, medias_vecinos, similitudes, matriz_entrada)) * (max - min) + min);
                        matriz_salida[i][j] = '<b><u>' + Math.round(parseFloat(diferenciaMedia(i, j, vecinos, medias_vecinos, similitudes, matriz_entrada)) * (max - min) + min) + '</u></b>';
                    break;
                }
            }
        }
    }
    for(let i = 0; i < matriz_salida.length; i++) {
      for(let j = 0; j < matriz_salida[i].length; j++) {
          if(typeof matriz_salida[i][j] === "number") {
            matriz_salida[i][j] = (matriz_salida[i][j] * (max - min) + min);
          }
      }
  }
    return matriz_salida;
}

// Función llamada desde index.html
function run() {
    let metrica = document.getElementById('metrica').value;
    let prediccion = document.getElementById('tipo_prediccion').value;
    let medias_vecinos = medias(matriz_entrada);
    let vecinos_seleccionados = [];
    let predicciones = [];
    let numero_vecinos = parseInt(document.getElementById('numero_vecinos').value);
    if ((numero_vecinos < 1) || (numero_vecinos >= matriz_entrada.length)) {
      alert('ERROR: Debe elegir al menos 1 y como máximo ' + (matriz_entrada.length - 1)  + ' vecinos');
      throw new Error();
    }
    let matriz_resultado = sistemaRecomendacion(metrica, prediccion, numero_vecinos, medias_vecinos, vecinos_seleccionados, predicciones);
    console.log(matriz_resultado);
    let salida = '<h2>Resultados:</h2><h3>Matriz:</h3>';
    for(let i = 0; i < matriz_resultado.length; i++) {
        for(let j = 0; j < matriz_resultado[i].length; j++) {
           salida += matriz_resultado[i][j] + ' '; 
        }
        salida += '<br>';
    }
    salida += '<h3>Similaridad entre vecinos - ' + metrica + ':</h3>';
    for(let i = 0; i < matriz_resultado.length; i++) {
        salida += '<h4>Vecino ' + (i+1) + ':</h4>';
        for(let j = 0; j < matriz_resultado.length; j++) {
           if(i !== j) {
             switch (metrica) {
               case 'Correlación de Pearson':
                 salida += 'Con vecino ' + (j+1) + ': <b>' + pearson(matriz_entrada, medias_vecinos, i, j) + '</b><br>';
                 break;
              case 'Distancia coseno':
                  salida += 'Con vecino ' + (j+1) + ': <b>' + coseno(matriz_entrada, i, j) + '</b><br>';
                  break;
                case 'Distancia Euclídea':
                  salida += 'Con vecino ' + (j+1) + ': <b>' + euclidea(matriz_entrada, i, j) + '</b><br>';
                  break;
             }
           }
        }
    }
    salida += '<h3>Vecinos seleccionados:</h3>';
    let l = 0;
    for(let i = 0; i < matriz_resultado.length; i++) {
        for(let j = 0; j < matriz_resultado[i].length; j++) {
          if(matriz_entrada[i][j] === '-') {
            salida += 'Predicción calificación del Vecino ' + (i+1) + ' al item ' + (j+1) + ': <b>vecinos ';
            for(let k = 0; k < numero_vecinos; k++) {
              salida += (parseInt(vecinos_seleccionados[l][k]) + 1);
              if (k === numero_vecinos-2) {
                salida += ' y ';
              } else if (k === numero_vecinos-1) {
                salida += ' ';
              } else {
                salida += ', ';
              }
            }
            salida += '</b><br>';
            l++;
          }
        }
    }
    salida += '<h3>Predicciones de la matriz de utilidad en base a los vecinos seleccionados:</h3>';
    k = 0;
    for(let i = 0; i < matriz_resultado.length; i++) {
        for(let j = 0; j < matriz_resultado[i].length; j++) {
          if(matriz_entrada[i][j] === '-') {
            salida += 'Predicción calificación del Vecino ' + (i+1) + ' al item ' + (j+1) + ': <b>';
            salida += predicciones[k] + '</b><br>';
            k++;
          }
        }
    }
    document.getElementById('salida').innerHTML = salida;
}