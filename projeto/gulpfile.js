// Chamada na lib do gulp
const gulp = require("gulp");
// Chamada na extensão para minificar imagem do gulp
const imgMin = require("gulp-imagemim");
// Chamada na extensão responsável por excluir os arquivos de um dado diretório
const clean = require("gulp-clean");
// npm install gulp concat --save-dev
const concat = require("gulp-concat"); // Realiza a concatenação de scripts
// npm install gulp-html-replace
const htmlReplace = require("gul-html-replace"); // Substitui as tags de importação após concatenação.

/**
 * O gulp funciona a partir de tarefas, que são scripts contendo pipes com instruções para tratar os arquivos.
 * Aqui temos uma task para minificar as imagens do projeto.
 *
 * Ex de chamada dessa task: 'npm run gulp build-img'
 * Lembrando é uma boa prática anexar o gulp no campo scripts do package json, para acessarmos com maior facilidade.
 */

/**
 * É possível listar as tarefas que devem ser executadas antes da task que foi chamada. Basta adicionar o nome das demais tasks que deverão ser executadas
 * antes da que foi chamada. Listamos as outras tasks no segundo parâmetro, que é um array de nomes, Ex: ["copy", "clean", "etc"]
 * No Gulp, a execução das tasks são assíncronas, por esse motivo, quando existirem tarefas que dependem de outras, devemos colocar um return sobre
 * a chamada do gulp, que retornará uma promisse para a task que está chamando.
 */
gulp.task("copy", ["clean"], () => {
  return gulp.src("src/**/*").pipe(gulp.dest("dist"));
});

gulp.task("clean", () => {
  return gulp.src("dist").pipe(clean());
});

gulp.task("build-img", ["copy"], function() {
  gulp
    .src("dist/img/**/*") // Local dos arquivos a serem tratados. Glob pattern '**':todos os diretórios a partir do que foi passado. '*':arquivos de todas extensões.
    .pipe(imagemin()) // Pipe passando as os arquivos na minificaçao
    .pipe(gulp.dest("dist/img")); // Pipe informando o local de saída dos arquivos.
});

gulp.task("build-js", () => {
  gulp
    .src("dist/js/**/*.js")
    .pipe(concat("all.js")) // Nome do arquivo com a concatenação de todo js encontrado.
    .pipe(gulp.dest("dist/img"));
});

/**
 * Ex de chamada para realizar replace nas importações. Quando uttilizamos o html replace, ele percorre os arquivis html buscando pelo nome do build desejado
 * substituindo essas importações pela importação do arquivo minificado.
 * <!-- build:nomeDoBuild -->
 *  < aqui vem as tags de importação do js no html
 * <!-- endbuild -->
 */
gulp.task("build-html", () => {
  gulp
    .src("dist/js/**/*.html")
    .pipe(
      htmlReplace({
        js: "all.js" // Procuta em todos htmls pela build js e substitui pela importação de 'all.js'
      })
    )
    .pipe(gulp.dest("dist"));
}); // Parou no minuto 11
