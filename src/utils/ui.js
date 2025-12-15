import chalk from 'chalk';
import chalkAnimation from 'chalk-animation';
import { setTimeout } from 'timers/promises';
import { createSpinner } from 'nanospinner';
import fs from 'fs/promises';
import path from 'path';



export async function showIntro() {
    const glitchTitle = chalkAnimation.glitch('Welcome to CLI-GF\n');
    await setTimeout(2000);
    glitchTitle.stop();

    const rainbowText = chalkAnimation.rainbow('Experience the Future of Conversation!\n');
    await setTimeout(1500);
    rainbowText.stop();

    console.log(chalk.blueBright('Chat with AI characters in a fun way!'));
    console.log(chalk.gray('-------------------------------------\n'));
}

export async function simulateTyping(text, delay = 20) {
    for (const char of text) {
        process.stdout.write(char);
        await setTimeout(delay);
    }
    process.stdout.write('\n');
}




export async function saveTranscript(userName, characterName, transcript) {
    const date = new Date().toISOString().replace(/:/g, '-').split('.')[0];
    const filename = `transcript-${userName}-${characterName}-${date}.txt`;

    try {
        await fs.writeFile(filename, transcript, 'utf-8');
        console.log(chalk.green(`\n📄 Transcript saved to ${filename}`));
    } catch (err) {
        console.error(chalk.red('\nFailed to save transcript:'), err.message);
    }
}


//gave emojis to characters
export function getCharacterEmoji(characterName) {
    const emojiPrefixes = {
        'Seraphina': '🔥',
        'Jax': '💻',
        'Luna': '🌙',
        'Raven': '🌹'
    };
    return emojiPrefixes[characterName] || '💬';
}

export function getWelcomeMessage(characterName) {
    const welcomeMessages = {
        'Seraphina': `✨ ${chalk.magenta('The stars whisper your arrival, my eager seeker...')}`,
        'Jax': `⚡ ${chalk.yellow('Jack into my circuit, chummer. Let\'s overload some cores!')}`,
        'Luna': `🌙 ${chalk.blue('The moon guides us together, dear earthbound star...')}`,
        'Raven': `🖤 ${chalk.gray('Shadows embrace you, midnight muse...')}`
    };
    return welcomeMessages[characterName] || `💫 ${chalk.cyan('The cosmos aligns our paths...')}`;
}
