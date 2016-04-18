(function() {
  window.SurveyExercise.question = question;

  var template = SurveyExercise.template('question');

  function question(data, index) {

    var el = $(template({
      index: index,
      question: data
    }));

    el.on('click', onClick.bind(null, el));

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

  $('body').on('click', function(event) {
    if (!event.originalEvent.questionSelect) {
      $('.question').removeClass('selected');
    }
  });
})();
