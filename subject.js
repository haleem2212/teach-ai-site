document.addEventListener('DOMContentLoaded', () => {
  let subj = typeof subject !== 'undefined' ? subject : null;
  if (!subj) {
    const params = new URLSearchParams(window.location.search);
    subj = params.get('subject');
  }
  if (!subj) {
    window.location.href = 'dashboard.html';
    return;
  }
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));
  const profile = JSON.parse(localStorage.getItem('userProfile'));
  if (!userInfo || !profile) {
    window.location.href = 'index.html';
    return;
  }
  const planSubjects = {
    basic: ['math'],
    standard: ['math','english','science'],
    premium: ['math','english','science','languages','coding']
  };
  const allowed = planSubjects[userInfo.plan] || [];
  if (!allowed.includes(subj)) {
    document.body.innerHTML = '<p>Upgrade your plan to access this subject.</p>';
    return;
  }
  const subjectsData = {
    math: {
      beginner: [
        { q: '2 + 3 = ?', a: '5', hint: 'Add 2 and 3', example: '2 apples + 3 apples = 5 apples' },
        { q: '5 - 2 = ?', a: '3', hint: 'Subtract 2 from 5', example: 'If you have 5 apples and remove 2, you have 3.' }
      ],
      intermediate: [
        { q: '12 / 4 = ?', a: '3', hint: 'Divide 12 into 4 equal parts', example: '12 cookies split among 4 people gives 3 each.' },
        { q: '3 x 7 = ?', a: '21', hint: 'Multiply 3 by 7', example: '3 groups of 7 make 21.' }
      ],
      experienced: [
        { q: 'Solve for x: 2x + 4 = 10', a: '3', hint: 'Subtract 4 then divide by 2', example: '2x = 6 so x = 3.' },
        { q: 'What is the square root of 49?', a: '7', hint: '7 x 7 = 49', example: 'The number multiplied by itself to give 49 is 7.' }
      ]
    },
    english: {
      beginner: [
        { q: 'Identify the noun: "The cat sleeps."', a: 'cat', hint: 'A noun is a person, place, or thing.', example: 'In "The dog runs", dog is the noun.' },
        { q: 'Choose the correct form: "She ___ happy."', a: 'is', hint: 'Present tense of be.', example: 'He is happy.' }
      ],
      intermediate: [
        { q: 'Fill the blank: "They ___ going to the park."', a: 'are', hint: 'Present continuous requires are.', example: 'We are going to school.' },
        { q: 'What is the past tense of "run"?', a: 'ran', hint: 'Irregular verb', example: 'Yesterday, I ran to school.' }
      ],
      experienced: [
        { q: 'What is the adjective in "The beautiful flower smells sweet"?', a: 'beautiful', hint: 'Describes a noun.', example: 'In "a red car", red is adjective.' },
        { q: 'Convert to plural: "child"', a: 'children', hint: 'Irregular plural', example: 'One child, two children.' }
      ]
    },
    science: {
      beginner: [
        { q: 'What planet do we live on?', a: 'earth', hint: 'Third planet from the sun', example: 'It’s called Earth.' },
        { q: 'Water freezes at 0 degrees on which scale?', a: 'celsius', hint: 'Metric temperature scale', example: '100 degrees Celsius is boiling.' }
      ],
      intermediate: [
        { q: 'What gas do plants absorb for photosynthesis?', a: 'carbon dioxide', hint: 'Plants need CO\u2082.', example: 'Humans exhale carbon dioxide.' },
        { q: 'Name the process by which a solid changes directly into gas.', a: 'sublimation', hint: 'Skip liquid phase', example: 'Dry ice sublimates.' }
      ],
      experienced: [
        { q: 'What force keeps planets in orbit around the Sun?', a: 'gravity', hint: 'Attractive force between masses.', example: 'Gravity keeps us on Earth.' },
        { q: 'H2O is the chemical formula for what substance?', a: 'water', hint: 'Two hydrogen atoms and one oxygen.', example: 'H\u2082O stands for water.' }
      ]
    },
    languages: {
      beginner: [
        { q: 'Translate "Hello" to Spanish.', a: 'hola', hint: 'Starts with h', example: 'Hola means hello.' },
        { q: 'Translate "Bonjour" to English.', a: 'hello', hint: 'French greeting', example: 'Bonjour = hello.' }
      ],
      intermediate: [
        { q: 'Translate "Gracias" to English.', a: 'thank you', hint: 'Spanish phrase of gratitude', example: 'Gracias = thank you.' },
        { q: 'Translate "Auf Wiedersehen" to English.', a: 'goodbye', hint: 'German farewell', example: 'Auf Wiedersehen = goodbye.' }
      ],
      experienced: [
        { q: 'Translate "Ich liebe dich" to English.', a: 'i love you', hint: 'German phrase of affection', example: 'Ich liebe dich = I love you.' },
        { q: 'Translate "Je ne comprends pas" to English.', a: 'i do not understand', hint: 'French phrase for not understanding', example: 'Je ne comprends pas = I do not understand.' }
      ]
    },
    coding: {
      beginner: [
        { q: 'What symbol starts a comment in JavaScript?', a: '//', hint: 'Two forward slashes', example: '// This is a comment' },
        { q: 'Which keyword declares a variable that cannot change?', a: 'const', hint: 'Block-scoped constant', example: 'const x = 5;' }
      ],
      intermediate: [
        { q: 'What does HTML stand for?', a: 'hypertext markup language', hint: 'Defines structure of web pages.', example: 'HTML is HyperText Markup Language.' },
        { q: 'Name the boolean values in programming.', a: 'true and false', hint: 'Two truth values', example: 'Boolean can be true or false.' }
      ],
      experienced: [
        { q: 'What array method adds an element to the end of an array?', a: 'push', hint: 'Method name is push', example: 'arr.push(10)' },
        { q: 'What is the output of 2 ** 3 in JavaScript?', a: '8', hint: 'Exponentiation operator', example: '2**3 = 8' }
      ]
    }
  };
  let level = profile.level;
  let index = 0;
  let correctStreak = 0;
  let wrongStreak = 0;
  const container = document.getElementById('lesson-container');
  function renderQuestion() {
    const set = subjectsData[subj][level];
    if (!set || index >= set.length) {
      container.innerHTML = '<p>Lesson complete! Good job.</p>';
      return;
    }
    const q = set[index];
    container.innerHTML = `
      <h2>${subj.charAt(0).toUpperCase() + subj.slice(1)} - ${level.charAt(0).toUpperCase() + level.slice(1)}</h2>
      <p id="question">${q.q}</p>
      <input type="text" id="answer" placeholder="Type your answer" autocomplete="off"/>
      <div style="margin-top:10px;">
        <button id="submit-btn">Submit Answer</button>
        <button id="help-btn">Help</button>
        <button id="example-btn">Example</button>
      </div>
      <p id="feedback"></p>
    `;
    document.getElementById('submit-btn').addEventListener('click', () => {
      const answer = document.getElementById('answer').value.trim().toLowerCase();
      if (answer === q.a.toLowerCase()) {
        correctStreak++;
        wrongStreak = 0;
        document.getElementById('feedback').textContent = 'Correct!';
        index++;
        if (correctStreak >= 2) {
          if (level === 'beginner') level = 'intermediate';
          else if (level === 'intermediate') level = 'experienced';
          correctStreak = 0;
          index = 0;
        }
        setTimeout(renderQuestion, 800);
      } else {
        wrongStreak++;
        correctStreak = 0;
        document.getElementById('feedback').textContent = 'Incorrect, try again.';
        if (wrongStreak >= 2) {
          if (level === 'experienced') level = 'intermediate';
          else if (level === 'intermediate') level = 'beginner';
          wrongStreak = 0;
          index = 0;
        }
      }
    });
    document.getElementById('help-btn').addEventListener('click', () => {
      document.getElementById('feedback').textContent = 'Hint: ' + q.hint;
    });
    document.getElementById('example-btn').addEventListener('click', () => {
      document.getElementById('feedback').textContent = 'Example: ' + q.example;
    });
  }
  renderQuestion();
});
