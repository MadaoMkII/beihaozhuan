(function() {

  const layout = document.querySelector('#layout');

  const pages = document.querySelectorAll('.page');

  const Height = layout.offsetHeight;

  const Width = layout.offsetWidth;


  const audio = document.querySelector('audio');

  const musicLogo = document.querySelector('.music-logo');

  const isStart = false;


  window.spHeight = Height;

  // Z.onTouchStart( pages[0], function () {
  //
  // 	if ( isStart == false ) {
  //
  // 		musicLogo.classList.add( "playing" );
  //
  // 		audio.src = "images/bg.mp3";
  //
  // 		audio.play();
  //
  // 	}
  //
  // 	isStart = true;
  //
  // } );
  //
  // Z.onTap( musicLogo, function () {
  //
  // 	musicLogo.classList.contains( "playing" ) ? audio.pause() : audio.play();
  //
  // 	musicLogo.classList.toggle( "playing" );
  //
  // } );


  const page5MapWidth = Height * 0.3194 * 511 / 384;

  Z.insertCSSRules({

    '.page5-arrow-point': {

      left: (Width - page5MapWidth) / 2 + page5MapWidth * 0.3189 + 'px',

    },

    '.page2-bh': {

      left: (Width - Height * 0.45) / 2 + 'px',

    },

    '.page3-circle-point.a': {

      top: (Height * 0.4375 - 15) + 'px',

      left: (Width / 2 - 15) + 'px',

    },

    '.page3-circle-point.b': {

      top: (Height * 0.5952 - 15) + 'px',

      left: (Width / 2 + Height * 0.09 - 15) + 'px',

    },

    '.page3-circle-point.c': {

      top: (Height * 0.7529 - 30) + 'px',

      left: (Width / 2 - Height * 0.09 - 15) + 'px',

    },

    '.page3-img2': {

      bottom: (Height * 0.4048 + 15) + 'px',

      left: (Width / 2 + Height * 0.09) + 'px',

      '-webkit-transform': 'translate3d(-50%,0,0)',

    },

    '.page3-img3': {

      bottom: (Height * 0.2471 + 30) + 'px',

      left: (Width / 2 - Height * 0.09) + 'px',

      '-webkit-transform': 'translate3d(-50%,0,0)',

    },

  });


  // 第0页

  pages[0].onCut = function() {

    setTimeout(function() {

      pages[0].classList.add('animate');

    }, 0);

  };

  pages[0].onRemove = function() {

    this.classList.remove('animate');

  };
  // 第1页

  pages[1].onCut = function() {

    this.classList.add('animate');

  };

  pages[1].onRemove = function() {

    this.classList.remove('animate');

  };

  // 第2页

  pages[2].onCut = function() {

    this.classList.add('animate');

  };

  pages[2].onRemove = function() {
    this.classList.remove('animate');
  };

  // 第3页

  pages[3].onCut = function() {

    this.classList.add('animate');

  };

  pages[3].onRemove = function() {

    this.classList.remove('animate');

  };
  // 第4页

  pages[4].onCut = function() {

    this.classList.add('animate');

  };

  pages[4].onRemove = function() {

    this.classList.remove('animate');

  };
  // 第5页

  pages[5].onCut = function() {

    this.classList.add('animate');

  };

  pages[5].onRemove = function() {

    this.classList.remove('animate');

  };

  setTimeout(function() {
    document.body.removeChild(document.querySelector('.page-loading'));
    lib.ScreenSystem(document.getElementById('layout'));
  }, 300);

  document.body.addEventListener('touchmove', function(e) {
    e.preventDefault();
  }, { passive: false });


})();

