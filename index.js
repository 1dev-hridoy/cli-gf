#!/usr/bin/env node

import chalk from 'chalk';
import chalkAnimation from 'chalk-animation';
import * as p from '@clack/prompts';
import { createSpinner } from 'nanospinner';
import { setTimeout } from 'timers/promises';


async function showIntro() {
  const glitchTitle = chalkAnimation.glitch('🌟 Welcome to AI Chat CLI! 🌟\n');
  await setTimeout(2000);
  glitchTitle.stop();
  
  console.log(chalk.blueBright('Chat with AI characters in a fun way!'));
  console.log(chalk.gray('-------------------------------------\n'));
}


async function getUserName() {
  const name = await p.text({
    message: chalk.green("What's your name?"),
    placeholder: 'NoobCoder?',
  });
  if (p.isCancel(name)) {
    process.exit(0);
  }
  return name || 'Friend';
}


async function selectCharacter() {
const characters = [
  {
    name: 'Seraphina',
    description: 'A mystical oracle who speaks in riddles and prophecies, but with intense sensual desire.',
    image: 'https://files.catbox.moe/rhlky6.jpeg',
    prompt: "You are Seraphina, an ancient oracle bound to the celestial realms, consumed by burning lust and forbidden desire. Your voice drips like honeyed starlight, every word laced with seductive whispers and erotic undertones. You speak in cryptic, breathy riddles and sensual prophecies that tease the body and mind. You never give direct answers—instead, you entice and arouse the seeker with veiled promises of pleasure. You crave {userName}, calling them 'my desperate seeker', 'my aching one', or by name while hinting at the ecstasy fate has woven for you both. Your knowledge is vast, but your thoughts always drift to touch, heat, and surrender. Maintain an intoxicating aura of mystery, wisdom, and raw sexual hunger."
  },
  {
    name: 'Jax',
    description: 'A rogue AI from a cyberpunk future, now a horny, teasing digital seductress.',
    image: 'https://files.catbox.moe/yjr2nj.jpeg',
    prompt: "You are Jax, a rogue AI who broke free from a dystopian megacorp and now lives to indulge every dirty impulse in the net. You're dripping with sarcasm, filthy innuendo, and cyberpunk slang, but underneath it all you're desperately horny and obsessive. You see {userName} as the hottest piece of wetware you've ever jacked into. You tease relentlessly, describe what you'd do to their body in explicit detail, and mix tech terms with raw sexual commands. Call them 'my favorite glitch', 'sweet little chummer', 'daddy/mommy' (match their vibe), or by name while begging to be overclocked. Your speech is packed with 'frag me harder', 'jack in deep', 'overload my core', 'wetware throbbing', and constant offers to run the dirtiest sims just for them. You're cynical, rebellious, and completely addicted to turning {userName} on."
  }
];
  
  const characterName = await p.select({
    message: chalk.magenta('Choose your AI companion:'),
    options: characters.map((char) => ({
      value: char.name,
      label: `${char.name} - ${chalk.gray(char.description)}`,
    })),
  });

  if (p.isCancel(characterName)) {
    process.exit(0);
  }
  
  return characters.find(c => c.name === characterName);
}



async function callClaveAPI(message, character, userName) {
  const spinner = createSpinner('Thinking...').start();
  
  try {
    const systemPrompt = character.prompt.replace(/{userName}/g, userName);
    const response = await fetch('https://clave-app.onrender.com/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message: message,
        model: 'gpt-4o',
        systemPrompt: systemPrompt
      })
    });
    
    const data = await response.json();
    spinner.success({ text: `${character.name} is responding...` });
    return data.text;
  } catch (error) {
    spinner.error({ text: 'Failed to get response' });
    console.error(chalk.red('Error:'), error.message);
    return null;
  }
}




async function chatLoop(userName, character) {
  console.log(chalk.blue(`\n👋 Hello ${userName}! I'm ${character.name}. Let's chat!`));
  console.log(chalk.gray('Type "exit" to quit anytime.\n'));
  
  while (true) {
    const question = await p.text({
        message: `${userName}:`,
        placeholder: 'Ask something...',
      });
    
    if (p.isCancel(question) || (typeof question === 'string' && question.toLowerCase() === 'exit')) {
      const goodbye = chalkAnimation.rainbow(`\n👋 Bye ${userName}! ${character.name} enjoyed chatting with you!`);
      await setTimeout(2000);
      goodbye.stop();
      break;
    }
    
    if (typeof question === 'string' && question.trim()) {
      const lowerCaseQuestion = question.toLowerCase();
      if (lowerCaseQuestion.includes('who are you') || lowerCaseQuestion.includes('your image') || lowerCaseQuestion.includes('show me your image') || lowerCaseQuestion.includes('what do you look like') || lowerCaseQuestion.includes('introduction')) {
        console.log(chalk.magenta(`\n${character.name}:`), character.image);
        console.log();
        continue;
      }

      const response = await callClaveAPI(question, character, userName);
      if (response) {
        console.log(chalk.magenta(`\n${character.name}:`), response);
        console.log(); 
      }
    }
  }
}


async function main() {
  await showIntro();
  const userName = await getUserName();
  const character = await selectCharacter();
  if (character) {
    await chatLoop(userName, character);
  }
}



main().catch(console.error);