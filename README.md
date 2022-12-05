# Explicación del código
  Para el desarrollo de esta aplicación web se han utilizado HTML, CSS y JavaScript, así como el framework de diseño MaterializeCSS y la librería jQuery. El código desarrollado consta de un bloque de código encargado de lectura y extracción de datos de los ficheros de entrada (documentos, palabras de parada y lematización de términos) y de una serie de funciones que se encargarán de la aplicación de los algoritmos correspondientes y la muestra final de resultados en la interfaz de la aplicación web.
  De esta forma, se tienen las siguientes funciones:
  - filtrado(): Filtra las palabras de parada y aplica la lematización de términos.
  - extraccionTerminos(): Extrae todos los términos de los documentos.
  - recuento(): Hace un recuento de aparación de términos por documentos.
  - calcularDf(): Calcula el DF.
  - calcularTf(): Calcula el TF.
  - calcularIdf(): Calcula el IDF.
  - longitudVectores(): Calcula la longitud de los vectores de TF de cada documento.
  - calcularTfIdf(): Calcula el TF-IDF.
  - similaridadCoseno(): Calcula la similaridad entre cada par de documentos calculando los valores del coseno.
  - sistemaRecomendacion(): Es la función principal del sistema de recomendación.
  - run(): Es la función que inicia la ejecución del programa, es la encargada de llamar al sistema de recomendación y mostrar los resultados en la interfaz gráfica de la aplicación.
  
  En cuanto a su uso, a la aplicación se le debe dar como entrada un fichero de texto plano con los documentos a analizar, otro fichero de texto plano con las palabras de parada, y un fichero de lematización de términos en formato clave-valor. Está aplicación web ha sido desplegada a través de Github Pages y puede ser visitada a través del siguiente enlace: [Modelos basados en el contenido](https://alu0101323282.github.io/Sistemas-de-recomendacion-Modelos-Basados-en-el-Contenido/)

# Ejemplo del funcionamiento:
1. Elegir un fichero con el siguiente formato: </br>
  1 5</br>
  5 3 4 4 -</br>
  3 1 2 3 3</br>
  4 3 4 3 4</br>
  3 3 1 5 4</br>
  1 4 4 2 1</br>

2. Elegir una métrica:</br>
  Correlación de Pearson

3. Escoger el número de vecinos: </br>
  3
4. Tipo de predicción:</br>
  Predicción simple

![image](https://user-images.githubusercontent.com/72199884/198886502-748286df-f4c8-4899-8c0d-d48923d7be74.png)
