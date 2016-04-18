$(function() {

  var questionsEl = $('#questions');
  var questions = testData;

  var template = Handlebars.compile($('#template-questions').html());
  Handlebars.registerPartial('question', $('#template-question').html());
  Handlebars.registerHelper('inc', function(value, options) {
    return parseInt(value, 10) + 1;
  });

  render();

  function render() {
    questionsEl.html(template({
      questions: questions
    }));
  }
});

window.testData = [
  {
    text: 'what color is your underwear?',
    answers: [
      {
        text: 'green',
        optionType: 'Must Select'
      },
    ],
    noneOfTheAbove: true,
    shuffle: true
  },
  {
    text: 'what color is your underwear?',
    answers: [
      {
        text: 'green',
        optionType: 'Must Select'
      },
    ],
    noneOfTheAbove: true,
    shuffle: true
  },
  {
    text: 'what color is your underwear?',
    answers: [
      {
        text: 'green',
        optionType: 'Must Select'
      },
    ],
    noneOfTheAbove: true,
    shuffle: true
  },
  {
    text: 'what color is your underwear?',
    answers: [
      {
        text: 'green',
        optionType: 'Must Select'
      },
    ],
    noneOfTheAbove: true,
    shuffle: true
  }
];
