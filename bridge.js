
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
        messages: [
          { role: "system", content: "You are a helpful assistant." },
          { role: "user", content: query },
        ],
      }),
    });
    if(response.ok){
      const data = await response.json();
      return data
    } else {
      console.log(response)
      //alert(`API NOT WORKING ${response}`)
      return response
    }
  } catch(err){
    console.log(err)
    //alert(err)
    return(err)
  }
}

export async function reqDeepSeek(){
   const response = await fetch("https://api.deepseek.com/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer YOUR_API_KEY`,
    },
    body: JSON.stringify({
      model: "deepseek-chat",
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: "Hello, how are you?" },
      ],
      "stream": false
    }),
  });

  const data = await response.json();
  console.log(data.choices[0].message.content);
}

export async function reqClaude(){
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': 'YOUR_ANTHROPIC_API_KEY',
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json'
    },
    body: JSON.stringify({
      model: 'claude-opus-4-20250514',
      max_tokens: 1024,
      messages: [
        { role: 'user', content: 'Hello, world' }
      ]
    })
  })

  if(response.ok){
    const data = await response.json();
    console.log(data.choices[0].message.content);
    return data
  } else {
    alert(`API NOT WORKING ${data}`)
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
      break
    case 'CLAUDE':
      break
    case 'GEMINI':
      return geminiQueryHistory.map(e => e.parts[0].text)
    default:
      return 'Unable to load this models history'
  }
}