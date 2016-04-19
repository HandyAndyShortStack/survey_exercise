$(function() {

  // setup

  var questions = testData;
  var selectedQuestionIndex = null;
  var currentEvent;

  var template = Handlebars.compile($('#template-questions').html());
  Handlebars.registerPartial('question', $('#template-question').html());
  Handlebars.registerPartial('answer', $('#template-answer').html());
  registerHandlebarsHelpers();

  var questionsEl = $('#questions');

  var tree = vdomParser(renderHandlebars());
  var rootNode = virtualDom.create(tree);
  questionsEl.append($(rootNode));

  // event handlers

  registerFormEvent('body', 'mousedown', function() {
    selectedQuestionIndex = null;
  });

  registerFormEvent('.question', 'mousedown', function(event, el) {
    selectedQuestionIndex = getQuestionIndex(el);
  });

  registerFormEvent('.question-delete', 'click', function(event, el) {
    var questionIndex = getQuestionIndex(el);
    questions.splice(questionIndex, 1);
    selectedQuestionIndex = null;
  });

  registerFormEvent('.new-question', 'click', function(event, el) {
    selectedQuestionIndex = questions.length;
    questions.push({
      text: '',
      answers: [],
      noneOfTheAbove: false,
      shuffle: false
    });
    setTimeout(function() {
      $('.question[data-index="' + selectedQuestionIndex + '"]')
          .find('.question-text textarea')
          .focus();
    }, 0);
  });

  registerFormEvent('.question-text-placeholder', 'mousedown', function(event, el) {
    selectedQuestionIndex = getQuestionIndex(el);
    setTimeout(function() {
      $('.question[data-index="' + selectedQuestionIndex + '"]')
          .find('.question-text textarea')
          .focus();
    }, 0);
  });

  registerFormEvent('.question-text textarea', 'focus', function(event, el) {
    selectedQuestionIndex = getQuestionIndex(el);
  });

  registerFormEvent('.option-type', 'click', function(event, el) {
    var questionIndex = getQuestionIndex(el);
    var answerIndex = getAnswerIndex(el);
    questions[questionIndex].answers[answerIndex].optionType = $(el).html();
  });

  registerFormEvent('.none-of-the-above', 'click', function(event, el) {
    
  });

  // functions

  function render() {
    var newTree = vdomParser(renderHandlebars());
    var patches = virtualDom.diff(tree, newTree);
    rootNode = virtualDom.patch(rootNode, patches);
    tree = newTree;
  }

  function renderHandlebars() {
    return template({
      questions: questions,
      selectedQuestionIndex: selectedQuestionIndex
    });
  }

  function registerFormEvent(selector, type, handler) {
    $(document.body).on(type, function(event) {
      var sourceEl = getSourceEl(event, selector);
      if (!sourceEl) {
        return;
      }
      handler(event, sourceEl);
      if (currentEvent !== event.originalEvent) {
        setTimeout(render, 0);
        currentEvent = event.originalEvent;
      }
    });
  }

  function getSourceEl(event, selector) {
    var path = event.originalEvent.path;
    for (var i = 0; i < path.length; i += 1) {
      if ($(path[i]).is(selector)) {
        return path[i];
      }
    }
    return false;
  }

  function getQuestionIndex(el) {
    return parseInt($(el).closest('.question').data('index'), 10);
  }

  function getAnswerIndex(el) {
    return parseInt($(el).closest('.answer').data('index'), 10);
  }

  function registerHandlebarsHelpers() {

    // Handlebars helpers

    Handlebars.registerHelper('inc', function(value, options) {
      return parseInt(value, 10) + 1;
    });

    Handlebars.registerHelper('selectedClass', function(value, options) {
      return value === selectedQuestionIndex ? 'selected' : '';
    });

    Handlebars.registerHelper('optionSelectedClass', function(value, optionType, options) {
      return value === optionType ? 'selected' : '';
    });

    Handlebars.registerHelper('booleanSelectedClass', function(value, options) {
      return value ? 'selected' : '';
    });
  }
});

var testData = [
  {
    text: 'what color is your underwear?',
    answers: [
      {
        text: 'red',
        optionType: 'May Select'
      },
      {
        text: 'yellow',
        optionType: 'Must Select'
      },
      {
        text: 'brown',
        optionType: 'Terminate if Select'
      }
    ],
    noneOfTheAbove: true,
    shuffle: true
  },
  {
    text: 'why is a raven like a writing desk?',
    answers: [
      {
        text: 'green',
        optionType: 'Must Select'
      }
    ],
    noneOfTheAbove: true,
    shuffle: true
  },
  {
    text: 'why does the porridge bird lay its eggs in the air?',
    answers: [
      {
        text: 'green',
        optionType: 'Must Select'
      }
    ],
    noneOfTheAbove: true,
    shuffle: true
  },
  {
    text: 'what is this i dont even',
    answers: [
      {
        text: 'green',
        optionType: 'Must Select'
      }
    ],
    noneOfTheAbove: true,
    shuffle: true
  }
];
