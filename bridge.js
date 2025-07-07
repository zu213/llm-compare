
var chatgptQueryHistory = []
var deepseekQueryHistory = []
var claudeQueryHistory = []
var geminiQueryHistory = []

export async function reqChatGPT(apiKey, query){
  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: chatgptQueryHistory.concat({ role: 'user', content: `${query}`}),
      }),
    });
    if(response.ok){
      const data = await response.json();
      const finalText = data?.choices[0]?.message.content
      chatgptQueryHistory.push({ role: 'user',content: `${query}`})
      chatgptQueryHistory.push({ role: 'assistant', content: `${finalText}`})
      return finalText
    } else {
      return response
    }
  } catch(err){
    return(err)
  }
}

export async function reqDeepSeek(apiKey, query){
  try {
    const response = await fetch("https://api.deepseek.com/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: deepseekQueryHistory.concat({ role: 'user', content: `${query}`}),
        "stream": false
      }),
    })
    if(response.ok){
      const data = await response.json();
      const finalText = data?.choices[0]?.message.content
      deepseekQueryHistory.push({ role: 'user',content: `${query}`})
      deepseekQueryHistory.push({ role: 'assistant', content: `${finalText}`})
      return finalText
    } else {
      const data = await response.json()
      return data.error?.message ?? 'No error found'
    }
  } catch(err){
    return(err)
  }
}

export async function reqClaude(apiKey, query){
  try{
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': `${apiKey}`,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        model: 'claude-opus-4-20250514',
        max_tokens: 1024,
        messages: [
          claudeQueryHistory.concat({ role: 'user', content: `${query}`}),
        ]
      })
    })

    if(response.ok){
      const data = await response.json();
      const finalText = data?.choices[0]?.message.content
      claudeQueryHistory.push({ role: 'user',content: `${query}`})
      claudeQueryHistory.push({ role: 'assistant', content: `${finalText}`})
      return finalText
    } else {
      const data = await response.json()
      return data.error?.message ?? 'No error found'
    }
  } catch(err){
    return(err)
  }
}

export async function reqGemini(apiKey, query){
  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: geminiQueryHistory.concat([{ role: 'user', parts: [ { text: `${query}`} ] }])
      })
    })
    if(response.ok){
      const data = await response.json();
      const parts = data?.candidates[0]?.content?.parts
      if(!parts) return 'Error parts not found'
      let finalText = ''
      for(const part of parts){
        finalText += part.text
      }
      geminiQueryHistory.push([{ role: 'user', parts: [ { text: `${query}`} ] }])
      geminiQueryHistory.push([{ role: 'model', parts: [ { text: `${finalText}`} ] }])
      return finalText
    } else {
      const data = await response.json()
      return data.error?.message ?? 'No error found'
    }
  } catch(err){
    return(err)
  }
}

export async function getHistory(model) {
  switch (model) {
    case 'CHATGPT':
      break
    case 'DEEPSEEK':
      return deepseekQueryHistory.map(e => e.parts[0].text)
    case 'CLAUDE':
      break
    case 'GEMINI':
      return geminiQueryHistory.map(e => e.parts[0].text)
    default:
      return 'Unable to load this models history'
  }
}