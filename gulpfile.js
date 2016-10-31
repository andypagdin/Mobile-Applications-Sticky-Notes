var gulp = require( 'gulp' );
var gutil = require( 'gulp-util' );
var bower = require( 'bower' );
var concat = require( 'gulp-concat' );
var sass = require( 'gulp-sass' );
var minifyCss = require( 'gulp-minify-css' );
var rename = require( 'gulp-rename' );
var sh = require( 'shelljs' );

//////////////////////////////////
// Information - JH
// -------------------------------
// If anything needs to run in a certain order it will run in the order placed in these objects
// note ** means every folder *.extention means all of this type and these are ran alphabeticaly
// so core goes base, router, folders/all.js files [order by file name ASC].
//////////////////////////////////
var paths = {
	sass: [ './scss/*.scss', './scss/**/*.scss' ],
	controllers: [ './www/js/controllers/base.js', './www/js/controllers/**/*.js' ],
	core: [ './www/js/app/base.js', './www/js/app/router.js', './www/js/app/**/*.js' ],
	services: [ './www/js/services/base.js', './www/js/services/**/*.js' ]
};

gulp.task( 'default', [ 'default_console', 'sass', 'merge_controllers', 'merge_core', 'merge_services' ] );

var debug = false;
//////////////////////////////////
// Information - JH
// -------------------------------
// you might be thinking 'why is this here gulp already outputs whats running?'
// I can't read that due to the spacing
// also this shows that you are in the function in the event of an error.
//////////////////////////////////
function running( what, plural )
{
	if ( debug )
	{
		connector = ( plural ) ? 's are' : ' is'
		console.log( '//////////////////////////////////' );
		console.log( '// Gulp ' + what + ' task' + connector + ' running!' );
		console.log( '//////////////////////////////////' );
		console.log( '\n' );
	}
}

gulp.task( 'default_console', function ( done )
{
	running( 'default', true )
} );

gulp.task( 'sass', function ( done )
{
	running( 'sass', false )

	gulp.src( './scss/ionic.app.scss' )
		.pipe( sass( ) )
		.on( 'error', sass.logError )
		.pipe( gulp.dest( './www/css/' ) )
		.pipe( minifyCss(
		{
			keepSpecialComments: 1
		} ) )
		.pipe( rename(
		{
			extname: '.min.css'
		} ) )
		.pipe( gulp.dest( './www/css/' ) )
		.on( 'end', done );
} );

//////////////////////////////////
// Information - JH
// -------------------------------
// You might think 'why isn't this one task?'
// becuase they each affect their own file
// and they are triggered by thier own set of files.
//////////////////////////////////
gulp.task( 'merge_controllers', function ( done )
{
	running( 'merge_controllers', false )

	gulp.src( paths.controllers )
		.pipe( concat( 'controllers.js' ) )
		.pipe( gulp.dest( './www/js/' ) )
		.on( 'end', done );
} );

gulp.task( 'merge_core', function ( done )
{
	running( 'merge_core', false )

	gulp.src( paths.core )
		.pipe( concat( 'app.js' ) )
		.pipe( gulp.dest( './www/js/' ) )
		.on( 'end', done );
} );

gulp.task( 'merge_services', function ( done )
{
	running( 'merge_services', false )

	gulp.src( paths.services )
		.pipe( concat( 'services.js' ) )
		.pipe( gulp.dest( './www/js/' ) )
		.on( 'end', done );
} );

gulp.task( 'watch', function ( )
{
	running( 'watcher', true )

	gulp.watch( paths.sass, [ 'sass' ] );
	gulp.watch( paths.controllers, [ 'merge_controllers' ] );
	gulp.watch( paths.core, [ 'merge_core' ] );
	gulp.watch( paths.services, [ 'merge_services' ] );
} );

gulp.task( 'install', [ 'git-check' ], function ( )
{
	return bower.commands.install( )
		.on( 'log', function ( data )
		{
			gutil.log( 'bower', gutil.colors.cyan( data.id ), data.message );
		} );
} );

gulp.task( 'git-check', function ( done )
{
	if ( !sh.which( 'git' ) )
	{
		console.log(
			'  ' + gutil.colors.red( 'Git is not installed.' ),
			'\n  Git, the version control system, is required to download Ionic.',
			'\n  Download git here:', gutil.colors.cyan( 'http://git-scm.com/downloads' ) + '.',
			'\n  Once git is installed, run \'' + gutil.colors.cyan( 'gulp install' ) + '\' again.'
		);
		process.exit( 1 );
	}
	done( );
} );

