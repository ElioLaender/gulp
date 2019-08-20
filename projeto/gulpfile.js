// Chamada na lib do gulp
const gulp = require("gulp");
// Chamada na extensão para minificar imagem do gulp
const imgMin = require("gulp-imagemin");
// Chamada na extensão responsável por excluir os arquivos de um dado diretório
const clean = require("gulp-clean");
// Realiza a concatenação de scripts
// const concat = require("gulp-concat");
// Substitui as tags de importação após concatenação.
// const htmlReplace = require("gulp-html-replace");
// Minifica os scripts JS (retira espaços e quebras de linhas)
const uglify = require("gulp-uglify");
// Para minificação do CSS
const cssMin = require("gulp-cssmin");
// Facilita a troca de tags após contatenação/minificação
const useMin = require("gulp-usemin");
// Cria um servidor para rodar a aplicação
const browserSync = require("browser-sync");
// Responsável por verificar erros de sintaxes no JS
const jsHint = require("gulp-jshint");
// Responsável por melhorar a forma como erros são descritos no terminal pelo jshint
const jsHintStylish = require("gulp-jshintStylish");
// Verifica erros de sintaxe no css
const cssHint = require("gulp-csslint");
// Realiza prefixação dos atributos exprerimentais nos navegadores
const autoPrefixer = require("gulp-autoprefixer");
// Responsável por automatizar compilação de arquivos less
const less = require('gulp-less');


/**
 * O gulp funciona a partir de tarefas, que são scripts contendo pipes com instruções para tratar os arquivos.
 * Aqui temos uma task para minificar as imagens do projeto.
 *
 * Ex de chamada dessa task: 'npm run gulp build-img'
 * Lembrando é uma boa prática anexar o gulp no campo scripts do package json, para acessarmos com maior facilidade.
 */


gulp.task("server", () => {
  browserSync.init({
    baseDir: 'src' // Seta o diretório raiz que o servidor irá apontar quando ativo.  
  });

  // Escuca alterações no JS e notifica erros de sintaxe.
  gulp.watch("src/**/*.js")
    .on("change", (event) => {
      gulp.src(event.path) // retorna o caminho do arquivo que disparou o evento.
        .pipe(jsHint()) // Verifica sintaxe js dos scripts modificados
        .pipe(jsHint.reporter(jsHintStylish));
    })

   // Escuca alterações no CSS e notifica erros de sintaxe.
   gulp.watch("src/**/*.css")
   .on("change", (event) => {
     gulp.src(event.path) // retorna o caminho do arquivo que disparou o evento.
       .pipe(cssHint()) // Verifica sintaxe js dos scripts modificados
       .pipe(cssHint.reporter());
   })  

  // Compila arquivos do tipo less quando ocorre mudanças no mesmo. 
  gulp.watch('src/less/**/*.less').on('change', function(event) {
    var stream = gulp.src(event.path)
         .pipe(less().on('error', (erro) => { // Tratando erro, pois um erro não capturado de um stream derruba todos os outros! (server para)
            console.log('LESS, erro compilação: ' + erro.filename);
           console.log(erro.message);
         }))
         .pipe(gulp.dest('src/css'));
 });

  // Função nativa do gulp para escutar alterações nos scripts. 
  gulp.watch("src/**/*") // Escuta todos os arquivos dentro de src
    .on("change", browserSync.reload); // Caso o evento change for disparado recarrega a página. 
});

// Tarefa padrão que será executada por default caso não seja passado o nome de uma tarefa ao executar o gulp no terminal
gulp.task('default', ['copy'], () => {
  // Realiza chamada nas tasks passadas por parâmetro PS: Essas tasks não possui return na implementação, assim sendo, serão 
  // executadas de forma assíncrona, sem ordem de um para outra. Obs: quando tem return, é tratada como promisse. 
  gulp.start('build-img', 'usemin');
});

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

gulp.task("build-img", () => {
  gulp
    .src("dist/img/**/*") // Local dos arquivos a serem tratados. Glob pattern '**':todos os diretórios a partir do que foi passado. '*':arquivos de todas extensões.
    .pipe(imgMin()) // Pipe passando as os arquivos na minificaçao
    .pipe(gulp.dest("dist/img")); // Pipe informando o local de saída dos arquivos.
});

gulp.task("usemin", () => {
  gulp.src('dist/**/*.html')
    .pipe(useMin({
      'js': [uglify],
      'css': [autoPrefixer, cssMin]
    }))
    .pipe(gulp.dest('dist'));
});
// SUBSTITUIDO POR MELHORIA NO SCRIPT A PARTIR DO GULP USEADMIN
// gulp.task("build-js", () => {
//   gulp
//     // Para que não ocorra erro de concatenação, devemos definir a ordem dos scripts 
//     .src(["dist/js/jquery.js", "dist/js/home.js", "dist/js/produto.js"])
//     .pipe(concat("all.js")) // Nome do arquivo com a concatenação de todo js encontrado.
//     .pipe(uglify()) // Minifica o all.js após a concatenação.
//     .pipe(gulp.dest("dist/js"));
// });

// /**
//  * Ex de chamada para realizar replace nas importações. Quando uttilizamos o html replace, ele percorre os arquivis html buscando pelo nome do build desejado
//  * substituindo essas importações pela importação do arquivo minificado.
//  * <!-- build:nomeDoBuild -->
//  *  < aqui vem as tags de importação do js no html
//  * <!-- endbuild -->
//  */
// gulp.task("build-html", () => {
//   gulp
//     .src("dist/js/**/*.html")
//     .pipe(
//       htmlReplace({
//         js: "js/all.js" // Procuta em todos htmls pela build js e substitui pela importação de 'all.js'
//       })
//     )
//     .pipe(gulp.dest("dist"));
// }); // Parou no minuto 11
