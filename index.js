#!/usr/bin/env node

import chalk from 'chalk';
import chalkAnimation from 'chalk-animation';
import * as p from '@clack/prompts';
import { createSpinner } from 'nanospinner';
import { setTimeout } from 'timers/promises';


const quizQuestions = [
  {
    question: 'Which chemical element has the symbol "Fe"?',
    options: ['Gold', 'Iron', 'Silver', 'Copper'],
    correctAnswer: 'Iron',
    info: 'The symbol Fe comes from the Latin word ferrum.',
  },
  {
    question: 'In which year did the Titanic sink?',
    options: ['1905', '1912', '1923', '1931'],
    correctAnswer: '1912',
    info: 'The Titanic sank on its maiden voyage from Southampton to New York City.',
  },
  {
    question: 'What is 7 * 9?',
    options: ['63', '56', '72', '49'],
    correctAnswer: '63',
    info: 'This is a core multiplication fact!',
  }
];


async function runQuiz() {


  const neonTitle = chalkAnimation.neon('🧠 Simple CLI Quiz Game! 💡\n');
  await setTimeout(1500);
  neonTitle.stop();
  console.log(chalk.yellow('Test your knowledge!'));
  console.log(chalk.gray('----------------------\n'));
  

  const userName = await p.text({
    message: chalk.green("What's your name?"),
    placeholder: 'Player',
  });
  if (p.isCancel(userName)) process.exit(0);

  let score = 0;
  let questionNumber = 1;

  console.log(chalk.blue(`\nStarting the quiz, ${userName || 'Player'}!\n`));


  for (const q of quizQuestions) {
    p.intro(chalk.cyan(`Question ${questionNumber++} of ${quizQuestions.length}`));
    
    const answer = await p.select({
      message: chalk.white.bold(q.question),
      options: q.options.map(opt => ({ value: opt, label: opt })),
    });

    if (p.isCancel(answer)) process.exit(0);
    
 


    const spinner = createSpinner('Checking...').start();
    await setTimeout(500); 

    if (answer === q.correctAnswer) {
      spinner.success({ text: chalk.green('Correct! 🎉') });
      console.log(chalk.greenBright(`\tTip: ${q.info}\n`));
      score++;
    } else {
      spinner.error({ text: chalk.red('Incorrect. 😔') });
      console.log(chalk.yellow(`\tCorrect Answer: ${chalk.bold(q.correctAnswer)}`));
      console.log(chalk.yellowBright(`\tTip: ${q.info}\n`));
    }
  }
  


  p.outro(chalk.magenta('Quiz Complete!'));
  
  const finalScoreText = `You scored ${score} out of ${quizQuestions.length}.`;
  
  if (score === quizQuestions.length) {
    const winnerAnim = chalkAnimation.pulse(`🏆 Perfect Score! ${finalScoreText}`);
    await setTimeout(2500);
    winnerAnim.stop();
  } else {
    console.log(chalk.cyan(`\nResult: ${finalScoreText}`));
  }
  
  const goodbye = chalkAnimation.rainbow(`\nThanks for playing!`);
  await setTimeout(1500);
  goodbye.stop();
}




runQuiz().catch(console.error);