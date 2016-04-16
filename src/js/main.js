window.SurveyExercise = {
  template: function(name) {
    return Handlebars.compile($('#template-' + name).html());
  }
};

$(function() {

  var questionsEl = $('#questions');

  var questions = [
    {
      text: 'what color is your underwear?'
    },
    {
      text: 'what color is your underwear?'
    },
    {
      text: 'what color is your underwear?'
    },
    {
      text: 'what color is your underwear?'
    }
  ];

  render();

  function render() {
    questionsEl.html(SurveyExercise.questions(questions).el);
  }
});
