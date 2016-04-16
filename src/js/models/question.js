(function() {
  window.SurveyExercise.question = question;

  var template = SurveyExercise.template('question');

  function question(data, index) {

    var el = $(template({
      index: index,
      question: data
    }));

    el.on('click', onClick.bind(null, el));

    el.find('.text')
        .on('click', textClick.bind(null, el));

    return {
      data: data,
      index: index,
      el: el
    }
  }

  function onClick(el, event) {
    $('.question').removeClass('selected');
    el.addClass('selected');
    event.originalEvent.questionSelect = true;
  }

  function textClick(el, event) {
    setTimeout(function() {
      el.find('.textarea').focus();
    }, 0);
  }

  $('body').on('click', function(event) {
    if (!event.originalEvent.questionSelect) {
      $('.question').removeClass('selected');
    }
  });
})();
