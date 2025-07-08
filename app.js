import { reqChatGPT, reqClaude, reqDeepSeek, reqGemini } from './bridge.js'


// State variable to keep track of active tab
let activeTab = "CHATGPT";
let llms = {
  "CHATGPT": {key: null, fnc: reqChatGPT, helpLink: 'https://help.openai.com/en/articles/4936850-where-do-i-find-my-openai-api-key'},
  "DEEPSEEK": {key: null, fnc: reqDeepSeek},
  "CLAUDE": {key: null, fnc: reqClaude, helpLink: 'https://www.anthropic.com/api'},
  "GEMINI": {key: null, fnc: reqGemini, helpLink: 'https://ai.google.dev/gemini-api/docs/pricing'},
}

for(const llm of Object.keys(llms)){
  llms[llm].key = localStorage.getItem(llm);
}

document.addEventListener('DOMContentLoaded', () => {

  // set initial values
  document.querySelector('.api-key-form__apiLink').href = llms[activeTab].helpLink
  const keySubmittedEl = document.querySelector('.api-key-form__apiKeySubmitted')
  keySubmittedEl.innerText = llms[activeTab].key ? 'Existing key submitted' : 'Invalid key submitted yet'
  if(llms[activeTab].key) {
    keySubmittedEl.classList.add('healthy')
  } else {
    keySubmittedEl.classList.remove('healthy')
  }
  const tabButtons = document.querySelectorAll('.tabs button');
  const tabHolder = document.querySelector('.tab-holder')

  // setup tab and tab buttons
  tabButtons.forEach(button => {
    const tab = document.createElement('div')
    tab.innerHTML = `<div data-tab=${button.dataset.tab} class="tab__content"></div>`
    tab.classList.add('tab')
    if(button.dataset.tab == activeTab) {
      tab.classList.add('current-tab')
      button.classList.add('active')
    }
    tabHolder.appendChild(tab)
    button.addEventListener('click', () => {
      activeTab = button.dataset.tab
      switchTab(activeTab)
    })
  });

  // setup form submit
  document.querySelector('.prompt-input--input').addEventListener('keydown', async (e) => {
    if(e.keyCode === 13){
      e.preventDefault();
      await makeModelRequests()
    }
  });

  document.querySelector('.prompt-submit--button').addEventListener('click', () => {
    makeModelRequests();
  });

  // setup form api
  document.querySelector('.api-key-form__apiForm').addEventListener('submit', (event) => {
    event.preventDefault();
    setApiKey(activeTab);
  });
});

function switchTab(activeTab){
  document.querySelectorAll('.tabs button').forEach(button => {
    button.classList.remove('active')
          console.log(activeTab)
    if(button.dataset.tab == activeTab) {
      button.classList.add('active')
    }
  })
  document.querySelector('.current-tab').classList.remove('current-tab')
  document.querySelectorAll('.tab__content').forEach(tab => {
    if(tab.dataset.tab == activeTab) {
      tab.parentElement.classList.add('current-tab')
    }
  })
  document.querySelector('.api-key-form__apiLink').href = llms[activeTab].helpLink
  const keySubmittedEl = document.querySelector('.api-key-form__apiKeySubmitted')
  keySubmittedEl.innerText = llms[activeTab].key ? 'Existing key submitted' : 'Invalid key submitted yet'
  if(llms[activeTab].key) {
    keySubmittedEl.classList.add('healthy')
  } else {
    keySubmittedEl.classList.remove('healthy')
  }
}

function setApiKey(llm) {
  const apiKey = document.querySelector('.api-key-form__apiForm--input').value;
  localStorage.setItem(llm, apiKey);
  llms[llm].key = apiKey;
}

async function makeModelRequests() {
  const queryInputElement = document.querySelector('.prompt-input--input');

  const query = queryInputElement.value
  const llmPromises = [...document.querySelectorAll('.tab__content')].map(async (el) => {
    const currentTab = el.dataset.tab

    if(!query){
      return
    }
    if(!llms[currentTab].key){
      el.innerHTML = `${el.innerHTML}<div markdown="1" class="chat__user">${query}</div> <div  class="chat__bot warning">Invalid api key</div>`
      return
    }

    const activeLLM = llms[currentTab]
    // Content should be a HTML string
    return activeLLM.fnc(activeLLM.key, query).then(({content, code}) => {
      el.innerHTML = `${el.innerHTML}<div markdown="1" class="chat__user">${query}</div> <div class="chat__bot ${code == 1 ? 'warning': ''}">${content}</div>`
    })
  })
  await Promise.all(llmPromises).then(() => queryInputElement.value = '')
}