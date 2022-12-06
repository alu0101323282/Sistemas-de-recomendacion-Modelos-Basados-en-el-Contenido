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

# Ejemplo de uso:
1. Elegir un fichero de texto plano con los documentos a analizar. Cada línea debe corresponder con un documento diferente: </br>
  This is a dry wine ...</br>
  Slightly reduced ...</br>
  This is dominated ...</br>
  Building on 150 ...</br>
  Zesty orange peels ...</br>

2. Elegir un fichero de texto plano con las palabras de parada. Cada palabra debe estar separa por un salto de línea:</br>
  a</br>
  able</br>
  about</br>
  above</br>
  abroad</br>

3. Elegir un fichero de lematización de términos. Este debe estar escrito en formato clave-valor, indicando para cada término su sustitución: </br>
  {"is":"be","was":"be","does":"do","doing":"do", ... }
  
4. Hacer click en el botón [Aceptar]

![ModelosBC](https://user-images.githubusercontent.com/72404949/205883711-41b9be96-a06d-49f6-8e13-8b51f43b6a2b.jpg)
