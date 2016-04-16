(function() {
  window.SurveyExercise.questions = questions;

  function questions(data) {

    var el = $('<div></div>')
        .addClass('questions');

    data.forEach(function(question, index) {
      el.append(SurveyExercise.question(question, index).el);
    });

    return {
      data: data,
      el: el
    }
  }
})();
