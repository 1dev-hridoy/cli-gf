
import chalk from 'chalk';
import chalkAnimation from 'chalk-animation';
import * as p from '@clack/prompts';
import { setTimeout } from 'timers/promises';
import { characters } from './data/characters.js';
import { callClaveAPI } from './services/api.js';
import { showIntro, simulateTyping, saveTranscript, getCharacterEmoji, getWelcomeMessage } from './utils/ui.js';




async function getUserName() {
    const name = await p.text({
        message: chalk.green("What's your name?"),
        placeholder: 'NoobCoder?',
    });
    if (p.isCancel(name)) {
        process.exit(0);
    }
    return name || 'Traveler';
}



async function selectCharacter() {
    console.log(chalk.cyanBright('🔮 Choose Your Destiny 🔮'));

    const options = characters.map((char) => ({
        value: char.name,
        label: `${char.name} - ${chalk.gray(char.description)}`,
    }));



   
    options.push({
        value: 'custom',
        label: `✨ Create Custom Character - ${chalk.gray('Design your own companion')}`
});



    const characterName = await p.select({
        message: chalk.magenta('Choose your AI companion:'),
        options: options,
    });

    if (p.isCancel(characterName)) {
        process.exit(0);
    }

    if (characterName === 'custom') {
        return await createCustomCharacter();
    }

    return characters.find(c => c.name === characterName);
}



async function createCustomCharacter() {
    console.log(chalk.yellow('\n✨ Design Your Dream Companion ✨\n'));

    const name = await p.text({ message: 'Name:' });
    if (p.isCancel(name)) process.exit(0);

    const description = await p.text({ message: 'Short Description:' });
    if (p.isCancel(description)) process.exit(0);

    const personality = await p.text({ message: 'Personality/Vibe (e.g., shy, dominant, funny):' });
    if (p.isCancel(personality)) process.exit(0);

    const promptTemplate = `You are ${name}. ${description}. Your personality is ${personality}. You are talking to {userName}. Act accordingly.`;

    return {
        name: name,
        description: description,
        image: '', 
        prompt: promptTemplate
    };
}




async function chatLoop(userName, character) {
    console.log(chalk.blue(`\n👋 Hello ${userName}! I'm ${character.name}. Let's chat!`));
    console.log(chalk.gray('Type "exit" to quit, "save" to save transcript.\n'));

    let transcript = `Transcript with ${character.name} for ${userName}\nDate: ${new Date().toLocaleString()}\n\n`;

    const welcomeMessage = getWelcomeMessage(character.name);
    console.log(welcomeMessage);
    transcript += `${character.name}: ${welcomeMessage}\n`; 

    while (true) {
        const question = await p.text({
            message: `${userName}:`,
            placeholder: 'Ask something...',
        });

        if (p.isCancel(question)) {
            process.exit(0);
        }

        const input = (question || '').toString().trim();
        if (!input) continue;

        const lowerCaseInput = input.toLowerCase();

        if (lowerCaseInput === 'exit') {
            const goodbye = chalkAnimation.rainbow(`\n👋 Bye ${userName}! ${character.name} enjoyed chatting with you!`);
            await setTimeout(2000);
            goodbye.stop();
            break;
        }

        if (lowerCaseInput === 'save') {
            await saveTranscript(userName, character.name, transcript);
            continue;
        }

        transcript += `${userName}: ${input}\n`;

        if (lowerCaseInput.includes('who are you') || lowerCaseInput.includes('show image')) {
            if (character.image) {
                console.log(chalk.magenta(`\n${character.name}:`), character.image);
                transcript += `${character.name}: [Image: ${character.image}]\n`;
            } else {
                console.log(chalk.magenta(`\n${character.name}:`), "I don't have a picture yet, but use your imagination!");
                transcript += `${character.name}: I don't have a picture yet.\n`;
            }
            console.log();
            continue;
        }

        const response = await callClaveAPI(input, character, userName);
        if (response) {
            const emoji = getCharacterEmoji(character.name);
            process.stdout.write(chalk.magenta(`\n${emoji} ${character.name}: `));

            await simulateTyping(response);
            console.log();

            transcript += `${character.name}: ${response}\n`;
        }
    }
}




export async function main() {
    await showIntro();
    const userName = await getUserName();
    const character = await selectCharacter();
    if (character) {
        await chatLoop(userName, character);
    }
}

if (process.argv[1] === import.meta.url) {
    main().catch(console.error);
}
