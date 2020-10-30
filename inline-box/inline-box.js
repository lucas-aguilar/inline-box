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
}

function canPlayFunc() {
  jQuery('#inlineBox-poster').fadeOut();
  jQuery('#inlineBox-loading').fadeOut();
  jQuery('#inlineBox-loading-text').fadeOut();
  jQuery('#inlineBox-content').fadeIn();
}

function appendTitleDesc(el) {
  const title = jQuery(el).data('inline-box-title') || jQuery(el).data('ib-t');
  const desc = jQuery(el).data('inline-box-desc') || jQuery(el).data('ib-d');
  if (title) jQuery('#inlineBox-content').append('<div id="inlineBox-title" class="inline-box-text">' + title + '</div>');
  if (desc) jQuery('#inlineBox-content').append('<div id="inlineBox-desc" class="inline-box-text">' + desc + '</div>');
}

function loadModalContent(el) {
  jQuery('#inlineBox').append('<div id="inlineBox-content"></div>');
  jQuery('#inlineBox-content').hide();
  if (!jQuery(el).data('inline-box-source-set') && !jQuery(el).data('ib-ss')) {
    const contentPath = jQuery(el).attr('href');
    const contentExtension = contentPath.substr(contentPath.length - 3);
    if (contentExtension === 'mp4' || contentExtension === 'mov') {
      appendTitleDesc(el);
      jQuery('#inlineBox-content').addClass('video-content');
      const video = jQuery('<video id="inlineBox-video" src="'+contentPath+'" type="video/'+contentExtension+'" controls autoplay />');
      video.appendTo(jQuery('#inlineBox-content'));
      const videoElem = document.querySelector('#inlineBox-content video');
      const player = new Plyr('#inlineBox-video', {
        controls: [
          'play',
          'progress',
          'current-time',
          'mute',
          'volume',
          'fullscreen'
        ],
        autoplay: true
      });
      player.on('canplay', event => {
        canPlayFunc();
      });
      window.player = player;
    } else if (contentExtension === 'mp3' || contentExtension === 'ogg') {
      appendTitleDesc(el);
      jQuery('#inlineBox-content').addClass('audio-content');
      let audioHtmlStr = '';
      audioHtmlStr += '<audio id="inlineBox-audio" crossorigin playsinline>';
      audioHtmlStr += '<source src="'+contentPath+'" type="audio/'+contentExtension+'">';
      audioHtmlStr += '</audio>';
      const audio = jQuery(audioHtmlStr);
      audio.appendTo(jQuery('#inlineBox-content'));
      const audioElem = document.querySelector('#inlineBox-content audio');
      const player = new Plyr('#inlineBox-audio', {
        controls: [
          'play',
          'progress',
          'current-time',
          'mute',
          'volume'
        ],
        autoplay: true
      });
      player.on('canplay', event => {
        canPlayFunc();
      });
      window.player = player;
    } else {
      jQuery('<iframe>', {
        src: contentPath,
        id: 'inlineBox-iframe',
        frameborder: 0,
      }).appendTo('#inlineBox-content');
      jQuery('#inlineBox-content').addClass('iframe-content');
      jQuery('#inlineBox-content iframe').load(function () {
        canPlayFunc();
      });
    }
  } else {
    appendTitleDesc(el);
    const sourceSetStr = jQuery(el).data('inline-box-source-set') || jQuery(el).data('ib-ss');
    const sourceSetArrAux = sourceSetStr.split('|');
    const sourceSetArr = [];
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
    const videoElem = document.querySelector('#inlineBox-content video');
    videoElem.oncanplay = canPlayFunc;
  }
  const height = jQuery(el).data('inline-box-height') || jQuery(el).data('ib-h');;
  const width = jQuery(el).data('inline-box-width') || jQuery(el).data('ib-w');;
  const maxHeight = jQuery(el).data('inline-box-max-height') || jQuery(el).data('ib-mh');;
  const maxWidth = jQuery(el).data('inline-box-max-width') || jQuery(el).data('ib-mw');;
  const padding = jQuery(el).data('inline-box-padding') || jQuery(el).data('ib-p');;
  if (height) jQuery('#inlineBox-content').css('height', height);
  if (maxHeight) jQuery('#inlineBox-content').css('max-height', maxHeight);
  if (width) jQuery('#inlineBox-content').css('width', width);
  if (maxWidth) jQuery('#inlineBox-content').css('max-width', maxWidth);
  if (padding) jQuery('#inlineBox-content').css('padding', padding);
}

function openInlineModal(el) {
  const poster = jQuery(el).data('inline-box-poster-img') || jQuery(el).data('ib-pi');
  if (poster) {
    jQuery('#inlineBox-poster').css('background-image', 'url(' + poster + ')');
    jQuery('#inlineBox-poster').fadeIn();
  }
  jQuery('#inlineBox-overlay').fadeIn();
  jQuery('#inlineBox-close').fadeIn();
  jQuery('#inlineBox-loading').fadeIn();
  jQuery('#inlineBox-loading-text').fadeIn();
  jQuery('body').addClass('overflow-hidden');
  jQuery('html').addClass('overflow-hidden');
  jQuery('#inlineBox').fadeIn(function () {
    loadModalContent(el);
    jQuery('#inlineBox').addClass('inline-box-open');
    jQuery('#inlineBox-close').click(function () {
      closeInlineModal();
    });
    jQuery('#inlineBox').click(function (evt) {
      if (evt.target.id === 'inlineBox') closeInlineModal();
    });
  });
}

function setModalMaxHeight() {
  jQuery('#inlineBox-content').css('max-height', window.innerHeight + 'px');
}

jQuery(document).ready(function ($) {
  $('[data-inline-box]').click(function (e) {
    e.preventDefault();
    appendElemsToBody();
    openInlineModal(e.currentTarget);
    return false;
  });
  $(window).resize(function () {
    setModalMaxHeight();
  });
});

function appendElemsToBody() {
  jQuery('body').append('\
    <div id="inlineBox" style="display: none"></div>\
    <div id="inlineBox-overlay" style="display: none">\
      <div id="inlineBox-poster">\
      </div>\
      <div id="inlineBox-loading"></div>\
      <span id="inlineBox-loading-text">Wird geladen</span>\
    </div>\
    <div id="inlineBox-close" style="display: none">X</div>\
  ');
}