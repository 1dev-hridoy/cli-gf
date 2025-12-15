import { createSpinner } from 'nanospinner';
import chalk from 'chalk';

export async function callClaveAPI(message, character, userName, history = []) {
    const spinner = createSpinner('Thinking...').start();

    try {
        const systemPrompt = character.prompt.replace(/{userName}/g, userName);

        //format history context
        const historyContext = history.map(entry => {
            return `User: ${entry.user}\n${character.name}: ${entry.ai}`;
        }).join('\n\n');

        //merge system prompt, history, and new message
        let combinedMessage = systemPrompt;
        if (historyContext) {
            combinedMessage += `\n\n--- Past Conversation ---\n${historyContext}\n-----------------------`;
        }
        combinedMessage += `\n\nUser: ${message}`;

        const response = await fetch('https://clave-app.onrender.com/api/ischat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                message: combinedMessage,
                model: 'grok-3-mini'
            })
        });

        // Check if response is ok
        if (!response.ok) {
            throw new Error(`API responded with status ${response.status}`);
        }


        const data = await response.json();
        spinner.success({ text: `${character.name} is responding...` });
        return data.text;
    } catch (error) {
        spinner.error({ text: 'Failed to get response' });
        console.error(chalk.red('Error:'), error.message);
        return null;
    }
}
