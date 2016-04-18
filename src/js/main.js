$(function() {

  // setup

  var questions = testData;
  var currentEvent;

  var template = Handlebars.compile($('#template-questions').html());
  Handlebars.registerPartial('question', $('#template-question').html());
  Handlebars.registerHelper('inc', function(value, options) {
    return parseInt(value, 10) + 1;
  });

  var questionsEl = $('#questions');

  var tree = vdomParser(renderHandlebars());
  var rootNode = virtualDom.create(tree);
  questionsEl.append($(rootNode));

  // event handlers

  registerFormEvent('.question-delete', 'click', function(event, el) {
    var questionIndex = getQuestionIndex(el);
    questions.splice(questionIndex, 1);
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
      questions: questions
    });
  }

  function registerFormEvent(selector, type, handler) {
    questionsEl.on(type, function(event) {
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
});

var testData = [
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
    text: 'why is a raven like a writing desk?',
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
    text: 'why does the porridge bird lay its eggs in the air?',
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
    text: 'what is this i dont even',
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
