// Remove all the changes done before the modal had opened and close it
function closeInlineModal() {
  jQuery('body').removeClass('overflow-hidden');
  jQuery('html').removeClass('overflow-hidden');
  jQuery('#inlineBox').fadeOut();
  jQuery('#inlineBox').html('');
  jQuery('#inlineBox').removeClass('inline-box-open');
  jQuery('#inlineBox-overlay').fadeOut();
  jQuery('#inlineBox-close').fadeOut();
  jQuery('#inlineBox').off('click');
  jQuery('#inlineBox-close').off('click');
  jQuery('#inlineBox-content video').remove();
  jQuery('#inlineBox-content iframe').remove();
  jQuery('#inlineBox-content').remove();
  jQuery('#inlineBox-title').remove();
  jQuery('#inlineBox-desc').remove();
  jQuery('#inlineBox-content').removeClass('iframe-content');
  jQuery('#inlineBox-poster').css('background-image', 'unset');
  jQuery('#inlineBox').remove();
  jQuery('#inlineBox-content').remove();
  jQuery('#inlineBox-overlay').remove();
  jQuery('#inlineBox-close').remove();
}

// Hide the loading and the loading poster image and display the content
function canPlayFunc() {
  jQuery('#inlineBox-poster').fadeOut();
  jQuery('#inlineBox-loading').fadeOut();
  jQuery('#inlineBox-loading-text').fadeOut();
  jQuery('#inlineBox-content').fadeIn();
}

// Append the title and description to above and bellow the modal, respectively
function appendTitleDesc(el) {
  const title = jQuery(el).data('inline-box-title') || jQuery(el).data('ib-t');
  const desc = jQuery(el).data('inline-box-desc') || jQuery(el).data('ib-d');
  if (title)
    jQuery('#inlineBox-content').append(
      '<div id="inlineBox-title" class="inline-box-text">' + title + '</div>'
    );
  if (desc)
    jQuery('#inlineBox-content').append(
      '<div id="inlineBox-desc" class="inline-box-text">' + desc + '</div>'
    );
}

function createVideoContent(contentPath, contentExtension, poster) {
  jQuery('#inlineBox-content').addClass('video-content');
  // Create the HTML element
  const video = jQuery(
    '<video id="inlineBox-video"' +
      getPosterAttrString(poster) +
      'src="' +
      contentPath +
      '" type="video/' +
      contentExtension +
      '" autoplay controls playsinline crossorigin />'
  );
  video.appendTo(jQuery('#inlineBox-content'));

  // const videoElem = document.querySelector('#inlineBox-content video');
  // videoElem.addEventListener('loadedmetadata', canPlayFunc);
  // videoElem.addEventListener('canplay', canPlayFunc);

  // Instantiate the Plyr player lib
  const player = new Plyr('#inlineBox-video', {
    controls: [
      'play',
      'progress',
      'current-time',
      'mute',
      'volume',
      'fullscreen',
    ],
    autoplay: true,
  });
  // Bind event to hide loading and display the player
  player.on('loadedmetadata', function (event) {
    canPlayFunc();
  });
  // Fix for 'canplay' on some iOS devices
  player.on('canplay', function (event) {
    canPlayFunc();
  });
  window.player = player;
}

function createAudioContent(contentPath, contentExtension) {
  jQuery('#inlineBox-content').addClass('audio-content');
  // Create the HTML element
  const audio = jQuery(
    '<audio id="inlineBox-audio" controls autoplay src="' +
      contentPath +
      '"  type="audio/' +
      contentExtension +
      '" />'
  );
  audio.appendTo(jQuery('#inlineBox-content'));

  // Code to use the native HTML5 player:
  // const audioElem = document.querySelector('#inlineBox-content audio');
  // audioElem.addEventListener('loadedmetadata', canPlayFunc);
  // audioElem.addEventListener('canplay', canPlayFunc);

  // Instantiate the Plyr player lib
  const player = new Plyr('#inlineBox-audio', {
    controls: ['play', 'progress', 'current-time', 'mute', 'volume'],
    autoplay: true,
  });
  // Bind event to hide loading and display the player
  player.on('loadedmetadata', function (event) {
    canPlayFunc();
  });
  // Fix for 'canplay' on some iOS devices
  player.on('canplay', function (event) {
    canPlayFunc();
  });
  window.player = player;
}

function createIframeContent(contentPath) {
  // Create the HTML element
  jQuery('<iframe>', {
    src: contentPath,
    id: 'inlineBox-iframe',
    frameborder: 0,
  }).appendTo('#inlineBox-content');
  jQuery('#inlineBox-content').addClass('iframe-content');
  // Bind event to hide loading and display the iframe
  jQuery('#inlineBox-content iframe').load(function () {
    canPlayFunc();
  });
}

function createVideoSourceSetContent(el, poster) {
  jQuery('#inlineBox-content').addClass('video-content');
  // Create the HTML element
  const video = jQuery(
    '<video id="inlineBox-video" ' +
      getPosterAttrString(poster) +
      ' controls crossorigin playsinline />'
  );
  const sourceSetStr =
    jQuery(el).data('inline-box-source-set') || jQuery(el).data('ib-ss');
  const sourceSetArrAux = sourceSetStr.split('|');
  const sourceSetArr = [];
  // Create an array of sources from the sources string
  for (let i = 0; i < sourceSetArrAux.length; i++) {
    const attrArr = sourceSetArrAux[i].split(';');
    let media = '';
    let src = '';
    for (let j = 0; j < attrArr.length; j++) {
      if (attrArr[j].indexOf('media:') > -1)
        media = attrArr[j].replace('media:', '');
      if (attrArr[j].indexOf('path:') > -1)
        src = attrArr[j].replace('path:', '');
    }
    sourceSetArr.push({
      media: media,
      src: src,
    });
  }
  // Append each source to the video element
  for (let i = 0; i < sourceSetArr.length; i++) {
    let source = jQuery('<source />', {
      id: 'inlineBox-video',
      src: sourceSetArr[i].src,
      media: sourceSetArr[i].media,
      type: 'video/mp4',
    });
    video.append(source);
  }
  video.appendTo(jQuery('#inlineBox-content'));

  // Code to use the native HTML5 player:
  // const videoElem = document.querySelector('#inlineBox-content video');
  // videoElem.addEventListener('loadedmetadata', canPlayFunc);
  // videoElem.addEventListener('canplay', canPlayFunc);

  // Instantiate the Plyr player lib
  const player = new Plyr('#inlineBox-video', {
    controls: [
      'play',
      'progress',
      'current-time',
      'mute',
      'volume',
      'fullscreen',
    ],
    autoplay: true,
  });
  // Bind event to hide loading and display the player
  player.on('canplay', function (event) {
    canPlayFunc();
  });
  // Fix for 'canplay' on some iOS devices
  player.on('loadedmetadata', function (event) {
    canPlayFunc();
  });
  window.player = player;
}

// Treatment for the poster attributes string
function getPosterAttrString(poster) {
  return poster ? 'data-poster="' + poster + '" poster="' + poster + '"' : '';
}

// Set the style attributes regardless the content type
function setContentStyle(el) {
  const height =
    jQuery(el).data('inline-box-height') || jQuery(el).data('ib-h');
  const width = jQuery(el).data('inline-box-width') || jQuery(el).data('ib-w');
  const maxHeight =
    jQuery(el).data('inline-box-max-height') || jQuery(el).data('ib-mh');
  const maxWidth =
    jQuery(el).data('inline-box-max-width') || jQuery(el).data('ib-mw');
  const padding =
    jQuery(el).data('inline-box-padding') || jQuery(el).data('ib-p');
  if (height) jQuery('#inlineBox-content').css('height', height);
  if (maxHeight) jQuery('#inlineBox-content').css('max-height', maxHeight);
  if (width) jQuery('#inlineBox-content').css('width', width);
  if (maxWidth) jQuery('#inlineBox-content').css('max-width', maxWidth);
  if (padding) jQuery('#inlineBox-content').css('padding', padding);
}

function loadModalContent(el, poster) {
  // Check the content type and execute its respective function
  if (!jQuery(el).data('inline-box-source-set') && !jQuery(el).data('ib-ss')) {
    const contentPath = jQuery(el).attr('href');
    const contentExtension = contentPath.substr(contentPath.length - 3);
    if (contentExtension === 'mp4' || contentExtension === 'mov') {
      appendTitleDesc(el);
      createVideoContent(contentPath, contentExtension, poster);
    } else if (contentExtension === 'mp3' || contentExtension === 'ogg') {
      appendTitleDesc(el);
      createAudioContent(contentPath, contentExtension);
    } else {
      createIframeContent(contentPath);
    }
  } else {
    appendTitleDesc(el);
    createVideoSourceSetContent(el, poster);
  }
  // Set the style attributes regardless the content type
  setContentStyle(el);
}

// Functions to display the modal box
function openInlineModal(el) {
  // Try to get and display the poster image before loading the content
  const poster =
    jQuery(el).data('inline-box-poster-img') || jQuery(el).data('ib-pi');
  if (poster) {
    jQuery('#inlineBox-poster').css('background-image', 'url(' + poster + ')');
    jQuery('#inlineBox-poster').fadeIn();
  }
  jQuery('#inlineBox-overlay').fadeIn();
  jQuery('#inlineBox-close').fadeIn();
  jQuery('#inlineBox-loading').fadeIn();
  jQuery('#inlineBox-loading-text').fadeIn();
  // Add the class 'overflow-hidden' to <body> and <html> to prevent it from scrolling
  jQuery('body').addClass('overflow-hidden');
  jQuery('html').addClass('overflow-hidden');
  jQuery('#inlineBox').fadeIn(function () {
    loadModalContent(el, poster);
    jQuery('#inlineBox').addClass('inline-box-open');
    // Bind close function to close icon
    jQuery('#inlineBox-close').click(function () {
      closeInlineModal();
    });
    // Bind close function to any click outside the modal
    jQuery('#inlineBox').click(function (evt) {
      if (evt.target.id === 'inlineBox') closeInlineModal();
    });
  });
}

// Append the necessary elements to body
function appendElemsToBody() {
  jQuery('body').append(
    '<div id="inlineBox" style="display: none">\
      <div id="inlineBox-content" style="display: none;"></div>\
    </div>\
    <div id="inlineBox-overlay" style="display: none">\
      <div id="inlineBox-poster">\
      </div>\
      <div id="inlineBox-loading"></div>\
      <span id="inlineBox-loading-text">Wird geladen</span>\
    </div>\
    <div id="inlineBox-close" style="display: none">X</div>'
  );
}

// Fix the modal dimensions
function setModalMaxHeight() {
  jQuery('#inlineBox-content').css('max-height', window.innerHeight + 'px');
}

// Execute the function when the page is loaded
jQuery(document).ready(function ($) {
  // Bind the click event to all elements with 'data-inline-box' attribute
  $('[data-inline-box]').click(function (e) {
    // Prevent the page from following the link
    e.preventDefault();
    // Append the necessary elements to body so it does not have to be included on 'index.php'
    appendElemsToBody();
    // Functions to display the modal box
    openInlineModal(e.currentTarget);
    return false;
  });
  // If the page size changes, fix the modal dimensions
  $(window).resize(function () {
    setModalMaxHeight();
  });
});
