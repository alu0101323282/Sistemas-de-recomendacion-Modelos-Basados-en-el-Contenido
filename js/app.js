
// Lectura de matriz desde fichero
var fichero = document.getElementById('fichero');
fichero.addEventListener('change', function(e) {
    matriz_entrada = [];
    let reader = new FileReader();
    reader.readAsText(fichero.files[0]);
    reader.onload = function () {
      let lineas = reader.result.toString();
      let filas = lineas.split(/\r\n|\r|\n/);
      let normalize = filas[0].split(' ');
      min = parseInt(normalize[0]);
      max = parseInt(normalize[1]);
      filas.shift();
      filas.forEach((f) => {
        let fila = f.split(' ');
        fila = fila.map(i => {
            console.log(i);
            if (i === '-'){
              return i;
            } else {
              return (i - min)/(max - min);
            }
        });
        matriz_entrada.push(fila);
      })
    }
    console.log(matriz_entrada);
  }, false)

// Calculo de medias de los vecinos
function medias(matriz) {
    let medias = [];
    for(i = 0; i < matriz.length; i++) {
        let suma = 0;
        let elementos = 0;
        for(j = 0; j < matriz[i].length; j++) {
            if(matriz[i][j] !== '-') {
                suma += parseInt(matriz[i][j]);
                elementos ++;
            }
        }
        medias.push(suma/elementos);
    }
    return medias;
}

// Algoritmo de métrica de correlación de Pearson
function pearson(matriz, medias, vecino1, vecino2) {
    let numerador = 0;
    let raiz1 = 0;
    let raiz2 = 0;
    for (let i = 0; i < matriz[0].length; i++) {
        if ((matriz[vecino1][i] !== '-') && (matriz[vecino2][i] !== '-')) {
            let diferencia1 = matriz[vecino1][i] - medias[vecino1];
            let diferencia2 = matriz[vecino2][i] - medias[vecino2];
            numerador += diferencia1 * diferencia2;
            raiz1 += Math.pow((matriz[vecino1][i] - medias[vecino1]), 2);
            raiz2 += Math.pow((matriz[vecino2][i] - medias[vecino2]), 2);
        }
    }
    let denominador = Math.sqrt(raiz1) * Math.sqrt(raiz2);
    return parseFloat((numerador/denominador).toFixed(2));
}

// Algoritmo de métrica de distancia coseno
function coseno(matriz, vecino1, vecino2) {
    let numerador = 0;
    let raiz1 = 0;
    let raiz2 = 0;
    for (let i = 0; i < matriz[0].length; i++) {
        if ((matriz[vecino1][i] !== '-') && (matriz[vecino2][i] !== '-')) {
            numerador += matriz[vecino1][i] * matriz[vecino2][i];
            raiz1 += Math.pow(matriz[vecino1][i], 2);
            raiz2 += Math.pow(matriz[vecino2][i], 2);
        }
    }
    let denominador = Math.sqrt(raiz1) * Math.sqrt(raiz2);
    return parseFloat((numerador/denominador).toFixed(2));
}

// Algoritmo de métrica de distancia euclídea
function euclidea(matriz, vecino1, vecino2) {
    let sumatorio = 0;
    for (let i = 0; i < matriz[0].length; i++) {
        if ((matriz[vecino1][i] !== '-') && (matriz[vecino2][i] !== '-')) {
            sumatorio += Math.pow((matriz[vecino1][i] - matriz[vecino2][i]), 2);
        }
    }
    console.log(parseFloat((Math.sqrt(sumatorio)).toFixed(2)));
    return parseFloat((Math.sqrt(sumatorio)).toFixed(2));
}

// Algoritmo de predicción simple
function predSimple(item, vecinos, similitudes, matriz) {
    let numerador = 0;
    let denominador = 0;
    for(let i = 0; i < vecinos.length; i++) {
        numerador += similitudes[vecinos[i]] * matriz[vecinos[i]][item];
        denominador += Math.abs(similitudes[vecinos[i]]);
    }
    return numerador/denominador;
}

// Algoritmo de predicción de diferencia con la media
function diferenciaMedia(usuario, item, vecinos, medias, similitudes, matriz) {
    let numerador = 0;
    let denominador = 0;
    for(let i = 0; i < vecinos.length; i++) {
        numerador += similitudes[vecinos[i]] * (matriz[vecinos[i]][item] - medias[vecinos[i]]);
        denominador += Math.abs(similitudes[vecinos[i]]);
    }
    return medias[usuario] + numerador/denominador;
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