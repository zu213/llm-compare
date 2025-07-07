import { reqChatGPT, reqClaude, reqDeepSeek, reqGemini } from './bridge.js'


// State variable to keep track of active tab
let activeTab = "CHATGPT";
let llms = {
  "CHATGPT": {key: null, fnc: reqChatGPT, convo: {user: '', bot: ''}, helpLink: 'https://help.openai.com/en/articles/4936850-where-do-i-find-my-openai-api-key'},
  "DEEPSEEK": {key: null, fnc: reqDeepSeek, convo: {user: '', bot: ''}},
  "CLAUDE": {key: null, fnc: reqClaude, convo: {user: '', bot: ''}, helpLink: 'https://www.anthropic.com/api'},
  "GEMINI": {key: null, fnc: reqGemini, convo: {user: '', bot: ''}, helpLink: 'https://ai.google.dev/gemini-api/docs/pricing'},
}

document.addEventListener('DOMContentLoaded', () => {
  for(const llm of Object.keys(llms)){
    llms[llm].key = localStorage.getItem(llm);
  }
  document.getElementById('current-tab__name').innerText = activeTab
  document.getElementById('api-key-form__apiLink').href = llms[activeTab].helpLink
  document.getElementById('api-key-form_apiKeySubmitted').innerText = llms[activeTab].key ? 'existing key submitted' : 'no key submitted yet'
  const tabButtons = document.querySelectorAll('.tabs button');
  
  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      activeTab = button.dataset.tab;
      document.getElementById("current-tab__input--input").addEventListener("keydown", async (e) => {
        //makeModelRequest();
        if(e.keyCode === 13){
          e.preventDefault(); // Ensure it is only this code that runs

          await makeModelRequest()
          alert("Enter was pressed was presses");
        }
        console.log(e)
      });
      document.getElementById('current-tab__name').innerText = activeTab
      document.getElementById('api-key-form__apiLink').href = llms[activeTab].helpLink
      document.getElementById('api-key-form_apiKeySubmitted').innerText = llms[activeTab].key ? 'existing key submitted' : 'no key submitted yet'
    });
  });

  document.getElementById('requestButton').addEventListener('click', () => {
    makeModelRequest();
  });

  const form = document.getElementById('api-key-form__apiForm');
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const apiKey = document.getElementById('api-key-form__apiForm--input').value;
    setApiKey(activeTab, apiKey);
  });
});

function setApiKey(llm, key) {
  localStorage.setItem(llm, key);
  llms[llm].key = key;
}

async function makeModelRequest() {
  if (activeTab) {
    const queryInputElement = document.getElementById('current-tab__input--input');
    if(!llms[activeTab].key || !queryInputElement.value){
      //document.getElementById('current-tab__content').innerText = `please insert you're api key for ${activeTab}`
      return
    }

    const activeLLM = llms[activeTab]
    // Content should be a HTML string
    console.log(queryInputElement.value)
    const content = await activeLLM.fnc(activeLLM.key, queryInputElement.value)
    const contentElement = document.querySelector('.current-tab__content')
    contentElement.innerHTML = `${contentElement.innerHTML}<div>${queryInputElement.value}</div> <div>${content}</div>`
    llms[activeTab].convo.user += ''
    llms[activeTab].convo.bot += ''
    queryInputElement.value = ''
  } else {
    alert('No tab selected yet.');
  }
}

export function handleFormPress(e) {
  if(e.keyCode === 13){
    e.preventDefault(); // Ensure it is only this code that runs

    alert("Enter was pressed was presses");
  }
}