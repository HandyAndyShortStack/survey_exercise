$(function() {

  // setup

  var questions = testData;
  var selectedQuestionIndex = null;
  var draggedQuestionIndex = null;
  var currentEvent;

  var template = Handlebars.compile($('#template-questions').html());
  Handlebars.registerPartial('question', $('#template-question').html());
  Handlebars.registerPartial('options', $('#template-options').html());
  Handlebars.registerPartial('answer', $('#template-answer').html());
  registerHandlebarsHelpers();

  var questionsEl = $('#questions');

  var tree = vdomParser(renderHandlebars());
  var rootNode = virtualDom.create(tree);
  questionsEl.append($(rootNode));

  // console hooks

  window.questions = questions;
  window.render = render;

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

  registerFormEvent('.new-question', 'mousedown', function(event, el) {
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

  registerFormEvent('.question .text-placeholder', 'mousedown', function(event, el) {
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

  registerFormEvent('.answer-delete', 'click', function(event, el) {
    var questionIndex = getQuestionIndex(el);
    var answerIndex = getAnswerIndex(el);
    questions[questionIndex].answers.splice(answerIndex, 1);
  });

  registerFormEvent('.new-option', 'click', function(event, el) {
    var questionIndex = getQuestionIndex(el);
    var answers = questions[questionIndex].answers;
    var answerIndex = answers.length;
    answers.push({
      text: '',
      optionType: 'May Select'
    });
    setTimeout(function() {
      $('.question[data-index="' + questionIndex + '"]')
          .find('.answer[data-index="' + answerIndex + '"]')
          .find('.answer-text textarea')
          .focus();
    }, 5);
  });

  registerFormEvent('.none-of-the-above', 'click', function(event, el) {
    var questionIndex = getQuestionIndex(el);
    questions[questionIndex].noneOfTheAbove = !questions[questionIndex].noneOfTheAbove;
  });

  registerFormEvent('.shuffle', 'click', function(event, el) {
    var questionIndex = getQuestionIndex(el);
    questions[questionIndex].shuffle = !questions[questionIndex].shuffle;
  });

  registerFormEvent('.question-text textarea', 'keyup', function(event, el) {
    var question = questions[getQuestionIndex(el)];
    question.text = $(el).val();
  }, true);

  registerFormEvent('.answer-text textarea', 'keyup', function(event, el) {
    var questionIndex = getQuestionIndex(el);
    var answerIndex = getAnswerIndex(el);
    var answer = questions[questionIndex].answers[answerIndex];
    answer.text = $(el).val();
  }, true);

  registerFormEvent('.question-drag-handle', 'dragstart', function(event, el) {
    selectedQuestionIndex = null;
    var questionIndex = getQuestionIndex(el);
    draggedQuestionIndex = questionIndex;
    var questionEl = $('.question[data-index="' + questionIndex + '"]');
    questionEl.removeClass('selected');
    event.originalEvent.dataTransfer.setDragImage(questionEl[0], 20, 20);
  });

  registerFormEvent('.question', 'dragenter', function(event, el) {
    $('.question').removeClass('drag-over');
    var questionIndex = getQuestionIndex(el);
    var questionEl = $('.question[data-index="' + questionIndex + '"]');
    questionEl.addClass('drag-over');
  });

  $(document.body).on('dragenter', function(event) {
    if (!getSourceEl(event, '.question')) {
      $('.question').removeClass('drag-over');
    }
  });

  $(document.body).on('dragend', function(event) {
    var targetQuestionEl = $('.question.drag-over')[0];
    if (draggedQuestionIndex !== null && targetQuestionEl) {
      targetQuestionIndex = getQuestionIndex(targetQuestionEl);
      var question = questions.splice(draggedQuestionIndex, 1)[0];
      questions.splice(targetQuestionIndex, 0, question);
      setTimeout(function() {
        render();
      }, 0);
    }
    $('.question').removeClass('drag-over');
    draggedQuestionIndex = null;
  });

  // functions

  function render(callback) {
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

  function registerFormEvent(selector, type, handler, suppressRender) {
    $(document.body).on(type, function(event) {
      var sourceEl = getSourceEl(event, selector);
      if (!sourceEl) {
        return;
      }
      handler(event, sourceEl);
      if (currentEvent !== event.originalEvent) {
        if (!suppressRender) {
          setTimeout(render, 0);
        }
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
