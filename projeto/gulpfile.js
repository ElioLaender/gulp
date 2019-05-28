// Chamada na lib do gulp
const gulp = require("gulp");
// Chamada na extensão para minificar imagem do gulp
const imgMin = require("gulp-imagemim");

/**
 * O gulp funciona a partir de tarefas, que são scripts contendo pipes com instruções para tratar os arquivos.
 * Aqui temos uma task para minificar as imagens do projeto.
 *
 * Ex de chamada dessa task: 'npm run gulp build-img'
 * Lembrando é uma boa prática anexar o gulp no campo scripts do package json, para acessarmos com maior facilidade.
 */
gulp.task("build-img", () => {
  gulp
    .src("src/img/**/*") // Local dos arquivos a serem tratados. Glob pattern '**':todos os diretórios a partir do que foi passado. '*':arquivos de todas extensões.
    .pipe(imgMin()) // Pipe passando as os arquivos na minificaçao
    .pipe(gulp.dest("dist/img")); // Pipe informando o local de saída dos arquivos.
});
