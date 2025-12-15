import { createSpinner } from 'nanospinner';
import chalk from 'chalk';

export async function callClaveAPI(message, character, userName) {
    const spinner = createSpinner('Thinking...').start();

    try {
        const systemPrompt = character.prompt.replace(/{userName}/g, userName);

        const combinedMessage = `${systemPrompt}\n\nUser: ${message}`;

        const response = await fetch('https://clave-app.onrender.com/api/ischat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                message: combinedMessage,
                model: 'gpt-oss-120b'
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
