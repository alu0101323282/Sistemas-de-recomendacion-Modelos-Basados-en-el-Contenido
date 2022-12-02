
// Lee el fichero de texto
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
}, false)

// Lee el fichero de palabras de parada
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
}, false)

// Lee el fichero de lematización de términos
var corpus = document.getElementById('corpus');
corpus.addEventListener('change', function(e) {
  lematizacion = [];
  let reader = new FileReader();
  reader.readAsText(corpus.files[0]);
  reader.onload = function () {
    texto = reader.result.toString();
    lematizacion.push(JSON.parse(texto));
  }
}, false)

// Filtra las palabras de parada y aplica la lematización de términos
function filtrado() {
  texto = [];
  texto_entrada.forEach((linea) => {
    documento = [];
    linea.forEach((palabra) => {
      if(!palabras_parada.includes(palabra)) {
        if (lematizacion[0].hasOwnProperty(palabra)) {
          documento.push(lematizacion[0][palabra]);
        } else {
          documento.push(palabra);
        }
      }
    });
    texto.push(documento);
  });
  return texto;
}

// Extrae todos los términos de los documentos
function extraccionTerminos(texto) {
  var terminos = [];
  texto.forEach((documento) => {
    documento.forEach((palabra) => {
      if(!terminos.includes(palabra)) {
        terminos.push(palabra);
      }
    });
  });
  return terminos;
}

// Hace un recuento de aparación de términos por documentos
function recuento(texto) {
  var recuento = [];
  texto.forEach((documento) => {
    const contador = {};
    documento.forEach((palabra) => {
      if (contador[palabra]) {
        contador[palabra] += 1;
      } else {
        contador[palabra] = 1;
      }
    });
    recuento.push(contador);
  });
  return recuento;
}

// Calcula el DF
function calcularDf(terminos, recuento) {
  var df = [];
  terminos.forEach((termino) => {
    contador = 0;
    recuento.forEach((documento) => {
      if (documento[termino]) {
        contador += 1;
      }
    });
    df.push(contador);
  });
  return df;
}

// Calcula el TF
function calcularTf(terminos, recuento) {
  var tf = [];
  for (i = 0; i < recuento.length; i++) {
    aux = [];
    terminos.forEach((termino) => {
      if(recuento[i][termino]) {
        aux.push(1 + Math.log10(recuento[i][termino]));
      } else {
        aux.push(0);
      }
    });
    tf.push(aux);
  }
  return tf;
}

// Calcula el IDF
function calcularIdf(terminos, recuento) {
  const df = calcularDf(terminos, recuento);
  var idf = [];
  for(i = 0; i < terminos.length; i++) {
    idf.push(Math.log10(recuento.length/df[i]));
  }
  return idf;
}

// Calcula la longitud de los vectores de TF de cada documento
function longitudVectores(tf) {
  var long_vectores = []
  tf.forEach((documento) => {
    longitud = 0
    documento.forEach((valor) => {
      longitud += Math.pow(valor, 2);
    });
    long_vectores.push(Math.sqrt(longitud));
  });
  return long_vectores;
}

// Calcula el TF-IDF
function calcularTfIdf(terminos, tf) {
  const long_vectores = longitudVectores(tf);
  var tfIdf = [];
  for(i = 0; i < tf.length; i++) {
    var aux = [];
    for(j = 0; j < terminos.length; j++) {
      aux.push(tf[i][j]/long_vectores[i]);
    }
    tfIdf.push(aux);
  }
  return tfIdf;
}

// Calcula la similaridad entre cada par de documentos calculando los valores del coseno
function similaridadCoseno(terminos, tfIdf) {
  var similaridades = [];
  for(i = 0; i < tfIdf.length; i++) {
    var simDoc = [];
    for(j = 0; j < tfIdf.length; j++) {
      var sim = 0;
      if (i === j) {
        sim = '-';
      } else {
        for(k = 0; k < terminos.length; k++) {
          sim += tfIdf[i][k] * tfIdf[j][k];
        }
      }
      simDoc.push(sim);
    }
    similaridades.push(simDoc);
  }
  return similaridades;
}

// Función principal del sistema de recomendación
function sistemaRecomendacion() {
  const texto = filtrado();
  const terminos  = extraccionTerminos(texto);
  const rec = recuento(texto);
  const tf = calcularTf(terminos, rec);
  const idf = calcularIdf(terminos, rec);
  const tfIdf = calcularTfIdf(terminos, tf);
  const similaridades = similaridadCoseno(terminos, tfIdf);
  console.log(similaridades);
  return {'terminos': terminos, 'TF': tf, 'IDF': idf, 'TFIDF': tfIdf, 'similaridades': similaridades};
}

// Función llamada desde index.html
function run() {
  const resultado = sistemaRecomendacion();
  var tablas = '';
  for(i = 0; i < resultado.TF.length; i++) {
    num = i+1;
    tablas += '<h2>Documento ' + num + '</h2><table><tr><td>Índice</td><td>Términos</td><td>TF</td><td>IDF</td><td>TF-IDF</td></tr>';
    var indice = 1;
    for(j = 0; j < resultado.terminos.length; j++) {
      if (resultado.TF[i][j] !== 0) {
        tablas += '<tr>';
        tablas += '<td>' + indice + '</td>';
        tablas += '<td>' + resultado.terminos[j] + '</td>';
        tablas += '<td>' + resultado.TF[i][j] + '</td>';
        tablas += '<td>' + resultado.IDF[j] + '</td>';
        tablas += '<td>' + resultado.TFIDF[i][j] + '</td>';
        tablas += '</tr>';
        indice ++;
      }
    }
    tablas += '</table>';
  }
  var similaridades = '<h2>Similaridades</h2><table><tr><td>Documentos</td>';
  var indice = 1;
  for(i = 0; i < resultado.similaridades.length; i++) {
    similaridades += '<td>' + indice + '</td>';
    indice++;
  }
  similaridades += '</tr>';
  indice = 1;
  for(i = 0; i < resultado.similaridades.length; i++) {
    similaridades += '<tr><td>' + indice + '</td>';
    for(j = 0; j < resultado.similaridades[i].length; j++) {
      similaridades += '<td>' + resultado.similaridades[i][j] + '</td>';
    }
    similaridades += '</tr>';
    indice++;
  }
  similaridades += '</table>';
  document.getElementById('tablas').innerHTML = tablas;
  document.getElementById('similaridades').innerHTML = similaridades;
}