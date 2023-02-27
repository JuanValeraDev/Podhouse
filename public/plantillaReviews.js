function pug_escape(e){var a=""+e,t=pug_match_html.exec(a);if(!t)return e;var r,c,n,s="";for(r=t.index,c=0;r<a.length;r++){switch(a.charCodeAt(r)){case 34:n="&quot;";break;case 38:n="&amp;";break;case 60:n="&lt;";break;case 62:n="&gt;";break;default:continue}c!==r&&(s+=a.substring(c,r)),c=r+1,s+=n}return c!==r?s+a.substring(c,r):s}
var pug_match_html=/["&<>]/;function plantillaReviews(locals) {var pug_html = "", pug_mixins = {}, pug_interp;;var locals_for_with = (locals || {});(function (reviews) {// iterate reviews
;(function(){
  var $$obj = reviews;
  if ('number' == typeof $$obj.length) {
      for (var pug_index0 = 0, $$l = $$obj.length; pug_index0 < $$l; pug_index0++) {
        var review = $$obj[pug_index0];
pug_html = pug_html + "\u003Ctr\u003E\u003Ctd class=\"d-none\"\u003E\u003Cp class=\"podcastId-fila\"\u003E" + (pug_escape(null == (pug_interp = review.podcastId) ? "" : pug_interp)) + "\u003C\u002Fp\u003E\u003C\u002Ftd\u003E\u003Ctd\u003E\u003Cp class=\"autor-fila\"\u003E" + (pug_escape(null == (pug_interp = review.autor) ? "" : pug_interp)) + "\u003C\u002Fp\u003E\u003C\u002Ftd\u003E\u003Ctd\u003E\u003Cp class=\"fecha-fila\"\u003E" + (pug_escape(null == (pug_interp = review.fechaFormateada) ? "" : pug_interp)) + "\u003C\u002Fp\u003E\u003C\u002Ftd\u003E\u003Ctd\u003E\u003Cp class=\"puntuacion-fila\"\u003E" + (pug_escape(null == (pug_interp = review.puntuacion) ? "" : pug_interp)) + "\u003C\u002Fp\u003E\u003C\u002Ftd\u003E\u003Ctd\u003E\u003Cp class=\"texto-fila\"\u003E" + (pug_escape(null == (pug_interp = review.texto) ? "" : pug_interp)) + "\u003C\u002Fp\u003E\u003C\u002Ftd\u003E\u003C\u002Ftr\u003E";
      }
  } else {
    var $$l = 0;
    for (var pug_index0 in $$obj) {
      $$l++;
      var review = $$obj[pug_index0];
pug_html = pug_html + "\u003Ctr\u003E\u003Ctd class=\"d-none\"\u003E\u003Cp class=\"podcastId-fila\"\u003E" + (pug_escape(null == (pug_interp = review.podcastId) ? "" : pug_interp)) + "\u003C\u002Fp\u003E\u003C\u002Ftd\u003E\u003Ctd\u003E\u003Cp class=\"autor-fila\"\u003E" + (pug_escape(null == (pug_interp = review.autor) ? "" : pug_interp)) + "\u003C\u002Fp\u003E\u003C\u002Ftd\u003E\u003Ctd\u003E\u003Cp class=\"fecha-fila\"\u003E" + (pug_escape(null == (pug_interp = review.fechaFormateada) ? "" : pug_interp)) + "\u003C\u002Fp\u003E\u003C\u002Ftd\u003E\u003Ctd\u003E\u003Cp class=\"puntuacion-fila\"\u003E" + (pug_escape(null == (pug_interp = review.puntuacion) ? "" : pug_interp)) + "\u003C\u002Fp\u003E\u003C\u002Ftd\u003E\u003Ctd\u003E\u003Cp class=\"texto-fila\"\u003E" + (pug_escape(null == (pug_interp = review.texto) ? "" : pug_interp)) + "\u003C\u002Fp\u003E\u003C\u002Ftd\u003E\u003C\u002Ftr\u003E";
    }
  }
}).call(this);
}.call(this,"reviews" in locals_for_with?locals_for_with.reviews:typeof reviews!=="undefined"?reviews:undefined));;return pug_html;}