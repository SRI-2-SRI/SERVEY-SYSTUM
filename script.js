document.addEventListener('DOMContentLoaded', function() {
    // DOM elements
    const surveyCreator = document.getElementById('surveyCreator');
    const surveyViewer = document.getElementById('surveyViewer');
    const surveyResults = document.getElementById('surveyResults');
    const questionsContainer = document.getElementById('questionsContainer');
    const addQuestionBtn = document.getElementById('addQuestionBtn');
    const saveSurveyBtn = document.getElementById('saveSurveyBtn');
    const displaySurveyTitle = document.getElementById('displaySurveyTitle');
    const surveyQuestionsContainer = document.getElementById('surveyQuestionsContainer');
    const submitSurveyBtn = document.getElementById('submitSurveyBtn');
    const createNewSurveyBtn = document.getElementById('createNewSurveyBtn');
    
    let currentSurvey = {
        title: '',
        questions: []
    };
    
    // Question types
    const questionTypes = [
        { value: 'text', label: 'Text Answer' },
        { value: 'radio', label: 'Multiple Choice (Single Answer)' },
        { value: 'checkbox', label: 'Multiple Choice (Multiple Answers)' },
        { value: 'number', label: 'Numeric Answer' },
        { value: 'textarea', label: 'Long Text Answer' }
    ];
    
    // Add question button click handler
    addQuestionBtn.addEventListener('click', function() {
        addQuestion();
    });
    
    // Save survey button click handler
    saveSurveyBtn.addEventListener('click', function() {
        saveSurvey();
    });
    
    // Submit survey button click handler
    submitSurveyBtn.addEventListener('click', function() {
        submitSurvey();
    });
    
    // Create new survey button click handler
    createNewSurveyBtn.addEventListener('click', function() {
        resetSurvey();
    });
    
    // Function to add a new question
    function addQuestion(questionData) {
        const questionId = Date.now();
        const questionDiv = document.createElement('div');
        questionDiv.className = 'question';
        questionDiv.dataset.id = questionId;
        
        questionDiv.innerHTML = `
            <div class="form-group">
                <label>Question Text:</label>
                <textarea class="question-text" placeholder="Enter your question">${questionData?.text || ''}</textarea>
            </div>
            <div class="form-group">
                <label>Question Type:</label>
                <select class="question-type">
                    ${questionTypes.map(type => 
                        `<option value="${type.value}" ${questionData?.type === type.value ? 'selected' : ''}>${type.label}</option>`
                    ).join('')}
                </select>
            </div>
            <div class="options-container" style="${questionData?.type === 'radio' || questionData?.type === 'checkbox' ? '' : 'display: none;'}">
                <label>Options:</label>
                <div class="options-list">
                    ${questionData?.options ? questionData.options.map(option => `
                        <div class="option-input">
                            <input type="text" value="${option}" placeholder="Option text">
                            <button type="button" class="remove-option-btn">Remove</button>
                        </div>
                    `).join('') : `
                        <div class="option-input">
                            <input type="text" placeholder="Option text">
                            <button type="button" class="remove-option-btn">Remove</button>
                        </div>
                        <div class="option-input">
                            <input type="text" placeholder="Option text">
                            <button type="button" class="remove-option-btn">Remove</button>
                        </div>
                    `}
                </div>
                <button type="button" class="add-option-btn">Add Option</button>
            </div>
            <button type="button" class="remove-question-btn remove-btn">Remove Question</button>
        `;
        
        questionsContainer.appendChild(questionDiv);
        
        // Add event listeners for the new question
        const typeSelect = questionDiv.querySelector('.question-type');
        typeSelect.addEventListener('change', function() {
            const optionsContainer = questionDiv.querySelector('.options-container');
            if (this.value === 'radio' || this.value === 'checkbox') {
                optionsContainer.style.display = 'block';
            } else {
                optionsContainer.style.display = 'none';
            }
        });
        
        questionDiv.querySelector('.add-option-btn').addEventListener('click', function() {
            const optionsList = questionDiv.querySelector('.options-list');
            const optionInput = document.createElement('div');
            optionInput.className = 'option-input';
            optionInput.innerHTML = `
                <input type="text" placeholder="Option text">
                <button type="button" class="remove-option-btn">Remove</button>
            `;
            optionsList.appendChild(optionInput);
            
            optionInput.querySelector('.remove-option-btn').addEventListener('click', function() {
                optionsList.removeChild(optionInput);
            });
        });
        
        // Add event listeners for existing remove option buttons
        questionDiv.querySelectorAll('.remove-option-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                if (questionDiv.querySelectorAll('.option-input').length > 1) {
                    this.parentElement.remove();
                } else {
                    alert('A question must have at least one option.');
                }
            });
        });
        
        questionDiv.querySelector('.remove-question-btn').addEventListener('click', function() {
            questionsContainer.removeChild(questionDiv);
        });
    }
    
    // Function to save the survey
    function saveSurvey() {
        const surveyTitle = document.getElementById('surveyTitle').value.trim();
        
        if (!surveyTitle) {
            alert('Please enter a survey title.');
            return;
        }
        
        const questions = [];
        const questionElements = questionsContainer.querySelectorAll('.question');
        
        if (questionElements.length === 0) {
            alert('Please add at least one question to the survey.');
            return;
        }
        
        questionElements.forEach(questionEl => {
            const text = questionEl.querySelector('.question-text').value.trim();
            const type = questionEl.querySelector('.question-type').value;
            
            if (!text) {
                alert('Please enter text for all questions.');
                return;
            }
            
            const question = {
                id: questionEl.dataset.id,
                text,
                type
            };
            
            if (type === 'radio' || type === 'checkbox') {
                const options = [];
                questionEl.querySelectorAll('.options-list .option-input input').forEach(input => {
                    const optionText = input.value.trim();
                    if (optionText) {
                        options.push(optionText);
                    }
                });
                
                if (options.length < 2) {
                    alert('Multiple choice questions must have at least two options.');
                    return;
                }
                
                question.options = options;
            }
            
            questions.push(question);
        });
        
        currentSurvey = {
            title: surveyTitle,
            questions
        };
        
        displaySurvey();
    }
    
    // Function to display the survey for respondents
    function displaySurvey() {
        displaySurveyTitle.textContent = currentSurvey.title;
        surveyQuestionsContainer.innerHTML = '';
        
        currentSurvey.questions.forEach((question, index) => {
            const questionDiv = document.createElement('div');
            questionDiv.className = 'survey-question';
            
            const questionLabel = document.createElement('label');
            questionLabel.textContent = `${index + 1}. ${question.text}`;
            questionDiv.appendChild(questionLabel);
            
            // Create input based on question type
            if (question.type === 'text') {
                const input = document.createElement('input');
                input.type = 'text';
                input.name = `q_${question.id}`;
                input.placeholder = 'Your answer...';
                questionDiv.appendChild(input);
            } else if (question.type === 'number') {
                const input = document.createElement('input');
                input.type = 'number';
                input.name = `q_${question.id}`;
                input.placeholder = 'Enter a number...';
                questionDiv.appendChild(input);
            } else if (question.type === 'textarea') {
                const textarea = document.createElement('textarea');
                textarea.name = `q_${question.id}`;
                textarea.placeholder = 'Your detailed answer...';
                textarea.rows = 4;
                questionDiv.appendChild(textarea);
            } else if (question.type === 'radio') {
                question.options.forEach((option, i) => {
                    const optionDiv = document.createElement('div');
                    
                    const radio = document.createElement('input');
                    radio.type = 'radio';
                    radio.name = `q_${question.id}`;
                    radio.value = option;
                    radio.id = `q_${question.id}_opt_${i}`;
                    
                    const label = document.createElement('label');
                    label.htmlFor = `q_${question.id}_opt_${i}`;
                    label.textContent = option;
                    
                    optionDiv.appendChild(radio);
                    optionDiv.appendChild(label);
                    questionDiv.appendChild(optionDiv);
                });
            } else if (question.type === 'checkbox') {
                question.options.forEach((option, i) => {
                    const optionDiv = document.createElement('div');
                    
                    const checkbox = document.createElement('input');
                    checkbox.type = 'checkbox';
                    checkbox.name = `q_${question.id}_opt_${i}`;
                    checkbox.value = option;
                    checkbox.id = `q_${question.id}_opt_${i}`;
                    
                    const label = document.createElement('label');
                    label.htmlFor = `q_${question.id}_opt_${i}`;
                    label.textContent = option;
                    
                    optionDiv.appendChild(checkbox);
                    optionDiv.appendChild(label);
                    questionDiv.appendChild(optionDiv);
                });
            }
            
            surveyQuestionsContainer.appendChild(questionDiv);
        });
        
        surveyCreator.style.display = 'none';
        surveyViewer.style.display = 'block';
    }
    
    // Function to submit the survey
    function submitSurvey() {
        const responses = {};
        
        currentSurvey.questions.forEach(question => {
            if (question.type === 'checkbox') {
                // For checkbox questions, collect all checked options
                const checkedOptions = [];
                question.options.forEach((option, i) => {
                    const checkbox = document.querySelector(`input[name="q_${question.id}_opt_${i}"]:checked`);
                    if (checkbox) {
                        checkedOptions.push(checkbox.value);
                    }
                });
                responses[question.id] = checkedOptions;
            } else {
                // For other question types
                const input = document.querySelector(`[name="q_${question.id}"]`);
                if (input) {
                    responses[question.id] = input.value;
                }
            }
        });
        
        // In a real application, you would send the responses to a server
        console.log('Survey Responses:', responses);
        
        // Show thank you message
        surveyViewer.style.display = 'none';
        surveyResults.style.display = 'block';
    }
    
    // Function to reset the survey creator
    function resetSurvey() {
        document.getElementById('surveyTitle').value = '';
        questionsContainer.innerHTML = '';
        currentSurvey = {
            title: '',
            questions: []
        };
        
        surveyResults.style.display = 'none';
        surveyCreator.style.display = 'block';
    }
    
    // Initialize with one question
    addQuestion();
});