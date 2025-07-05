import { reqChatGPT, reqClaude, reqDeepSeek, reqGemini } from './bridge.js'


// State variable to keep track of active tab
let activeTab = "CHATGPT";
let llms = {
  "CHATGPT": {key: null, fnc: reqChatGPT, helpLink: 'https://help.openai.com/en/articles/4936850-where-do-i-find-my-openai-api-key'},
  "DEEPSEEK": {key: null, fnc: reqDeepSeek},
  "CLAUDE": {key: null, fnc: reqClaude},
  "GEMINI": {key: null, fnc: reqGemini, helpLink: 'https://ai.google.dev/gemini-api/docs/pricing'},
}

document.addEventListener('DOMContentLoaded', () => {
  for(const llm of Object.keys(llms)){
    llms[llm].key = localStorage.getItem(llm);
  }
  document.getElementById('currentTab__name').innerText = activeTab
  document.getElementById('currentTab__apiLink').href = llms[activeTab].helpLink
  document.getElementById('currentTab_apiKeySubmitted').innerText = llms[activeTab].key ? 'existing key submitted' : 'no key submitted yet'
  const tabButtons = document.querySelectorAll('.tabs button');
  
  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      activeTab = button.dataset.tab;
      document.getElementById('currentTab__name').innerText = activeTab
      document.getElementById('currentTab__apiLink').href = llms[activeTab].helpLink
      document.getElementById('currentTab_apiKeySubmitted').innerText = llms[activeTab].key ? 'existing key submitted' : 'no key submitted yet'
    });
  });

  document.getElementById('requestButton').addEventListener('click', () => {
    makeModelRequest();
  });

  const form = document.getElementById('currentTab__apiForm');
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const apiKey = document.getElementById('currentTab__apiForm--input').value;
    setApiKey(activeTab, apiKey);
  });
});

function setApiKey(llm, key) {
  localStorage.setItem(llm, key);
  llms[llm].key = key;
}

async function makeModelRequest() {
  if (activeTab) {
    if(!llms[activeTab].key){
      document.getElementById('currentTab__content').innerText = `please insert you're api key for ${activeTab}`
      return
    }

    const query = document.getElementById('currentTab__input--input').value;

    const activeLLM = llms[activeTab]
    const content = await activeLLM.fnc(activeLLM.key, query)
    document.getElementById('currentTab__content').innerText = JSON.stringify(content)
  } else {
    alert('No tab selected yet.');
  }
}