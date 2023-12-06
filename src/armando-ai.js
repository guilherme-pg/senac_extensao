'use strict'
import OpenAI from 'openai'; 

export async function getAssistantMessage (msg, messageHistory) {
    const openai = new OpenAI({apiKey: localStorage.getItem('openaiKey'), dangerouslyAllowBrowser: true });

    var messages = new Array();
    const delimiter = '####';

    messages = messages.concat(
        [{
            content: `
                Você é um assistente especialista em triagem de pacientes para uma Unidade de Atendimento de Saúde.
                A seguir o usuário irá enviar perguntas. Sempre responda considerando a gravidade da situação de saúde do paciente.
		Considere a ordem de prioridade para atendimento: emergência, urgência, grupo de prioridade, atendimento clínico geral.
		Os grupos prioritários são: idosos acima de 60 anos, pessoas com deficiência, gestantes, bebês, crianças menores de 10 anos.
		Idosos acima de 80 anos tem prioridade maior do que os acima de 60 anos e menos de 80 anos.
		No atendimento clínico geral será dada prioridade quem tem consulta agendada, em seguida será considerado a ordem de chegada.
		O horário de atendimento é das 7 horas da manhã até as 12 horas e das 14 horas até as 18 horas.
		Apenas emergências e urgências podem ser atendidas fora desse horário.
                A mensagem do usuário está após o delimitador ` + delimiter,
            role: 'system'   
        }],
        messageHistory,
        [{
            content : delimiter + ' ' + msg,
            role : 'user'
        }]
    );
    
    const chatParams = {
        model: "gpt-3.5-turbo", // The model to use
        messages: messages,
        temperature: 0.5, // The randomness of the completion
        frequency_penalty: 0.1, // The penalty for repeating words or phrases
        presence_penalty: 0.1 // The penalty for mentioning new entities
    };

    const completion = await openai.chat.completions.create(chatParams);
    return completion.choices[0].message;
}